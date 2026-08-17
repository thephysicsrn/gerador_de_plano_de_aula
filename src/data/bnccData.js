// Base de Dados Oficial da BNCC (Base Nacional Comum Curricular) e Matriz Curricular

export const ANOS_SERIES = [
  { id: 'EF01', label: '1º Ano (Ensino Fundamental I)', area: 'Fundamental' },
  { id: 'EF02', label: '2º Ano (Ensino Fundamental I)', area: 'Fundamental' },
  { id: 'EF03', label: '3º Ano (Ensino Fundamental I)', area: 'Fundamental' },
  { id: 'EF04', label: '4º Ano (Ensino Fundamental I)', area: 'Fundamental' },
  { id: 'EF05', label: '5º Ano (Ensino Fundamental I)', area: 'Fundamental' },
  { id: 'EF06', label: '6º Ano (Ensino Fundamental II)', area: 'Fundamental' },
  { id: 'EF07', label: '7º Ano (Ensino Fundamental II)', area: 'Fundamental' },
  { id: 'EF08', label: '8º Ano (Ensino Fundamental II)', area: 'Fundamental' },
  { id: 'EF09', label: '9º Ano (Ensino Fundamental II)', area: 'Fundamental' },
  { id: 'EM01', label: '1º Ano (Ensino Médio)', area: 'Médio' },
  { id: 'EM02', label: '2º Ano (Ensino Médio)', area: 'Médio' },
  { id: 'EM03', label: '3º Ano (Ensino Médio)', area: 'Médio' }
];

export const DISCIPLINAS = [
  { id: 'LP', name: 'Língua Portuguesa', icon: 'BookOpen', color: '#4f46e5' },
  { id: 'MA', name: 'Matemática', icon: 'Calculator', color: '#0284c7' },
  { id: 'CI', name: 'Ciências / Biologia', icon: 'Atom', color: '#059669' },
  { id: 'HI', name: 'História', icon: 'Landmark', color: '#d97706' },
  { id: 'GE', name: 'Geografia', icon: 'Globe', color: '#2563eb' },
  { id: 'FI', name: 'Física', icon: 'Zap', color: '#9333ea' },
  { id: 'QU', name: 'Química', icon: 'FlaskConical', color: '#ec4899' },
  { id: 'AR', name: 'Arte', icon: 'Palette', color: '#e11d48' },
  { id: 'EF', name: 'Educação Física', icon: 'Activity', color: '#16a34a' },
  { id: 'LI', name: 'Língua Inglesa', icon: 'Languages', color: '#0891b2' },
  { id: 'SO', name: 'Sociologia', icon: 'Users', color: '#84cc16' },
  { id: 'FIL', name: 'Filosofia', icon: 'Compass', color: '#6366f1' }
];

export const TIPOS_METODOLOGIA = [
  { id: 'ativa', label: 'Metodologia Ativa (Aprendizagem Baseada em Problemas/Projetos - ABP)' },
  { id: 'invertida', label: 'Sala de Aula Invertida (Flipped Classroom)' },
  { id: 'expositiva', label: 'Aula Expositiva Dialogada e Mediada' },
  { id: 'estacoes', label: 'Rotação por Estações de Aprendizagem (Blended Learning)' },
  { id: 'gamificacao', label: 'Gamificação e Jogos Pedagógicos Lúdicos' },
  { id: 'estudo_caso', label: 'Estudo de Caso e Investigação Científica' },
  { id: 'peermag', label: 'Instrução pelos Pares (Peer Instruction)' }
];

export const NECESSIDADES_PEI = [
  { id: 'tea', label: 'Transtorno do Espectro Autista (TEA)' },
  { id: 'tdah', label: 'TDAH (Transtorno do Déficit de Atenção e Hiperatividade)' },
  { id: 'def_intelectual', label: 'Deficiência Intelectual' },
  { id: 'def_visual', label: 'Deficiência Visual / Baixa Visão' },
  { id: 'def_auditiva', label: 'Deficiência Auditiva / Surdez' },
  { id: 'dislexia', label: 'Dislexia / Transtornos Específicos de Aprendizagem' },
  { id: 'altas_habilidades', label: 'Altas Habilidades / Superdotação' },
  { id: 'def_motora', label: 'Deficiência Física / Motora' }
];

