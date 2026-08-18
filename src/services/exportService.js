// Serviço de Exportação para Word (.docx) e PDF (A4) com suporte a nomes de arquivo reais (.docx e .pdf)

import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Exportar Plano de Aula ou PEI para documento do Word (.docx)
 */
export async function exportToWord(planData) {
  const isPei = planData.type === 'PEI';
  const contentObj = planData.content || planData;

  const docTitle = contentObj.titulo || planData.conteudoProgramatico || planData.nomeAluno || (isPei ? 'Plano_PEI' : 'Plano_de_Aula');
  const titleText = isPei ? `PLANO DE ENSINO INDIVIDUALIZADO (PEI) - ${planData.nomeAluno || 'ESTUDANTE'}` : `PLANO DE AULA - ${docTitle.toUpperCase()}`;

  const children = [];

  // Cabeçalho / Título Principal
  children.push(
    new Paragraph({
      text: titleText,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    })
  );

  // Metadados em Tabela
  const metaRows = isPei ? [
    ['Estudante:', planData.nomeAluno || 'Não informado'],
    ['Série / Ano:', planData.anoSerie || ''],
    ['Disciplina / Área:', planData.disciplina || ''],
    ['Necessidade Especial:', planData.necessidadeEspecial || '']
  ] : [
    ['Disciplina:', planData.disciplina || ''],
    ['Ano / Série:', planData.anoSerie || ''],
    ['Tempo de Aula:', planData.tempoAula || ''],
    ['Conteúdo Programático:', planData.conteudoProgramatico || '']
  ];

  const tableRows = metaRows.map(([label, val]) => new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, color: '1e293b' })] })],
        width: { size: 30, type: WidthType.PERCENTAGE }
      }),
      new TableCell({
        children: [new Paragraph({ text: String(val || '') })],
        width: { size: 70, type: WidthType.PERCENTAGE }
      })
    ]
  }));

  children.push(
    new Table({
      rows: tableRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
        left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'f1f5f9' },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' }
      }
    })
  );

  children.push(new Paragraph({ spacing: { after: 300 } }));

  // Função auxiliar para adicionar seções com título
  const addSection = (heading, content) => {
    children.push(
      new Paragraph({
        text: heading,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 }
      })
    );

    if (Array.isArray(content)) {
      content.forEach(item => {
        if (typeof item === 'string') {
          children.push(new Paragraph({ text: `• ${item}`, spacing: { after: 60 } }));
        } else if (item.code) {
          children.push(new Paragraph({ text: `• [${item.code}]: ${item.descricaoOficial || item.description || ''} ${item.detalhamento ? `(${item.detalhamento})` : ''}`, spacing: { after: 60 } }));
        } else if (item.etapa) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${item.etapa} (${item.tempo || ''}): `, bold: true }),
                new TextRun({ text: item.descricao || '' })
              ],
              spacing: { after: 100 }
            })
          );
        }
      });
    } else if (typeof content === 'string') {
      children.push(new Paragraph({ text: content, spacing: { after: 120 } }));
    }
  };

  if (isPei) {
    if (contentObj.diagnosticoFuncional || contentObj.perfilAluno) {
      addSection('1. Diagnóstico e Avaliação Pedagógica Funcional', contentObj.diagnosticoFuncional || contentObj.perfilAluno);
    }
    if (contentObj.potencialidadesEInteresses) {
      addSection('2. Potencialidades, Interesses & Hiperfocos (Âncoras de Aprendizagem)', contentObj.potencialidadesEInteresses);
    }
    if (contentObj.barreirasAprendizagemIdentificadas) {
      addSection('3. Barreiras de Acesso ao Currículo Mapeadas', contentObj.barreirasAprendizagemIdentificadas);
    }
    if (contentObj.objetivosCurricularesAdaptados) {
      if (typeof contentObj.objetivosCurricularesAdaptados === 'object' && !Array.isArray(contentObj.objetivosCurricularesAdaptados)) {
        const metas = [];
        if (contentObj.objetivosCurricularesAdaptados.curtoPrazo) {
          metas.push('--- METAS DE CURTO PRAZO (1 a 2 meses) ---');
          metas.push(...contentObj.objetivosCurricularesAdaptados.curtoPrazo);
        }
        if (contentObj.objetivosCurricularesAdaptados.medioPrazo) {
          metas.push('--- METAS DE MÉDIO PRAZO (Semestral) ---');
          metas.push(...contentObj.objetivosCurricularesAdaptados.medioPrazo);
        }
        if (contentObj.objetivosCurricularesAdaptados.longoPrazo) {
          metas.push('--- METAS DE LONGO PRAZO (Ano Letivo) ---');
          metas.push(...contentObj.objetivosCurricularesAdaptados.longoPrazo);
        }
        addSection('4. Metas e Objetivos Curriculares Adaptados', metas);
      } else {
        addSection('4. Metas e Objetivos Curriculares Adaptados', contentObj.objetivosCurricularesAdaptados);
      }
    }
    if (contentObj.adaptacoesHabilidadesBNCC && Array.isArray(contentObj.adaptacoesHabilidadesBNCC)) {
      const habsFormatted = contentObj.adaptacoesHabilidadesBNCC.map(h => 
        `[${h.code}]: ${h.descricaoBNCC || ''}\n  • Objetivo Flexibilizado: ${h.objetivoAdaptado || ''}\n  • Estratégia em Sala: ${h.estrategiaDidatica || ''}\n  • Recurso de Apoio: ${h.recursoApoio || ''}`
      );
      addSection('5. Planejamento de Adaptação por Habilidade da BNCC', habsFormatted);
    }
    if (contentObj.estrategiasPedagogicasEspeciais) {
      addSection('6. Estratégias Pedagógicas & Rotina em Sala de Aula', contentObj.estrategiasPedagogicasEspeciais);
    }
    if (contentObj.recursosTecnologiaAssistiva) {
      addSection('7. Recursos de Tecnologia Assistiva, CAA & Acessibilidade', contentObj.recursosTecnologiaAssistiva);
    }
    if (contentObj.planoAtendimentoAEE) {
      addSection('8. Plano de Atendimento na Sala de Recursos (AEE)', contentObj.planoAtendimentoAEE);
    }
    if (contentObj.flexibilizacaoAvaliativa) {
      addSection('9. Critérios & Flexibilização Avaliativa Processual', contentObj.flexibilizacaoAvaliativa);
    }
    if (contentObj.acoesIntegradasFamiliaAEE || contentObj.parceriaFamiliaETerapeutas) {
      addSection('10. Articulação Escola, Família & Terapeutas', contentObj.acoesIntegradasFamiliaAEE || contentObj.parceriaFamiliaETerapeutas);
    }
    if (contentObj.cronogramaRevisaoPEI) {
      addSection('11. Cronograma de Monitoramento & Revisão Periódica', contentObj.cronogramaRevisaoPEI);
    }
  } else {
    if (contentObj.objetivoGeral) addSection('1. Objetivo Geral', contentObj.objetivoGeral);
    if (contentObj.objetivosEspecificos) addSection('2. Objetivos Específicos', contentObj.objetivosEspecificos);
    if (contentObj.habilidadesDetalhadas && contentObj.habilidadesDetalhadas.length > 0) {
      addSection('3. Habilidades da BNCC & Mediação Pedagógica', contentObj.habilidadesDetalhadas);
    } else if (planData.habilidadesBNCC && planData.habilidadesBNCC.length > 0) {
      addSection('3. Habilidades da BNCC Trabalhadas', planData.habilidadesBNCC);
    }
    if (contentObj.desenvolvimentoPassoAPasso) addSection('4. Desenvolvimento Metodológico (Passo a Passo)', contentObj.desenvolvimentoPassoAPasso);
    if (contentObj.estrategiaMetodologica) addSection('5. Estratégia Metodológica', contentObj.estrategiaMetodologica);
    if (contentObj.recursosDidaticos) addSection('6. Recursos Didáticos', contentObj.recursosDidaticos);
    if (contentObj.avaliacaoFormativa) addSection('7. Avaliação Formativa', contentObj.avaliacaoFormativa);
    if (contentObj.atividadesFixacao) addSection('8. Atividades de Fixação / Tarefa', contentObj.atividadesFixacao);
    if (contentObj.adaptacaoInclusiva) addSection('9. Adaptações Inclusivas (Dica AEE)', contentObj.adaptacaoInclusiva);
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  const rawBlob = await Packer.toBlob(doc);

  // Nome de arquivo amigável e limpo
  const cleanName = docTitle
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  const finalFileName = `${cleanName || 'plano_eduplan'}.docx`;

  // Criação do objeto File com MIME type explícito para evitar nomes temporários em UUID
  const namedFile = new File([rawBlob], finalFileName, {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });

  try {
    saveAs(namedFile, finalFileName);
  } catch (err) {
    const url = URL.createObjectURL(rawBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Exportar para PDF usando html2pdf.js com nome de arquivo explícito
 */
export async function exportToPdf(elementId, filename = '') {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Elemento de documento não encontrado para exportação.');
    return;
  }

  const pdfName = filename || 'Plano_EduPlan.pdf';

  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: pdfName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, scrollX: 0, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.warn('Falha no html2pdf, acionando salvamento/impressão nativa de PDF:', err);
    window.print();
  }
}

/**
 * Copiar o conteúdo em texto formatado para a área de transferência
 */
export function copyToClipboard(planData) {
  const isPei = planData.type === 'PEI';
  const contentObj = planData.content || planData;

  let text = isPei
    ? `=== PLANO DE ENSINO INDIVIDUALIZADO (PEI) ===\nEstudante: ${planData.nomeAluno}\nSérie: ${planData.anoSerie}\nDisciplina: ${planData.disciplina}\nNecessidade: ${planData.necessidadeEspecial}\n\n`
    : `=== PLANO DE AULA: ${contentObj.titulo || planData.disciplina} ===\nSérie: ${planData.anoSerie}\nDuração: ${planData.tempoAula}\nConteúdo: ${planData.conteudoProgramatico}\n\n`;

  if (isPei) {
    text += `[PERFIL DO ESTUDANTE]\n${contentObj.perfilAluno}\n\n`;
    text += `[OBJETIVOS ADAPTADOS]\n${Array.isArray(contentObj.objetivosCurricularesAdaptados) ? contentObj.objetivosCurricularesAdaptados.join('\n- ') : contentObj.objetivosCurricularesAdaptados}\n\n`;
    text += `[ESTRATÉGIAS PEDAGÓGICAS]\n${Array.isArray(contentObj.estrategiasPedagogicasEspeciais) ? contentObj.estrategiasPedagogicasEspeciais.join('\n- ') : contentObj.estrategiasPedagogicasEspeciais}\n\n`;
    text += `[RECURSOS E TECNOLOGIA ASSISTIVA]\n${Array.isArray(contentObj.recursosTecnologiaAssistiva) ? contentObj.recursosTecnologiaAssistiva.join('\n- ') : contentObj.recursosTecnologiaAssistiva}\n\n`;
    text += `[FLEXIBILIZAÇÃO AVALIATIVA]\n${contentObj.flexibilizacaoAvaliativa}\n`;
  } else {
    text += `[OBJETIVO GERAL]\n${contentObj.objetivoGeral}\n\n`;
    text += `[OBJETIVOS ESPECÍFICOS]\n- ${Array.isArray(contentObj.objetivosEspecificos) ? contentObj.objetivosEspecificos.join('\n- ') : contentObj.objetivosEspecificos}\n\n`;
    text += `[DESENVOLVIMENTO METODOLÓGICO]\n`;
    if (Array.isArray(contentObj.desenvolvimentoPassoAPasso)) {
      contentObj.desenvolvimentoPassoAPasso.forEach(step => {
        text += `• ${step.etapa} (${step.tempo}): ${step.descricao}\n`;
      });
    }
    text += `\n[RECURSOS DIDÁTICOS]\n- ${Array.isArray(contentObj.recursosDidaticos) ? contentObj.recursosDidaticos.join('\n- ') : contentObj.recursosDidaticos}\n\n`;
    text += `[AVALIAÇÃO FORMATIVA]\n${contentObj.avaliacaoFormativa}\n`;
  }

  navigator.clipboard.writeText(text);
}
