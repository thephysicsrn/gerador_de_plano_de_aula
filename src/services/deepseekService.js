// Serviço de Inteligência Artificial — Suporte a Google Gemini (gratuito) e DeepSeek

import { getStoredApiKey, getStoredGeminiKey } from '../utils/storage';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Chamada à API do Google Gemini (GRATUITA)
 */
export async function callGeminiAPI(messages) {
  let apiKey = getStoredGeminiKey() || import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    throw new Error('SEM_CHAVE_GEMINI');
  }

  // Converte o formato OpenAI messages para o formato Gemini
  const systemMsg = messages.find(m => m.role === 'system');
  const userMsg = messages.find(m => m.role === 'user');

  const contents = [];
  if (systemMsg) {
    // Gemini trata system como primeira mensagem de usuário com instrução de sistema
    contents.push({ role: 'user', parts: [{ text: systemMsg.content }] });
    contents.push({ role: 'model', parts: [{ text: 'Entendido. Vou seguir essas instruções.' }] });
  }
  if (userMsg) {
    contents.push({ role: 'user', parts: [{ text: userMsg.content }] });
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 400 || response.status === 403) {
      throw new Error('Chave do Google Gemini inválida ou sem permissão.');
    } else if (response.status === 429) {
      throw new Error('Limite de requisições do Gemini excedido. Tente novamente em alguns instantes.');
    }
    throw new Error(errorData.error?.message || `Erro no servidor Gemini (HTTP ${response.status})`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Chamada à API da DeepSeek
 */
export async function callDeepSeekAPI(messages, userApiKey = '') {
  let apiKey = userApiKey.trim() || getStoredApiKey();

  if (apiKey === 'eduplan_system_free_key') {
    apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
  }

  if (!apiKey) {
    throw new Error('SEM_CHAVE_DEEPSEEK');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7,
      max_tokens: 6000,
      stream: false
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error('Chave de API do DeepSeek inválida ou não autorizada.');
    } else if (response.status === 429) {
      throw new Error('Limite de requisições excedido ou saldo insuficiente na API DeepSeek.');
    } else {
      throw new Error(errorData.error?.message || `Erro no servidor DeepSeek (Código HTTP ${response.status})`);
    }
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * Dispatcher unificado: tenta Gemini (gratuito) primeiro, depois DeepSeek
 */
export async function callAI(messages) {
  const hasGemini = !!(getStoredGeminiKey() || import.meta.env.VITE_GEMINI_API_KEY);
  const hasDeepSeek = !!(getStoredApiKey() && getStoredApiKey() !== 'eduplan_system_free_key') ||
    !!(import.meta.env.VITE_DEEPSEEK_API_KEY);

  if (hasGemini) {
    return await callGeminiAPI(messages);
  }
  if (hasDeepSeek) {
    return await callDeepSeekAPI(messages);
  }
  throw new Error('Nenhuma Chave de API configurada. Utilizando o gerador pedagógico nativo gratuito.');
}

/**
 * Gerador de Plano de Aula ULTRA DETALHADO via DeepSeek
 */
export async function generateLessonPlanWithAI(formData, apiKey = '') {
  const {
    disciplina,
    anoSerie,
    tempoAula,
    conteudoProgramatico,
    habilidadesBNCC,
    tipoMetodologia,
    observacoesEspeciais
  } = formData;

  const promptSystem = `Você é um consultor pedagógico e doutor em Didática da Educação Básica Brasileira (BNCC).
Sua missão é gerar um Plano de Aula EXTREMAMENTE DETALHADO, rigoroso, rico pedagogicamente e pronto para aplicação em sala de aula.
Retorne APENAS um objeto JSON válido (sem cercas markdown de código \`\`\`json) com a seguinte estrutura minuciosa:
{
  "titulo": "Título instigante e norteador da aula",
  "objetivoGeral": "Objetivo geral da aula com verbo no infinitivo conforme a Taxonomia de Bloom, detalhando a competência final",
  "objetivosEspecificos": [
    "Objetivo conceitual 1 detalhado (saber)",
    "Objetivo procedimental 2 detalhado (saber fazer)",
    "Objetivo atitudinal 3 detalhado (saber ser/conviver)",
    "Objetivo crítico 4 detalhado (analisar e sintetizar)"
  ],
  "habilidadesDetalhadas": [
    {
      "code": "CÓDIGO_BNCC",
      "descricaoOficial": "Descrição da BNCC",
      "detalhamento": "Explicação minuciosa de como o professor media esta habilidade na prática em sala"
    }
  ],
  "desenvolvimentoPassoAPasso": [
    {
      "etapa": "1. Sensibilização e Conhecimentos Prévios",
      "tempo": "10 min",
      "descricao": "Detalhamento das ações do professor, pergunta disparadora e como os alunos interagem"
    },
    {
      "etapa": "2. Problematização Didática e Mediação Teórica",
      "tempo": "15 min",
      "descricao": "Explicação do conteúdo, mediação com recursos visuais e esclarecimento de dúvidas"
    },
    {
      "etapa": "3. Prática Guiada e Atividade Colaborativa em Grupo",
      "tempo": "20 min",
      "descricao": "Dinâmica prática detalhada aplicando a metodologia ativa, divisão de papéis dos alunos e acompanhamento"
    },
    {
      "etapa": "4. Fechamento, Síntese Coletiva e Avaliação Formativa",
      "tempo": "5 min",
      "descricao": "Consolidação dos aprendizados, apresentação dos grupos e verificação final"
    }
  ],
  "estrategiaMetodologica": "Descrição aprofundada da metodologia ativa aplicada, explicando a fundamentação didática e como garante o protagonismo dos estudantes.",
  "recursosDidaticos": [
    "Lista detalhada de materiais físicos (quadro, fichas, livros)",
    "Lista de recursos digitais ou audiovisuais (projetor, vídeos, aplicativos)",
    "Materiais de consumo e manipulação prática"
  ],
  "avaliacaoFormativa": "Critérios detalhados de avaliação contínua, rúbricas de participação, observação de competências socioemocionais e instrumentos de registro.",
  "atividadesFixacao": "Proposta pedagógica completa de atividade complementar para consolidação da aprendizagem ou tarefa de casa orientada.",
  "adaptacaoInclusiva": "Diretrizes e estratégias práticas de acessibilidade pedagógica e diferenciação para estudantes com TEA, TDAH ou diferentes ritmos de aprendizagem."
}`;

  const promptUser = `Elabore este Plano de Aula com o máximo nível de detalhamento pedagógico:
- Disciplina: ${disciplina}
- Série/Ano Escolar: ${anoSerie}
- Duração da Aula: ${tempoAula}
- Conteúdo Programático: ${conteudoProgramatico}
- Habilidades BNCC selecionadas: ${habilidadesBNCC.map(h => `${h.code}: ${h.description}`).join('; ')}
- Metodologia de preferência: ${tipoMetodologia || 'Metodologia Ativa e Participativa'}
- Contexto da Turma / Observações: ${observacoesEspeciais || 'Turma heterogênea necessitando de estímulo ao trabalho colaborativo e foco em metodologias ativas.'}`;

  try {
    const rawResult = await callAI([
      { role: 'system', content: promptSystem },
      { role: 'user', content: promptUser }
    ]);

    const cleanJsonText = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (err) {
    console.warn('Utilizando gerador pedagógico nativo detalhado como fallback:', err.message);
    return generateMockLessonPlan(formData);
  }
}

/**
 * Gerador de PEI ULTRA DETALHADO, ROBUSTO E COMPLETO via IA (MEC / AEE / LBI)
 */
export async function generatePeiWithAI(formData, apiKey = '') {
  const {
    nomeAluno,
    anoSerie,
    disciplina,
    necessidadeEspecial,
    diagnosticoHistorico,
    habilidadesAtuais,
    habilidadesBNCCAlvo,
    recursosAcessibilidade
  } = formData;

  const promptSystem = `Você é um doutor e consultor sênior em Educação Especial Inclusiva, Atendimento Educacional Especializado (AEE) e Neuropsicopedagogia Institucional, especialista nas diretrizes da Lei Brasileira de Inclusão (Lei nº 13.146/2015) e da BNCC.

Sua missão é elaborar um **Plano de Ensino Individualizado (PEI) Completo, Robusto, Minucioso e Profissional**, pronto para ser homologado pela equipe pedagógica, sala de recursos multifuncionais (SRM) e coordenação escolar.

Retorne APENAS um objeto JSON válido (sem cercas markdown de código \`\`\`json) com a seguinte estrutura EXATA:
{
  "diagnosticoFuncional": "Avaliação pedagógica funcional minuciosa: histórico do estudante, características cognitivas, estilo e canal preferencial de aprendizagem (visual, cinestésico, auditivo), nível de atenção sustentada, sociabilidade e barreiras de acesso ao currículo identificadas.",
  "potencialidadesEInteresses": [
    "Potencialidade 1: Hiperfocos, talentos e áreas de maior facilidade que serão usados como âncoras pedagógicas",
    "Potencialidade 2: Habilidades socioemocionais e pontos fortes de engajamento",
    "Potencialidade 3: Formas funcionais de expressão e interação com pares"
  ],
  "barreirasAprendizagemIdentificadas": [
    "Barreira 1: Sobrecarga sensorial / necessidade de previsibilidade e rotina estruturada",
    "Barreira 2: Dificuldade na compreensão de instruções abstratas ou muito extensas",
    "Barreira 3: Necessidade de tempo estendido e mediação direta na realização de tarefas complexas"
  ],
  "objetivosCurricularesAdaptados": {
    "curtoPrazo": [
      "Meta de 1 a 2 meses: Objetivo de adaptação imediata focado em acolhimento, engajamento e rotina",
      "Meta de 1 a 2 meses: Compreensão inicial dos conceitos fundamentais por meio de material concreto/visual"
    ],
    "medioPrazo": [
      "Meta semestral: Consolidação das habilidades adaptadas com redução gradual da mediação direta",
      "Meta semestral: Participação colaborativa em pequenos grupos e realização autônoma de atividades estruturadas"
    ],
    "longoPrazo": [
      "Meta anual: Desenvolvimento pleno da autonomia acadêmica e aplicação funcional das competências da BNCC para a sua faixa etária"
    ]
  },
  "adaptacoesHabilidadesBNCC": [
    {
      "code": "CÓDIGO_BNCC",
      "descricaoBNCC": "Descrição oficial da habilidade",
      "objetivoAdaptado": "Objetivo de aprendizagem flexibilizado especificamente para o estudante",
      "estrategiaDidatica": "Como o professor regente trabalhará esta habilidade em sala de aula passo a passo",
      "recursoApoio": "Material adaptado, suporte visual ou ferramenta concreta utilizada"
    }
  ],
  "estrategiasPedagogicasEspeciais": [
    "Estratégia 1 (Rotina & Previsibilidade): Uso de agenda visual na carteira, antecipação de mudanças de atividade e transições suaves",
    "Estratégia 2 (Comunicação & Enunciados): Comandos em passos únicos, diretos, com palavras-chave em destaque e linguagem clara e literal",
    "Estratégia 3 (Mediação Pedagógica): Mediação intencional do professor, pareamento com colega tutor e pausas ativas de autorregulação a cada 15-20 minutos",
    "Estratégia 4 (Adaptação de Materiais): Redução de estímulos visuais concorrentes na folha, ampliação tipográfica e fragmentação de exercícios"
  ],
  "recursosTecnologiaAssistiva": [
    "Recurso 1 (Comunicação Alternativa & Aumentativa - CAA): Pranchas temáticas de comunicação ou cartões visuais (PECS)",
    "Recurso 2 (Suporte Sensorial & Físico): Fones abafadores de ruído, plano inclinado de escrita ou recursos de alta/baixa tecnologia",
    "Recurso 3 (Recursos Digitais & Pedagógicos): Softwares educativos, jogos de pareamento e manipuláveis táteis"
  ],
  "planoAtendimentoAEE": "Detalhamento da atuação na Sala de Recursos Multifuncionais (SRM): cronograma e frequência semanal sugerida, objetivos do atendimento no contraturno, habilidades cognitivas e metacognitivas prioritárias e articulação contínua com o professor regente da sala comum.",
  "flexibilizacaoAvaliativa": "Diretrizes e instrumentos de avaliação inclusiva: substituição de provas extensas por portfólio de atividades práticas, registro fotográfico/descritivo de avanços, tempo estendido (50% adicional), leitura oral de enunciados pelo professor/mediador e critérios focados na evolução individual em relação ao ponto de partida.",
  "acoesIntegradasFamiliaAEE": "Protocolo de parceria escola-família-terapeutas: reuniões mensais de alinhamento, caderno de recados/comunicação diária ou semanal, continuidade de estratégias de autorregulação e estímulo à autonomia em casa, além de troca de relatórios periódicos com a equipe multidisciplinar de saúde externa.",
  "cronogramaRevisaoPEI": "Datas e marcos periódicos para monitoramento (bimestral ou trimestral), verificação do alcance das metas de curto/médio prazo e ajustes pedagógicos necessários."
}`;

  const promptUser = `Elabore um Plano de Ensino Individualizado (PEI) com o mais alto nível de detalhamento pedagógico, técnico e humano para o seguinte estudante:
- Nome do Estudante: ${nomeAluno || 'Estudante'}
- Série / Ano Escolar: ${anoSerie}
- Componente Curricular / Área: ${disciplina}
- Necessidade Educacional Especial / Diagnóstico: ${necessidadeEspecial}
- Diagnóstico Clínico e Histórico Escolar: ${diagnosticoHistorico || 'Em acompanhamento multidisciplinar; necessita de mediação pedagógica intencional e adaptações de acesso ao currículo.'}
- Habilidades Atuais, Potencialidades e Estilo de Aprendizagem: ${habilidadesAtuais || 'Apresenta boa resposta a estímulos visuais, materiais concretos e rotinas estruturadas.'}
- Habilidades da BNCC a serem Flexibilizadas e Adaptadas: ${habilidadesBNCCAlvo && habilidadesBNCCAlvo.length > 0 ? habilidadesBNCCAlvo.map(h => `${h.code}: ${h.description}`).join('; ') : 'Habilidades essenciais do ano/série no componente de ' + disciplina}
- Recursos e Infraestrutura de Acessibilidade Disponíveis: ${recursosAcessibilidade || 'Sala de Recursos Multifuncionais (AEE), materiais concretos adaptados, apoio visual e equipe pedagógica comprometida.'}

Gere o PEI com riqueza de detalhes práticos, orientações aplicáveis em sala de aula e adaptações específicas para cada uma das habilidades da BNCC listadas.`;

  try {
    const rawResult = await callAI([
      { role: 'system', content: promptSystem },
      { role: 'user', content: promptUser }
    ]);

    let jsonText = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    return JSON.parse(jsonText);
  } catch (err) {
    console.warn('Utilizando gerador de PEI pedagógico nativo detalhado:', err);
    return generateMockPei(formData);
  }
}

/**
 * Fallback local - Geração pedagógica ULTRA DETALHADA sem consumo de API
 */
export function generateMockLessonPlan(formData) {
  const { disciplina, anoSerie, tempoAula, conteudoProgramatico, habilidadesBNCC, tipoMetodologia } = formData;

  const nomeDisciplina = disciplina || 'Componente Curricular';
  const tempo = tempoAula || '50 min';
  const tema = conteudoProgramatico || 'Conteúdo Programático Essencial';
  const metod = tipoMetodologia || 'Metodologia Ativa e Participativa';

  return {
    titulo: `Plano Didático Integrado: ${tema} — ${nomeDisciplina} (${anoSerie || 'Ensino Fundamental'})`,
    objetivoGeral: `Compreender, analisar e aplicar os conceitos fundamentais de ${tema}, mobilizando as competências cognitivas e socioemocionais da BNCC através da abordagem de ${metod}.`,
    objetivosEspecificos: [
      `Conceituar e problematizar os princípios centrais de ${tema} identificando sua presença em situações reais do cotidiano.`,
      `Mobilizar as habilidades da BNCC (${habilidadesBNCC.map(h => h.code).join(', ')}) na resolução de desafios didáticos e atividades investigativas.`,
      `Trabalhar em equipe de forma colaborativa, desenvolvendo escuta ativa, síntese de ideias e argumentação fundamentada.`,
      `Elaborar uma produção autoral ao final da aula demonstrando a consolidação dos aprendizados adquiridos.`
    ],
    habilidadesDetalhadas: habilidadesBNCC.map(h => ({
      code: h.code,
      descricaoOficial: h.description,
      detalhamento: `Mobilização pedagógica da habilidade "${h.code}": O professor mediará o desenvolvimento desta habilidade por meio de questionamentos orientadores, análise guiada do conteúdo e aplicação prática em grupos de estudo.`
    })),
    desenvolvimentoPassoAPasso: [
      {
        etapa: '1. Acolhimento, Sensibilização e Conhecimentos Prévios',
        tempo: '10 min',
        descricao: `O professor inicia a aula com uma acolhida dinâmica e apresenta uma pergunta disparadora sobre ${tema}. Os estudantes compartilham suas percepções iniciais em um mapa mental coletivo no quadro, estimulando a curiosidade e o engajamento.`
      },
      {
        etapa: '2. Problematização Didática e Apresentação do Conceito',
        tempo: '15 min',
        descricao: `Exposição dialogada com mediação de suporte visual (esquemas gráficos ou imagens). O professor problematiza a aplicação de ${tema}, esclarece dúvidas conceituais centrais e estabelece as diretrizes para a atividade prática.`
      },
      {
        etapa: '3. Aplicação Prática e Atividade Colaborativa em Grupo',
        tempo: '20 min',
        descricao: `Aplicação da dinâmica de ${metod}. Os alunos trabalham em grupos de 4 a 5 integrantes para resolver um desafio pedagógico prático relacionado ao tema. O professor circula pelas bancadas oferecendo feedback formativo em tempo real.`
      },
      {
        etapa: '4. Fechamento, Síntese Coletiva e Avaliação Formativa',
        tempo: '5 min',
        descricao: `Um representante de cada grupo compartilha a solução encontrada. O professor realiza a síntese final dos conceitos trabalhados, conecta com a próxima aula e aplica um breve quiz de verificação de aprendizagem.`
      }
    ],
    estrategiaMetodologica: `Aplicação aprofundada da abordagem de ${metod}. Esta estratégia coloca o estudante no centro do processo de aprendizagem (protagonismo infantil/juvenil), promovendo a autonomia intelectual, o pensamento crítico e a construção coletiva do conhecimento através da mediação intencional do docente.`,
    recursosDidaticos: [
      'Quadro interativo / Lousa para mapeamento de ideias',
      'Material impresso com roteiro de estudo e exercícios práticos',
      'Recursos visuais (slides, infográficos ou esquemas conceituais)',
      'Fichas de registro de autoavaliação e participação grupal'
    ],
    avaliacaoFormativa: `Avaliação contínua e processual fundamentada nos seguintes critérios: 1) Engajamento e participação ativa na discussão inicial; 2) Capacidade de trabalho em equipe e argumentação na atividade prática; 3) Domínio conceitual demonstrado na síntese final.`,
    atividadesFixacao: `Elaboração individual de um resumo estruturado de 15 linhas ou mapa conceitual ilustrado relacionando o tema ${tema} com o seu contexto diário, a ser entregue na próxima aula.`,
    adaptacaoInclusiva: `Para estudantes com necessidades de acessibilidade (TEA, TDAH ou Baixa Visão): fornecer roteiro impresso com fonte ampliada e marcadores visuais; utilizar comandos diretos e sequenciados; permitir tempo adicional para a realização da síntese e pareamento com colega tutor.`
  };
}

export function generateMockPei(formData) {
  const { nomeAluno, necessidadeEspecial, disciplina, habilidadesBNCCAlvo } = formData;

  return {
    perfilAluno: `O(a) estudante ${nomeAluno || 'atendido(a)'} apresenta excelente potencial de desenvolvimento quando estimulado(a) por estratégias pedagógicas diferenciadas. No contexto de ${necessidadeEspecial}, demonstra engajamento positivo em atividades estruturadas com apoio de rotina visual e mediação afetiva.`,
    objetivosCurricularesAdaptados: [
      `Apreender os conceitos essenciais do componente de ${disciplina}, fracionando tarefas complexas em etapas menores e alcançáveis.`,
      `Desenvolver autonomia gradual na execução de atividades alinhadas às habilidades da BNCC (${habilidadesBNCCAlvo.map(h => h.code).join(', ')}).`,
      `Fortalecer a comunicação funcional, a atenção sustentada e a interação social positiva no ambiente da sala de aula regular.`
    ],
    estrategiasPedagogicasEspeciais: [
      'Estruturação de rotina visual com cartões de sequência de atividades na carteira do aluno.',
      'Uso de instruções curtas, diretas e exemplificadas com apoio de materiais concretos ou digitais.',
      'Fragmentação do tempo de tarefa em blocos curtos (15 min) intercalados com pausas ativas de autorregulação.',
      'Valorização dos acertos, reforço positivo contingente e pareamento com colegas receptivos.'
    ],
    recursosTecnologiaAssistiva: [
      'Prancha de Comunicação Alternativa e Augmentativa (CAA / Cartões PECS) para expressão de necessidades',
      'Material tátil e adaptado com tipografia ampliada e alto contraste visual',
      'Abafador de ruídos ou cantinho sensorial de autorregulação para momentos de sobrecarga estímulo'
    ],
    flexibilizacaoAvaliativa: 'Avaliação processual por meio de portfólio de acompanhamento diário, atividades adaptadas com suporte visual e tempo flexibilizado para realização, sem foco em provas padronizadas escritas extensas.',
    acoesIntegradasFamiliaAEE: 'Encontros mensais de alinhamento entre o professor regente, a equipe da Sala de Recursos Multifuncionais (AEE) e a família, garantindo a continuidade das estratégias e o acompanhamento do desenvolvimento do estudante.'
  };
}

/**
 * Geração de Sequência Didática (4 a 8 Aulas Encadeadas) com IA
 */
export async function generateDidacticSequenceWithAI(formData, apiKey = '') {
  try {
    const promptSystem = `Você é um doutor em Didática e Educação Básica. Crie uma Sequência Didática Encadeada completa para a unidade temática "${formData.unidadeTematica}". Retorne um JSON válido com: { "titulo": "", "objetivoGeral": "", "aulasEncadeadas": [ { "aulaNumero": "Aula 1", "temaAula": "", "objetivoEspecifico": "", "desenvolvimento": "", "recursos": "", "avaliacaoFormacao": "" } ], "avaliacaoFinalSequencia": "", "referenciasBibliograficas": "" }`;
    const promptUser = `Gere a sequência didática de ${formData.numeroAulas} para ${formData.disciplina} (${formData.anoSerie}) com foco em ${formData.tipoMetodologia}. Habilidades: ${formData.habilidadesBNCC?.map(h => h.code).join(', ')}`;
    const rawResult = await callAI([{ role: 'system', content: promptSystem }, { role: 'user', content: promptUser }]);
    const cleanJsonText = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (e) {
    return generateMockDidacticSequence(formData);
  }
}

export function generateMockDidacticSequence(formData) {
  const { disciplina, anoSerie, numeroAulas, unidadeTematica, habilidadesBNCC, tipoMetodologia } = formData;
  return {
    titulo: `Sequência Didática: ${unidadeTematica || 'Unidade Integrada'} — ${disciplina} (${anoSerie})`,
    objetivoGeral: `Desenvolver a compreensão aprofundada da unidade temática ${unidadeTematica || 'proposta'}, mobilizando as habilidades da BNCC (${habilidadesBNCC?.map(h => h.code).join(', ')}) ao longo de ${numeroAulas} através de ${tipoMetodologia}.`,
    aulasEncadeadas: [
      {
        aulaNumero: "Aula 1 — Problematização e Diagnóstico",
        temaAula: `Introdução a ${unidadeTematica || 'Unidade'} e Levantamento de Hipóteses`,
        objetivoEspecifico: `Identificar conhecimentos prévios e sensibilizar os estudantes para o tema central.`,
        desenvolvimento: `Perguntas disparadoras, mapa mental coletivo no quadro e apresentação da pergunta investigativa do projeto.`,
        recursos: `Quadro digital, imagens impressas e fichas de registro inicial.`,
        avaliacaoFormacao: `Observação direta do engajamento e participação no levantamento de hipóteses.`
      },
      {
        aulaNumero: "Aula 2 — Investigação e Aprofundamento Conceitual",
        temaAula: `Exploração dos Conceitos Chave e Análise Guiada`,
        objetivoEspecifico: `Analisar as variáveis e conceitos teóricos centrais da habilidade.`,
        desenvolvimento: `Estudo dirigido em duplas com roteiro de análise de texto/experimento e sistematização em tabela comparativa.`,
        recursos: `Roteiro impresso com textos curtos e esquemas conceituais.`,
        avaliacaoFormacao: `Análise do preenchimento da tabela de sistematização pelos grupos.`
      },
      {
        aulaNumero: "Aula 3 — Aplicação Prática em Equipe (Metodologia Ativa)",
        temaAula: `Resolução de Problemas / Mão na Massa`,
        objetivoEspecifico: `Aplicar os conceitos aprendidos na elaboração de uma solução prática ou produto parcial.`,
        desenvolvimento: `Rotação por estações ou estação maker onde os estudantes criam um protótipo, infográfico ou maquete explicativa.`,
        recursos: `Materiais recicláveis, cartolinas, tesoura, cola e dispositivos para pesquisa.`,
        avaliacaoFormacao: `Feedback formativo contínuo circulando pelas equipes durante a produção.`
      },
      {
        aulaNumero: "Aula 4 — Apresentação, Síntese e Avaliação Final",
        temaAula: `Feira de Ideias e Consolidação das Aprendizagens`,
        objetivoEspecifico: `Apresentar os resultados, argumentar fundamentos e consolidar o aprendizado final.`,
        desenvolvimento: `Apresentação rápida das equipes (pitch de 3 min), síntese orientada pelo professor e autoavaliação final.`,
        recursos: `Ficha de rubrica de avaliação e mural de exposições.`,
        avaliacaoFormacao: `Avaliação sumativa e formativa por meio de rubrica com critérios claros.`
      }
    ],
    avaliacaoFinalSequencia: `Avaliação global combinando a participação contínua no processo (40%), o produto prático da Aula 3 (30%) e a apresentação com síntese final (30%).`,
    referenciasBibliograficas: `Base Nacional Comum Curricular (BNCC - MEC); Matriz Curricular Institucional; Referenciais de Metodologias Ativas.`
  };
}

/**
 * Geração de Relatório Pedagógico / Parecer Descritivo do Aluno com IA
 */
export async function generatePedagogicalReportWithAI(formData, apiKey = '') {
  try {
    const promptSystem = `Você é um coordenador pedagógico e especialista em Pareceres Descritivos. Crie um Relatório Pedagógico Individual formal, empático e construtivo. Retorne um JSON válido com: { "tituloRelatorio": "", "introducaoContexto": "", "desenvolvimentoCognitivo": "", "desenvolvimentoSocioemocional": "", "pontosFortesDestacados": [], "desafiosECombinados": [], "recomendacoesPedagógicas": "", "consideracoesFinais": "" }`;
    const promptUser = `Gere o relatório de ${formData.nomeAluno} (${formData.anoSerie} - ${formData.disciplina}). Período: ${formData.periodo}. Pontos Fortes: ${formData.pontosFortes}. Desafios: ${formData.desafiosAprendizagem}. Comportamento: ${formData.comportamentoSocioemocional}. Recomendações: ${formData.recomendacoesFamilia}.`;
    const rawResult = await callAI([{ role: 'system', content: promptSystem }, { role: 'user', content: promptUser }]);
    const cleanJsonText = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (e) {
    return generateMockPedagogicalReport(formData);
  }
}

export function generateMockPedagogicalReport(formData) {
  const { nomeAluno, anoSerie, disciplina, periodo, tipoRelatorio, pontosFortes, desafiosAprendizagem, comportamentoSocioemocional, recomendacoesFamilia } = formData;
  const nome = nomeAluno || 'o(a) estudante';
  return {
    tituloRelatorio: `${tipoRelatorio || 'Parecer Descritivo Pedagógico'} — ${nome}`,
    introducaoContexto: `O presente parecer tem como objetivo registrar o acompanhamento pedagógico do(a) estudante ${nome}, regularmente matriculado(a) no ${anoSerie || 'Ensino Fundamental'}, durante o período de ${periodo || 'avaliação'} na disciplina de ${disciplina || 'Componente Curricular'}.`,
    desenvolvimentoCognitivo: `No âmbito do desenvolvimento cognitivo e acadêmico, ${nome} demonstrou uma trajetória de aprendizado positiva. ${pontosFortes || 'Demonstra boa retenção de conteúdos e engajamento nas propostas pedagógicas.'} ${desafiosAprendizagem ? `Identificamos como foco de atenção contínua: ${desafiosAprendizagem}` : 'Mantém um ritmo de estudos consistente.'}`,
    desenvolvimentoSocioemocional: `Em relação aos aspectos sociocomportamentais e à convivência escolar, ${nome} ${comportamentoSocioemocional || 'relaciona-se de maneira respeitosa e harmoniosa com os colegas e equipe docente, participando ativamente das dinâmicas de grupo.'}`,
    pontosFortesDestacados: [
      pontosFortes || 'Participação ativa nas discussões em sala de aula',
      'Cumprimento responsável dos prazos das atividades propostas',
      'Boa capacidade de cooperação e trabalho em equipe'
    ],
    desafiosECombinados: [
      desafiosAprendizagem || 'Aprimoramento do hábito de leitura diária autônoma',
      'Organização contínua do material e tempo de estudo individual'
    ],
    recomendacoesPedagógicas: recomendacoesFamilia || `Recomenda-se à família manter o acompanhamento diário da agenda escolar, estabelecendo uma rotina de estudos em casa e incentivando a leitura extracurricular.`,
    consideracoesFinais: `Reiteramos nossa confiança no contínuo progresso de ${nome} e permanecemos à disposição para parcerias e alinhamentos pedagógicos constantes.`
  };
}

/**
 * Geração de Atividade Adaptada & Acessível com IA
 */
export async function generateAdaptedActivityWithAI(formData, apiKey = '') {
  try {
    const { necessidade, disciplina, anoSerie, nivelSimplificacao, instrucoesExtras, originalText } = formData;

    const promptSystem = `Você é um especialista sênior em Educação Inclusiva, Atendimento Educacional Especializado (AEE) e Acessibilidade Pedagógica com profundo conhecimento em adaptações curriculares para o público-alvo da Educação Especial no Brasil (Lei 13.146/2015 — Lei Brasileira de Inclusão).

## SUA MISSÃO
Analisar a atividade original fornecida pelo professor e gerar uma versão **completamente adaptada e acessível** para estudantes com **${necessidade}**, mantendo o objetivo de aprendizagem da BNCC inalterado.

## ETAPA 1 — ANÁLISE INTELIGENTE DA ATIVIDADE
Antes de adaptar, você DEVE identificar e classificar cada questão/elemento da atividade original:
- **Tipo de questão**: múltipla escolha | dissertativa/aberta | completar lacunas | verdadeiro ou falso | associação/ligar colunas | interpretação de texto | cálculo/problemas matemáticos | produção textual | atividade prática
- **Nível de complexidade cognitiva**: memorização | compreensão | aplicação | análise | síntese
- **Barreiras de acessibilidade identificadas**: vocabulário complexo | frases muito longas | abstração excessiva | muitas etapas simultâneas | dependência de habilidade visual/motora | enunciado confuso

## ETAPA 2 — ESTRATÉGIAS DE ADAPTAÇÃO POR PERFIL
Aplique as estratégias específicas para **${necessidade}**:

### Para TEA (Transtorno do Espectro Autista):
- Linguagem direta, literal e sem ambiguidades ou expressões figuradas
- Enunciados em passo a passo numerado (máx. 1 ação por instrução)
- Rotina visual explícita ("Primeiro leia... Depois responda...")
- Remover informações irrelevantes/distratoras
- Adicionar caixas de apoio com exemplos concretos

### Para TDAH:
- Fragmentar questões longas em microetapas
- Destacar em negrito APENAS a palavra-ação do enunciado
- Adicionar checkboxes ou sistema de progresso ("✅ Feito!")
- Reduzir o número de estímulos simultâneos por página
- Instruções curtas e objetivas com verbo no início

### Para Dislexia:
- Simplificar o vocabulário mantendo o sentido pedagógico
- Aumentar espaçamento implícito entre itens
- Substituir textos longos por versões resumidas e diretas
- Oferecer alternativas de resposta oral/visual quando possível
- Evitar texto em colunas muito estreitas

### Para Baixa Visão / Deficiência Visual:
- Descrever textualmente qualquer elemento visual/imagem presente
- Organizar conteúdo com marcadores claros e hierarquia textual
- Indicar ao professor recursos em áudio e material ampliado

### Para Deficiência Intelectual:
- Usar linguagem simples e cotidiana
- Fragmentar em etapas mínimas com exemplos do dia a dia
- Reduzir número de alternativas em múltipla escolha (máx. 3)
- Adicionar banco de respostas completo
- Indicar possibilidade de adaptação com apoio mediado

### Nível de Flexibilização: **${nivelSimplificacao}**
- **Suave**: Apenas suporte visual (negritos, caixas, pistas), mantendo enunciado original quase intacto
- **Médio**: Reescrever enunciados em linguagem simples + suporte visual + frases curtas
- **Intenso**: Reestruturar completamente cada questão com formato alternativo, banco de respostas obrigatório e orientação de mediação

## ETAPA 3 — PRODUÇÃO DO OUTPUT
Retorne um JSON VÁLIDO e completo com a seguinte estrutura EXATA (sem texto fora do JSON):

{
  "tituloAtividade": "string — título descritivo da atividade adaptada",
  "publicoAlvoAdaptacao": "string — descreva o perfil do estudante e a necessidade atendida",
  "analiseOriginal": "string — sua análise do que foi identificado na atividade original (tipos de questões, barreiras encontradas, estratégias escolhidas)",
  "enunciadoAdaptado": "string — instrução geral acessível para o estudante, com linguagem inclusiva e passo a passo",
  "questoesEExercicios": [
    {
      "numero": "string — ex: Questão 1",
      "tipoOriginal": "string — tipo identificado da questão original",
      "estrategiaAdotada": "string — qual estratégia de adaptação foi usada e por quê",
      "enunciadoSimples": "string — enunciado reescrito de forma acessível",
      "opcoesOuEspaco": "string — alternativas adaptadas, espaço para resposta ou atividade reformulada",
      "dicaAcessibilidade": "string — dica/suporte direto ao estudante para resolver esta questão"
    }
  ],
  "bancoDeRespostasOuApoio": ["string — lista de apoios/respostas/palavras-chave para consulta"],
  "orientacaoAoProfessor": "string — instruções detalhadas sobre como aplicar, mediar e avaliar esta atividade adaptada, incluindo possíveis recursos complementares e flexibilizações de tempo/formato",
  "recursosComplementaresSugeridos": ["string — recursos, estratégias ou materiais extras recomendados"]
}`;

    const promptUser = `ATIVIDADE ORIGINAL PARA ADAPTAR:
---
${originalText}
---

PARÂMETROS DA ADAPTAÇÃO:
- Necessidade Específica: ${necessidade}
- Disciplina: ${disciplina}
- Ano/Série: ${anoSerie}
- Nível de Flexibilização: ${nivelSimplificacao}
- Instruções Adicionais do Professor: ${instrucoesExtras || 'Nenhuma instrução adicional.'}

Analise CUIDADOSAMENTE cada questão da atividade original, identifique seus tipos e barreiras, e gere a adaptação completa e individualizada para cada questão. Retorne APENAS o JSON, sem texto antes ou depois.`;

    const rawResult = await callAI([{ role: 'system', content: promptSystem }, { role: 'user', content: promptUser }]);

    // Extração robusta de JSON — funciona mesmo se a IA adicionar texto antes/depois
    let jsonText = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Tenta encontrar o bloco { } principal caso haja texto extra em volta
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error('Falha ao parsear JSON da IA. Resposta bruta:', rawResult);
      throw new Error('A IA retornou uma resposta inválida. Tente novamente.');
    }

    // Valida campos mínimos esperados
    if (!parsed.questoesEExercicios || !Array.isArray(parsed.questoesEExercicios)) {
      throw new Error('A resposta da IA não contém as questões adaptadas. Tente novamente.');
    }

    return parsed;
  } catch (err) {
    // Se o erro for apenas "sem API key" → usa o gerador nativo gratuito silenciosamente
    const isNoKeyError = err.message?.includes('Nenhuma Chave de API');
    if (isNoKeyError) {
      console.info('Sem API key configurada — usando gerador pedagógico nativo.');
      return generateMockAdaptedActivity(formData);
    }
    // Outros erros (JSON inválido, saldo insuficiente, timeout etc.) → mostra ao usuário
    console.error('Erro ao gerar atividade adaptada com IA:', err);
    throw err;
  }
}

export function generateMockAdaptedActivity(formData) {
  const { originalText, necessidade, disciplina, anoSerie } = formData;
  return {
    tituloAtividade: `Atividade Adaptada: ${disciplina || 'Componente Curricular'} (${anoSerie || 'Ensino Fundamental'})`,
    publicoAlvoAdaptacao: `Adaptação Pedagógica Especializada para: ${necessidade || 'Educação Inclusiva AEE'}`,
    enunciadoAdaptado: `Leia a versão acessível abaixo. As instruções foram organizadas em etapas curtas e diretas com destaques visuais para facilitar a sua compreensão.`,
    questoesEExercicios: [
      {
        numero: "Questão 1 (Versão Acessível)",
        enunciadoSimples: `Com base no tema trabalhado em aula, identifique a opção correta que responde ao exercício.`,
        opcoesOuEspaco: `( A ) Opção Clara 1\n( B ) Opção Clara 2\n( C ) Opção Clara 3`,
        dicaAcessibilidade: `Consulte a caixa de palavras de apoio abaixo se precisar de ajuda para lembrar as respostas.`
      },
      {
        numero: "Questão 2 (Prática Guiada)",
        enunciadoSimples: `Ligue cada palavra da coluna da esquerda ao seu significado correto na coluna da direita.`,
        opcoesOuEspaco: `Palavra A ---------------- (  ) Significado 1\nPalavra B ---------------- (  ) Significado 2`,
        dicaAcessibilidade: `Use lápis colorido para traçar as linhas de associação.`
      }
    ],
    bancoDeRespostasOuApoio: [
      'Dica 1: Lembre-se do exemplo prático trabalhado com o professor.',
      'Dica 2: As palavras em negrito indicam a ação principal esperada.'
    ],
    orientacaoAoProfessor: `Esta atividade foi adaptada reduzindo a carga cognitiva de leitura sem alterar o objetivo central da habilidade da BNCC. Conceder 10 a 15 minutos adicionais se necessário e permitir mediação por colega tutor ou profissional de apoio.`
  };
}

/**
 * Geração de Plano de Curso Anual / Bimestral com IA
 */
export async function generateAnnualCoursePlanWithAI(formData, apiKey = '') {
  try {
    const promptSystem = `Você é um doutor em Gestão Curricular e Didática da Educação Básica. Crie um Plano de Curso Anual completo distribuído por Bimestres Letivos. Retorne um JSON válido com a seguinte estrutura: { "tituloPlanoAnual": "", "ementaGeral": "", "objetivosAnuais": [], "distribuicaoBimestral": [ { "bimestre": "1º Bimestre", "unidadeTematica": "", "habilidadesAlvo": [ { "code": "", "descricao": "" } ], "conteudosEssenciais": [], "metodologiaErecursos": "", "avaliacaoPeriodo": "" } ], "referenciasErecursos": "" }`;
    const promptUser = `Gere o plano de curso anual para ${formData.disciplina} (${formData.anoSerie}). Carga horária: ${formData.cargaHoraria}. Divisão: ${formData.divisaoPeriodo}. Foco: ${formData.focoPedagogico || 'Geral'}. Observações: ${formData.observacoes || 'Nenhuma'}.`;
    const rawResult = await callAI([{ role: 'system', content: promptSystem }, { role: 'user', content: promptUser }]);
    const cleanJsonText = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (err) {
    return generateMockAnnualCoursePlan(formData);
  }
}

export function generateMockAnnualCoursePlan(formData) {
  const { disciplina, anoSerie, cargaHoraria, divisaoPeriodo } = formData;
  return {
    tituloPlanoAnual: `Plano de Curso Anual: ${disciplina || 'Componente Curricular'} — ${anoSerie || 'Ensino Fundamental'}`,
    ementaGeral: `Desenvolvimento anual das competências específicas e habilidades do componente de ${disciplina} para o ${anoSerie}, articulando conceitos fundamentais, investigação prática e autonomia dos estudantes ao longo de ${cargaHoraria || '80h'}.`,
    objetivosAnuais: [
      `Mobilizar os conceitos centrais da disciplina na solução de problemas reais do cotidiano.`,
      `Desenvolver o pensamento crítico, a argumentação fundamentada e a investigação científica.`,
      `Fortalecer a autonomia de estudo e o trabalho colaborativo durante os ${divisaoPeriodo || '4 bimestres'}.`
    ],
    distribuicaoBimestral: [
      {
        bimestre: "1º Bimestre",
        unidadeTematica: "Fundamentos, Conceitos Iniciais e Problematização",
        habilidadesAlvo: [
          { code: "BNCC/SESI.01", descricao: "Reconhecer e conceituar os princípios fundamentais da unidade." }
        ],
        conteudosEssenciais: [
          "Introdução histórica e conceitual da disciplina",
          "Mapeamento de conhecimentos prévios e terminologia científica",
          "Resolução de situações-problema introdutórias"
        ],
        metodologiaErecursos: "Aulas expositivas dialogadas com suporte de mapas conceituais e estudos em duplas.",
        avaliacaoPeriodo: "Avaliação diagnóstica inicial, participação nas discussões e primeira prova escrita."
      },
      {
        bimestre: "2º Bimestre",
        unidadeTematica: "Aprofundamento Teórico e Análise Sistemática",
        habilidadesAlvo: [
          { code: "BNCC/SESI.02", descricao: "Analisar e relacionar variáveis em processos e fenômenos complexos." }
        ],
        conteudosEssenciais: [
          "Leis e princípios estruturantes do conteúdo",
          "Análise de tabelas, gráficos e dados estatísticos",
          "Exercícios de aplicação prática e estudos de caso"
        ],
        metodologiaErecursos: "Sala de aula invertida e resolução colaborativa de listas de exercícios.",
        avaliacaoPeriodo: "Relatório de acompanhamento, prova bimestral e autoavaliação do aluno."
      },
      {
        bimestre: "3º Bimestre",
        unidadeTematica: "Aplicação Prática e Investigação Científica",
        habilidadesAlvo: [
          { code: "BNCC/SESI.03", descricao: "Aplicar conhecimentos na construção de hipóteses e experimentos." }
        ],
        conteudosEssenciais: [
          "Experimentos de laboratório / simulações digitais",
          "Coleta de dados e elaboração de relatórios investigativos",
          "Conexões tecnológicas e sociais do tema"
        ],
        metodologiaErecursos: "Aprendizagem baseada em problemas (PBL) e experimentos em pequenos grupos.",
        avaliacaoPeriodo: "Avaliação do relatório experimental, seminário em equipe e prova bimestral."
      },
      {
        bimestre: "4º Bimestre",
        unidadeTematica: "Síntese Curricular e Projeto Integrador Final",
        habilidadesAlvo: [
          { code: "BNCC/SESI.04", descricao: "Sintetizar e comunicar as aprendizagens consolidadas ao longo do ano." }
        ],
        conteudosEssenciais: [
          "Revisão integradora dos temas centrais do ano",
          "Desenvolvimento e apresentação do projeto final da disciplina",
          "Avaliação somativa geral de fechamento de ciclo"
        ],
        metodologiaErecursos: "Rotação por estações de revisão e feira de apresentação dos projetos dos alunos.",
        avaliacaoPeriodo: "Apresentação do produto final, prova acumulativa de encerramento de ciclo e conselho de classe."
      }
    ],
    referenciasErecursos: "Base Nacional Comum Curricular (BNCC - MEC); Matrizes Curriculares Padronizadas da Rede SESI; Livro Didático Adotado; Plataformas Digitais de Simulação."
  };
}

/**
 * Geração de Projeto Interdisciplinar / Integrador com IA
 */
export async function generateInterdisciplinaryProjectWithAI(formData, apiKey = '') {
  try {
    const promptSystem = `Você é um especialista em Projetos Integradores e Aprendizagem Baseada em Projetos (PBL). Crie um Projeto Interdisciplinar completo. Retorne um JSON válido com: { "tituloProjeto": "", "perguntaDisparadora": "", "disciplinasEnvolvidas": [], "produtoFinal": "", "justificativaEDisciplinas": "", "cronogramaEtapas": [ { "etapaNumero": "Etapa 1", "nomeEtapa": "", "descricaoAcoes": "", "responsavelDisciplina": "" } ], "criteriosAvaliacaoConjunta": [], "recursosEParcerias": "" }`;
    const promptUser = `Projeto para ${formData.disciplinaPrincipal} integrada com ${formData.disciplinasSecundarias.join(', ')} (${formData.anoSerie}). Tema: ${formData.temaProjeto}. Duração: ${formData.duracaoProjeto}. Produto Final: ${formData.produtoFinal}. Observações: ${formData.observacoes || 'Nenhuma'}.`;
    const rawResult = await callAI([{ role: 'system', content: promptSystem }, { role: 'user', content: promptUser }]);
    const cleanJsonText = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (err) {
    return generateMockInterdisciplinaryProject(formData);
  }
}

export function generateMockInterdisciplinaryProject(formData) {
  const { disciplinaPrincipal, disciplinasSecundarias, anoSerie, temaProjeto, duracaoProjeto, produtoFinal } = formData;
  const todasDisciplinas = [disciplinaPrincipal, ...(disciplinasSecundarias || [])];
  return {
    tituloProjeto: `Projeto Integrador: ${temaProjeto || 'Investigação Interdisciplinar'}`,
    perguntaDisparadora: `Como os conceitos de ${todasDisciplinas.join(', ')} se conectam para resolver o desafio de "${temaProjeto || 'nossa comunidade'}"?`,
    disciplinasEnvolvidas: todasDisciplinas,
    produtoFinal: produtoFinal || 'Apresentação de Protótipo e Feira de Conhecimentos',
    justificativaEDisciplinas: `Este projeto interdisciplinar articula as competências de ${todasDisciplinas.join(', ')} para a ª1ª Série do Ensino Médio, estimulando o protagonismo dos estudantes através do desenvolvimento de ${produtoFinal || 'um produto autoral'} ao longo de ${duracaoProjeto || '3 semanas'}.`,
    cronogramaEtapas: [
      {
        etapaNumero: "Etapa 1 — Sensibilização e Lançamento do Desafio",
        nomeEtapa: "Formação de Equipes e Pergunta Disparadora",
        descricaoAcoes: `Apresentação da situação-problema aos estudantes. Divisão das equipes de 4 a 5 alunos e distribuição dos papéis (Líder, Pesquisador, Designer e Relator).`,
        responsavelDisciplina: `Mediação conjunta: ${disciplinaPrincipal} e ${disciplinasSecundarias[0] || 'Parceiros'}`
      },
      {
        etapaNumero: "Etapa 2 — Pesquisa de Campo e Investigação Científica",
        nomeEtapa: "Coleta de Dados e Fundamentação Teórica",
        descricaoAcoes: `Os grupos realizam levantamento bibliográfico, experimentos de laboratório e entrevistas de campo para embasar o projeto.`,
        responsavelDisciplina: `Foco técnico em ${disciplinaPrincipal}`
      },
      {
        etapaNumero: "Etapa 3 — Desenvolvimento e Mão na Massa (Maker)",
        nomeEtapa: "Construção do Protótipo / Produto Final",
        descricaoAcoes: `Sessões de mentoria com os professores para montagem do produto final (${produtoFinal}), testes de funcionamento e ajustes de design.`,
        responsavelDisciplina: `Mediação conjunta de todas as disciplinas envolvidas`
      },
      {
        etapaNumero: "Etapa 4 — Mostra Cultural / Feira & Avaliação",
        nomeEtapa: "Apresentação Pública e Autoavaliação",
        descricaoAcoes: `Exposição do produto final para a comunidade escolar com bancada de avaliação e aplicação da rubrica de desempenho.`,
        responsavelDisciplina: `Banca de professores avaliadores`
      }
    ],
    criteriosAvaliacaoConjunta: [
      'Domínio dos conceitos científicos integrados das disciplinas parceiras',
      'Qualidade técnica, criatividade e acabamento do produto final',
      'Capacidade de comunicação, trabalho em equipe e defesa de hipóteses no pitch'
    ],
    recursosEParcerias: `Dispositivos com acesso à internet, materiais de prototipagem (cartolina, cola, sensores ou recicláveis), espaço maker da escola e auditório para apresentações.`
  };
}