export const BNCC_HABILIDADES = [
  // LÍNGUA PORTUGUESA
  {
    code: 'EF01LP01',
    subject: 'LP',
    grade: 'EF01',
    description: 'Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página.'
  },
  {
    code: 'EF01LP02',
    subject: 'LP',
    grade: 'EF01',
    description: 'Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética – usando letras/grafemas que representem fonemas.'
  },
  {
    code: 'EF02LP04',
    subject: 'LP',
    grade: 'EF02',
    description: 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor, cartas de leitor, notícias e reportagens.'
  },
  {
    code: 'EF03LP05',
    subject: 'LP',
    grade: 'EF03',
    description: 'Identificar a função sociocomunicativa de textos que circulam em campos da vida social dos quais participa cotidianamente.'
  },
  {
    code: 'EF04LP07',
    subject: 'LP',
    grade: 'EF04',
    description: 'Identificar em textos dramáticos os marcadores de fala das personagens e da cena (rubricas).'
  },
  {
    code: 'EF05LP15',
    subject: 'LP',
    grade: 'EF05',
    description: 'Ler e compreender textos poéticos, identificando rimas, aliterações e ritmos e seu efeito de sentido.'
  },
  {
    code: 'EF06LP01',
    subject: 'LP',
    grade: 'EF06',
    description: 'Reconhecer a impossibilidade de uma neutralidade absoluta no relato de fatos e identificar diferentes graus de parcialidade em notícias e reportagens.'
  },
  {
    code: 'EF07LP02',
    subject: 'LP',
    grade: 'EF07',
    description: 'Comparar notícias e reportagens sobre um mesmo fato divulgadas em diferentes mídias, analisando especificidades de cada mídia.'
  },
  {
    code: 'EF08LP03',
    subject: 'LP',
    grade: 'EF08',
    description: 'Produce textos opinativos (artigos de opinião, cartas abertas) posicionando-se de forma ética e fundamentada.'
  },
  {
    code: 'EF09LP04',
    subject: 'LP',
    grade: 'EF09',
    description: 'Escrever artigos de opinião, posicionando-se de forma crítica e fundamentada a respeito de temas controversos da atualidade.'
  },
  {
    code: 'EM13LP01',
    subject: 'LP',
    grade: 'EM01',
    description: 'Relacionar o texto, tanto na produção quanto na leitura, com suas condições de produção e seu contexto sócio-histórico de circulação.'
  },
  {
    code: 'EM13LP06',
    subject: 'LP',
    grade: 'EM02',
    description: 'Analizar os efeitos de sentido decorrentes do uso de recursos estéticos e literários em obras da literatura brasileira e portuguesa.'
  },
  {
    code: 'EM13LP12',
    subject: 'LP',
    grade: 'EM03',
    description: 'Produzir textos dissertativo-argumentativos nos padrões do ENEM, desenvolvendo tese, argumentos consistentes e proposta de intervenção social.'
  },

  // MATEMÁTICA
  {
    code: 'EF01MA01',
    subject: 'MA',
    grade: 'EF01',
    description: 'Utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações cotidianas.'
  },
  {
    code: 'EF01MA06',
    subject: 'MA',
    grade: 'EF01',
    description: 'Construir fatos básicos da adição e utilizá-los em procedimentos de cálculo para resolver problemas.'
  },
  {
    code: 'EF02MA05',
    subject: 'MA',
    grade: 'EF02',
    description: 'Construir fatos básicos da subtração e utilizar em estratégias de cálculo mental e escrito.'
  },
  {
    code: 'EF03MA03',
    subject: 'MA',
    grade: 'EF03',
    description: 'Construir e utilizar fatos básicos da multiplicação e da divisão para o cálculo mental ou escrito.'
  },
  {
    code: 'EF04MA10',
    subject: 'MA',
    grade: 'EF04',
    description: 'Reconhecer que as regras do sistema de numeração decimal podem ser estendidas para a representação decimal de um número racional.'
  },
  {
    code: 'EF05MA07',
    subject: 'MA',
    grade: 'EF05',
    description: 'Resolver e elaborar problemas de adição e subtração com números racionais na representação decimal.'
  },
  {
    code: 'EF06MA05',
    subject: 'MA',
    grade: 'EF06',
    description: 'Classificar números naturais em primos e compostos, estabelecer relações entre números expressas pelas noções de divisibilidade, divisor e múltiplo.'
  },
  {
    code: 'EF07MA02',
    subject: 'MA',
    grade: 'EF07',
    description: 'Resolver e elaborar problemas que envolvam porcentagens, como os que lidam com acréscimos e decréscimos simples, utilizando estratégias pessoais.'
  },
  {
    code: 'EF08MA06',
    subject: 'MA',
    grade: 'EF08',
    description: 'Resolver e elaborar problemas que envolvam cálculo do valor numérico de expressões algébricas e equações do 1º grau.'
  },
  {
    code: 'EF09MA06',
    subject: 'MA',
    grade: 'EF09',
    description: 'Compreender as funções afim e quadrática e suas representações algébricas e gráficas em situações práticas da física e economia.'
  },
  {
    code: 'EM13MAT101',
    subject: 'MA',
    grade: 'EM01',
    description: 'Interpretar criticamente equações, modelos matemáticos e estatísticos aplicados à análise de fenômenos sociais, econômicos e ambientais.'
  },
  {
    code: 'EM13MAT302',
    subject: 'MA',
    grade: 'EM02',
    description: 'Construir e analisar gráficos de funções trigonométricas e exponenciais relacionando a variações periódicas e crescimento populacional.'
  },
  {
    code: 'EM13MAT501',
    subject: 'MA',
    grade: 'EM03',
    description: 'Investigar e aplicar conceitos de Geometria Espacial (prismas, pirâmides, cilindros, cones e esferas) em problemas de engenharia e arquitetura.'
  },

  // CIÊNCIAS / BIOLOGIA
  {
    code: 'EF01CI01',
    subject: 'CI',
    grade: 'EF01',
    description: 'Comparar características de diferentes materiais presentes em objetos de uso cotidiano, discutindo sua origem e descarte consciente.'
  },
  {
    code: 'EF03CI04',
    subject: 'CI',
    grade: 'EF03',
    description: 'Identificar características da Terra (como formato esférico, presença de água e solo) com base na observação e modelos.'
  },
  {
    code: 'EF06CI05',
    subject: 'CI',
    grade: 'EF06',
    description: 'Explicar a organização básica das células e sua relação com a constituição dos tecidos e órgãos dos seres vivos.'
  },
  {
    code: 'EF07CI08',
    subject: 'CI',
    grade: 'EF07',
    description: 'Avaliar os impactos ecológicos e a biodiversidade dos biomas brasileiros (Catinga, Cerrado, Mata Atlântica, Amazônia).'
  },
  {
    code: 'EF08CI07',
    subject: 'CI',
    grade: 'EF08',
    description: 'Compreender o funcionamento do sistema nervoso e endócrino na coordenação das funções integradas do corpo humano.'
  },
  {
    code: 'EF09CI09',
    subject: 'CI',
    grade: 'EF09',
    description: 'Discutir as teorias sobre a evolução dos seres vivos e a seleção natural proposta por Charles Darwin.'
  },
  {
    code: 'EM13CNT201',
    subject: 'CI',
    grade: 'EM01',
    description: 'Analizar os processos biológicos e biotecnológicos no desenvolvimento da medicina moderna, vacinas, terapia gênica e impactos ecossistêmicos.'
  },
  {
    code: 'EM13CNT303',
    subject: 'CI',
    grade: 'EM02',
    description: 'Interpretar a transmissão de características hereditárias por meio das Leis de Mendel, citogenética e engenharia genética.'
  },
  {
    code: 'EM13CNT308',
    subject: 'CI',
    grade: 'EM03',
    description: 'Avaliar os fluxos de matéria e energia nos ecossistemas e a interferência humana nos ciclos biogeoquímicos globais.'
  },

  // HISTÓRIA
  {
    code: 'EF01HI01',
    subject: 'HI',
    grade: 'EF01',
    description: 'Identificar aspectos do seu crescimento por meio do registro das lembranças particulares ou lembranças dos membros de sua família.'
  },
  {
    code: 'EF04HI02',
    subject: 'HI',
    grade: 'EF04',
    description: 'Identificar as rotas de migração e o processo de ocupação do território brasileiro pelos povos indígenas, africanos e europeus.'
  },
  {
    code: 'EF06HI02',
    subject: 'HI',
    grade: 'EF06',
    description: 'Identificar a gênese da escrita e o surgimento do estado na Antiguidade Ocidental e Oriental e a importância das fontes históricas.'
  },
  {
    code: 'EF07HI04',
    subject: 'HI',
    grade: 'EF07',
    description: 'Identificar as principais características do Feudalismo, do Renascimento cultural e das Grandes Navegações.'
  },
  {
    code: 'EF08HI15',
    subject: 'HI',
    grade: 'EF08',
    description: 'Discutir o conceito de Independência no Brasil (1822) e suas repercussões sociais, políticas e econômicas para a população.'
  },
  {
    code: 'EF09HI05',
    subject: 'HI',
    grade: 'EF09',
    description: 'Analizar os fatores que levaram à Primeira e Segunda Guerra Mundial, o Holocausto e a criação da Organização das Nações Unidas (ONU).'
  },
  {
    code: 'EM13CHS102',
    subject: 'HI',
    grade: 'EM01',
    description: 'Identificar, analisar e discutir as circunstâncias históricas, geográficas, políticas e culturais que geram conflitos no século XX e XXI.'
  },
  {
    code: 'EM13CHS204',
    subject: 'HI',
    grade: 'EM02',
    description: 'Comparar os processos de construção da cidadania e dos Direitos Humanos nas constituições brasileiras e internacionais.'
  },
  {
    code: 'EM13CHS601',
    subject: 'HI',
    grade: 'EM03',
    description: 'Relacionar a ditadura militar no Brasil (1964-1985) com o contexto geopolítico da Guerra Fria e a redemocratização.'
  },

  // GEOGRAFIA
  {
    code: 'EF01GE01',
    subject: 'GE',
    grade: 'EF01',
    description: 'Descrever características observáveis de seus lugares de vivência (moradia, escola etc.) e identificar semelhanças e diferenças entre eles.'
  },
  {
    code: 'EF04GE05',
    subject: 'GE',
    grade: 'EF04',
    description: 'Distinguir unidades político-administrativas oficiais do Brasil (Município, Estado, Distrito Federal) e suas capitais.'
  },
  {
    code: 'EF06GE03',
    subject: 'GE',
    grade: 'EF06',
    description: 'Descrever os elementos constitutivos dos mapas (título, legenda, escala, orientação) e interpretar cartografia temática.'
  },
  {
    code: 'EF08GE05',
    subject: 'GE',
    grade: 'EF08',
    description: 'Analizar a divisão geopolítica do mundo em países desenvolvidos e em desenvolvimento no contexto da Globalização.'
  },
  {
    code: 'EM13CHS301',
    subject: 'GE',
    grade: 'EM01',
    description: 'Problematizar os impactos socioambientais dos modelos de desenvolvimento econômico em escala local, regional e global.'
  },
  {
    code: 'EM13CHS304',
    subject: 'GE',
    grade: 'EM02',
    description: 'Analizar a matriz energética brasileira e mundial e as propostas de transição para energias renováveis e sustentáveis.'
  },

  // FÍSICA
  {
    code: 'EM13CNT101',
    subject: 'FI',
    grade: 'EM01',
    description: 'Analizar e quantificar as transformações de energia mecânica, cinética e potencial em sistemas físicos e aplicações industriais.'
  },
  {
    code: 'EM13CNT103',
    subject: 'FI',
    grade: 'EM02',
    description: 'Aplicar as Leis de Newton e os princípios da gravitação para explicar o movimento de corpos celestes e satélites.'
  },
  {
    code: 'EM13CNT204',
    subject: 'FI',
    grade: 'EM03',
    description: 'Elaborar explicações e previsões sobre circuitos elétricos, eletromagnetismo e ondulatória na tecnologia moderna (5G, fibras ópticas).'
  },

  // QUÍMICA
  {
    code: 'EM13CNT104',
    subject: 'QU',
    grade: 'EM01',
    description: 'Avaliar as propriedades dos materiais com base nas ligações químicas, estruturas moleculares e interações intermoleculares.'
  },
  {
    code: 'EM13CNT205',
    subject: 'QU',
    grade: 'EM02',
    description: 'Realizar cálculos estequiométricos em reações químicas, calculando rendimento, reagente em excesso e concentração de soluções.'
  },
  {
    code: 'EM13CNT307',
    subject: 'QU',
    grade: 'EM03',
    description: 'Analizar a Química Orgânica, funções oxigenadas e nitrogenadas e a síntese de polímeros e biocombustíveis.'
  },

  // ARTE
  {
    code: 'EF01AR01',
    subject: 'AR',
    grade: 'EF01',
    description: 'Identificar e apreciar formas distintas das artes visuais tradicionais e contemporâneas, cultivando a percepção e o imaginário.'
  },
  {
    code: 'EF06AR03',
    subject: 'AR',
    grade: 'EF06',
    description: 'Analizar as artes cênicas, dança e música popular brasileira como patrimônio cultural e identidade nacional.'
  },
  {
    code: 'EM13LGG601',
    subject: 'AR',
    grade: 'EM02',
    description: 'Apreciar e analisar manifestações artísticas contemporâneas, instalações e arte digital em contextos urbanos e galerias.'
  },

  // EDUCAÇÃO FÍSICA
  {
    code: 'EF01EF01',
    subject: 'EF',
    grade: 'EF01',
    description: 'Experimentar, fruir e recriar diferentes brincadeiras e jogos populares do contexto comunitário e regional.'
  },
  {
    code: 'EF06EF03',
    subject: 'EF',
    grade: 'EF06',
    description: 'Experimentar e fruir esportes de marca, precisão, invasão e combate, valorizando o trabalho em equipe e o respeito às regras.'
  },
  {
    code: 'EM13LGG501',
    subject: 'EF',
    grade: 'EM02',
    description: 'Compreender a prática corporal como elemento de promoção da saúde mental, qualidade de vida e prevenção de doenças crônicas.'
  },

  // LÍNGUA INGLESA
  {
    code: 'EF06LI01',
    subject: 'LI',
    grade: 'EF06',
    description: 'Interagir em situações de intercâmbio oral, demonstrando iniciativa para utilizar a língua inglesa em sala de aula.'
  },
  {
    code: 'EF08LI05',
    subject: 'LI',
    grade: 'EF08',
    description: 'Inferir a ideia principal e informações específicas em textos opinativos e jornalísticos em língua inglesa.'
  },
  {
    code: 'EM13LGG401',
    subject: 'LI',
    grade: 'EM02',
    description: 'Analizar criticamente textos em língua inglesa de circulação global em redes digitais, mídias sociais e artigos acadêmicos.'
  },

  // FILOSOFIA & SOCIOLOGIA
  {
    code: 'EM13CHS101',
    subject: 'FIL',
    grade: 'EM01',
    description: 'Investigar os conceitos morais, éticos e epistemológicos desenvolvidos pelos filósofos clássicos e contemporâneos.'
  },
  {
    code: 'EM13CHS201',
    subject: 'SO',
    grade: 'EM02',
    description: 'Analizar as teorias sociológicas de Émile Durkheim, Karl Marx e Max Weber sobre estratificação social, trabalho e cultura.'
  }
];

export const CONTEUDOS_EXEMPLO = {
  MA: ['Frações e Porcentagem', 'Geometria Espacial', 'Equações do 2º Grau', 'Estatística Básica e Gráficos', 'Funções Exponenciais e Logaritmos', 'Trigonometria no Triângulo Retângulo'],
  LP: ['Leitura e Interpretação de Texto', 'Gênero Textual Artigo de Opinião', 'Sintaxe e Pontuação', 'Literatura Modernista', 'Redação Estilo ENEM', 'Análise Linguística e Semiótica'],
  CI: ['Célula Vegetal e Animal', 'Sistema Circulatório e Respiratório', 'Ecossistemas e Preservação', 'Tabela Periódica', 'Genética e Leis de Mendel', 'Evolução e Seleção Natural'],
  HI: ['Revolução Industrial', 'Brasil Império e Independência', 'Grécia e Roma Antiga', 'Guerra Fria', 'Ditadura Militar no Brasil', 'Segunda Guerra Mundial e Holocausto'],
  GE: ['Cartografia e Fusos Horários', 'Geopolítica Mundial', 'Relevo e Clima do Brasil', 'Urbanização e Migrações', 'Globalização e Blocos Econômicos', 'Matriz Energética e Sustentabilidade'],
  FI: ['Cinemática e Movimento Uniforme', 'Leis de Newton e Dinâmica', 'Conservação de Energia Mecânica', 'Eletromagnetismo e Circuitos', 'Ondulatória e Óptica'],
  QU: ['Tabela Periódica e Ligações Químicas', 'Estequiometria e Soluções', 'Termoquímica e Cinética', 'Química Orgânica e Polímeros', 'Eletroquímica e Pilhas'],
  AR: ['História da Arte Brasileira', 'Arte Contemporânea e Digital', 'Elementos da Linguagem Visual', 'Música Popular Brasileira', 'Teatro e Expressão Corporal'],
  EF: ['Jogos Cooperativos e Populares', 'Esportes de Invasão e Marca', 'Ginástica e Consciência Corporal', 'Dança e Culturas Afro-Brasileiras', 'Saúde e Qualidade de Vida'],
  LI: ['Reading Comprehension', 'Grammar in Context (Simple Past & Present Perfect)', 'Vocabulary for Digital Media', 'Oral Interaction & Presentations'],
  FIL: ['Ética e Justiça em Aristóteles', 'Teoria do Conhecimento e Iluminismo', 'Filosofia Política e Contrato Social', 'Existencialismo e Ética Contemporânea'],
  SO: ['Conceito de Cidadania e Direitos Humanos', 'Trabalho e Sociedade de Consumo', 'Indústria Cultural e Redes Sociais', 'Diversidade Cultural e Etnia']
};
