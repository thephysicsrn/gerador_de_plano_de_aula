import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  UserCheck, 
  Sun, 
  Moon,
  Building2,
  BookOpen,
  Clock,
  Award,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import AuthModal from './AuthModal';
import Footer from './Footer';

export default function PublicLandingPage({ onLoginSuccess, darkMode, setDarkMode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  // Estado para o preview interativo de documento exemplo
  const [activePreviewTab, setActivePreviewTab] = useState('lesson');
  
  // Estado para o FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Rolagem suave automática ao carregar com um hash na URL (ex: #rede-sesi)
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "O Edu.Plan é realmente gratuito para os professores?",
      answer: "Sim! O acesso à plataforma, consulta das habilidades da BNCC e Matriz SESI, geração de planos de aula e PEIs e exportação em Word/PDF são 100% gratuitos."
    },
    {
      question: "Os planos gerados são aceitos pelas coordenações pedagógicas?",
      answer: "Com certeza. Os planos gerados pelo Edu.Plan seguem o padrão oficial exigido pelas supervisões escolares e Secretarias de Educação: incluem Objetivos da Taxonomia de Bloom, Minutagem da Aula, Metodologia, Avaliação Formativa e espaço para assinatura da coordenação."
    },
    {
      question: "Como funciona a diferença entre a REDE SESI e OUTRA REDE?",
      answer: "Professores da REDE SESI têm acesso exclusivo às Matrizes Curriculares Padronizadas do SESI (Ensino Fundamental Anos Finais e Ensino Médio — ex: Ciências da Natureza, Humanas, Linguagens, Matemática, Itinerários e Projeto de Vida). Professores de outras redes contam com a base completa da BNCC Oficial do MEC."
    },
    {
      question: "Posso editar o plano de aula após o download?",
      answer: "Sim! Ao clicar em 'Baixar Word', a plataforma gera um arquivo .docx totalmente formatado e editável para você personalizar no Microsoft Word, Google Docs ou LibreOffice."
    },
    {
      question: "O que é a funcionalidade de PEI Inclusivo (AEE)?",
      answer: "É uma ferramenta voltada para o Atendimento Educacional Especializado. Ela cria Planos de Ensino Individualizados adaptados com estratégias pedagógicas e tecnologias assistivas para estudantes neurodivergentes (TEA/Autismo, TDAH, Deficiências ou Altas Habilidades)."
    }
  ];

  return (
    <div className="public-landing-container">
      {/* Formas Geométricas Flutuantes Estilo Podia */}
      <div className="podia-shape podia-shape-1"></div>
      <div className="podia-shape podia-shape-2"></div>
      <div className="podia-shape podia-shape-3"></div>

      {/* Cabeçalho Público */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-brand">
            <div className="brand-logo-podia">
              <span className="logo-text">Edu</span>
              <span className="logo-dot">.Plan</span>
            </div>
          </div>

          <nav className="header-nav-podia">
            <a href="#funcionalidades" className="nav-link-podia" onClick={(e) => handleNavClick(e, 'funcionalidades')}>Funcionalidades</a>
            <a href="#rede-sesi" className="nav-link-podia" onClick={(e) => handleNavClick(e, 'rede-sesi')}>Matrizes & BNCC</a>
            <a href="#demonstracao" className="nav-link-podia" onClick={(e) => handleNavClick(e, 'demonstracao')}>Exemplo Vivo</a>
            <a href="#como-funciona" className="nav-link-podia" onClick={(e) => handleNavClick(e, 'como-funciona')}>Como Funciona</a>
            <a href="#faq" className="nav-link-podia" onClick={(e) => handleNavClick(e, 'faq')}>Dúvidas (FAQ)</a>
          </nav>

          <div className="header-actions">
            <button
              className="theme-toggle-podia"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              type="button"
              className="btn-header-login"
              onClick={() => openAuth('login')}
            >
              Entrar
            </button>

            <button
              type="button"
              className="btn-podia-black"
              onClick={() => openAuth('signup')}
            >
              <span>Criar Conta Grátis</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Principal */}
      <section className="hero-podia-section animate-fade-in">
        <div className="hero-podia-header">
          <div className="ai-badge-pill">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
            <span>Inteligência Artificial DeepSeek Integrada à BNCC & SESI</span>
          </div>

          <h1 className="hero-podia-title">
            Planejamento pedagógico inteligente, simples e 100% alinhado à BNCC
          </h1>
          <p className="hero-podia-subtitle">
            Gere planos de aula completos com minutagem e Planos de Ensino Individualizados (PEI) em segundos. Baixe em Word (.docx) editável ou PDF formatado para impressão.
          </p>

          <div className="hero-cta-group">
            <button className="btn-podia-hero-black" onClick={() => openAuth('signup')}>
              <span>Começar Gratuitamente</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>

            <button className="btn btn-secondary rounded-full" onClick={() => openAuth('login')}>
              <UserCheck className="w-4 h-4 mr-2 text-indigo-500" />
              <span>Acessar Minha Conta</span>
            </button>
          </div>
        </div>

        {/* Grid dos 3 Cards Coloridos (Podia Style) */}
        <div className="podia-cards-grid" id="funcionalidades">
          <div className="podia-feature-card card-blue" onClick={() => openAuth('signup')}>
            <div className="card-top">
              <span className="card-tag">Plano de Aula BNCC ›</span>
              <p className="card-desc">
                Estruturação automática com Objetivos na Taxonomia de Bloom, minutagem de etapas, recursos e avaliação.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <FileText className="w-5 h-5 mr-2 shrink-0" />
                <span>Educação Básica & Ensino Médio</span>
              </div>
            </div>
          </div>

          <div className="podia-feature-card card-ochre" onClick={() => openAuth('signup')}>
            <div className="card-top">
              <span className="card-tag">PEI Inclusivo (AEE) ›</span>
              <p className="card-desc">
                Adaptações pedagógicas para autismo (TEA), TDAH, deficiências e recursos de tecnologia assistiva.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <HeartHandshake className="w-5 h-5 mr-2 shrink-0" />
                <span>Atendimento Educacional Especializado</span>
              </div>
            </div>
          </div>

          <div className="podia-feature-card card-purple" onClick={() => openAuth('signup')}>
            <div className="card-top">
              <span className="card-tag">Exportação Word & PDF ›</span>
              <p className="card-desc">
                Documentos formatados no padrão impresso A4 com cabeçalho institucional e campo para assinatura.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <Download className="w-5 h-5 mr-2 shrink-0" />
                <span>Formatos .docx e .pdf</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Métricas e Prova Social */}
      <section className="landing-stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">570+</div>
            <div className="stat-label">Habilidades BNCC & Matrizes SESI Cadastradas</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">80%</div>
            <div className="stat-label">Economia de Tempo na Rotina Pedagógica</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Documentos Editáveis em Word (.docx)</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">R$ 0</div>
            <div className="stat-label">Acesso Gratuito para Professores</div>
          </div>
        </div>
      </section>

      {/* Seção Destaque: Matriz SESI vs BNCC Geral */}
      <section className="section-network-highlight" id="rede-sesi">
        <div className="network-highlight-inner">
          <div className="section-title-badge">
            <Building2 className="w-4 h-4 text-amber-500 mr-2" />
            <span>Currículo Personalizado por Rede de Ensino</span>
          </div>
          <h2 className="section-main-title">Alinhamento perfeito ao seu currículo escolar</h2>
          <p className="section-main-sub">O Edu.Plan se adapta à sua realidade: escolha entre a Matriz Padronizada do SESI ou a BNCC Geral do MEC.</p>

          <div className="network-cards-grid">
            {/* Card REDE SESI */}
            <div className="network-card sesi-card">
              <div className="network-card-header">
                <div className="network-icon-box bg-sesi">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="network-badge-label">Exclusivo</span>
                  <h3 className="network-card-title">Professor REDE SESI</h3>
                </div>
              </div>
              <p className="network-card-desc">
                Acesso direto às Matrizes Curriculares do SESI para o Ensino Fundamental (Anos Finais) e Ensino Médio.
              </p>
              <ul className="network-feature-list">
                <li><Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Ciências da Natureza, Humanas, Linguagens e Matemática</li>
                <li><Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Matrizes de Itinerários Formativos (IFA / MHL)</li>
                <li><Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Matriz de Projeto de Vida (VF 2025)</li>
                <li><Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Códigos e competências específicas padronizadas da Rede SESI</li>
              </ul>
            </div>

            {/* Card OUTRA REDE */}
            <div className="network-card geral-card">
              <div className="network-card-header">
                <div className="network-icon-box bg-geral">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="network-badge-label-geral">Nacional</span>
                  <h3 className="network-card-title">Outra Rede / Escola Geral</h3>
                </div>
              </div>
              <p className="network-card-desc">
                Acesso integral à Matriz Nacional Oficial da BNCC (Base Nacional Comum Curricular) do MEC.
              </p>
              <ul className="network-feature-list">
                <li><Check className="w-4 h-4 text-indigo-500 mr-2 shrink-0" /> Habilidades da Educação Infantil ao Ensino Médio</li>
                <li><Check className="w-4 h-4 text-indigo-500 mr-2 shrink-0" /> Filtro por Área de Conhecimento e Componente Curricular</li>
                <li><Check className="w-4 h-4 text-indigo-500 mr-2 shrink-0" /> Competências Gerais da BNCC (10 Competências)</li>
                <li><Check className="w-4 h-4 text-indigo-500 mr-2 shrink-0" /> Padrão aceito em escolas públicas e privadas de todo o Brasil</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Demonstração Viva de Documento Exemplo */}
      <section className="section-document-preview" id="demonstracao">
        <div className="document-preview-inner">
          <div className="section-title-badge">
            <Sparkles className="w-4 h-4 text-amber-500 mr-2" />
            <span>Resultado Real da Inteligência Artificial</span>
          </div>
          <h2 className="section-main-title">Veja como fica o documento pronto para uso</h2>
          <p className="section-main-sub">Documentos estruturados no padrão pedagógico impresso, prontos para assinatura e aplicação em sala.</p>

          {/* Abas de Alternância do Preview */}
          <div className="preview-tab-buttons">
            <button
              className={`preview-tab-btn ${activePreviewTab === 'lesson' ? 'active' : ''}`}
              onClick={() => setActivePreviewTab('lesson')}
            >
              <FileText className="w-4 h-4 mr-2" />
              <span>Exemplo: Plano de Aula BNCC</span>
            </button>

            <button
              className={`preview-tab-btn ${activePreviewTab === 'pei' ? 'active' : ''}`}
              onClick={() => setActivePreviewTab('pei')}
            >
              <HeartHandshake className="w-4 h-4 mr-2" />
              <span>Exemplo: PEI Inclusivo (AEE)</span>
            </button>
          </div>

          {/* Card Mockup de Documento Impresso */}
          <div className="mockup-document-card">
            <div className="mockup-doc-header">
              <div className="mockup-doc-logo">
                <span className="logo-text">Edu</span><span className="logo-dot">.Plan</span>
              </div>
              <div className="mockup-doc-meta">
                <span className="mockup-doc-tag">
                  {activePreviewTab === 'lesson' ? 'PLANO DE AULA OFICIAL — BNCC' : 'PLANO DE ENSINO INDIVIDUALIZADO (PEI)'}
                </span>
                <span className="mockup-doc-date">Data: 17/08/2026</span>
              </div>
            </div>

            {activePreviewTab === 'lesson' ? (
              <div className="mockup-doc-body animate-fade-in">
                <div className="doc-preview-grid">
                  <div className="doc-field"><strong>Componente Curricular:</strong> Física / Ciências da Natureza</div>
                  <div className="doc-field"><strong>Série/Ano:</strong> 1ª Série do Ensino Médio</div>
                  <div className="doc-field"><strong>Duração:</strong> 50 minutos</div>
                  <div className="doc-field"><strong>Habilidade:</strong> EM13CNT101 — Analisar e representar transformações e conservação de energia.</div>
                </div>

                <div className="doc-section-box">
                  <h4 className="doc-box-title">🎯 Objetivos de Aprendizagem (Taxonomia de Bloom)</h4>
                  <ul className="doc-box-list">
                    <li><strong>Compreender:</strong> Identificar os diferentes tipos de energia presentes no cotidiano.</li>
                    <li><strong>Aplicar:</strong> Resolver problemas práticos de conservação de energia mecânica.</li>
                  </ul>
                </div>

                <div className="doc-section-box">
                  <h4 className="doc-box-title">⏱️ Desenvolvimento da Aula Minutado</h4>
                  <div className="doc-step-item">
                    <span className="doc-time-badge">10 min</span>
                    <div><strong>Acolhida & Problematização:</strong> Pergunta disparadora sobre o funcionamento de uma montanha-russa.</div>
                  </div>
                  <div className="doc-step-item">
                    <span className="doc-time-badge">25 min</span>
                    <div><strong>Metodologia Ativa (Estudo de Caso):</strong> Rotação por estações calculando energia cinética e potencial.</div>
                  </div>
                  <div className="doc-step-item">
                    <span className="doc-time-badge">15 min</span>
                    <div><strong>Síntese e Avaliação Formativa:</strong> Resolução de quiz rápido com devolutiva imediata aos grupos.</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mockup-doc-body animate-fade-in">
                <div className="doc-preview-grid">
                  <div className="doc-field"><strong>Estudante:</strong> Aluno(a) A. S. M.</div>
                  <div className="doc-field"><strong>Necessidade Específica:</strong> Transtorno do Espectro Autista (TEA - Nível 1)</div>
                  <div className="doc-field"><strong>Modalidade:</strong> Atendimento Educacional Especializado (AEE)</div>
                  <div className="doc-field"><strong>Série/Ano:</strong> 7º Ano do Ensino Fundamental</div>
                </div>

                <div className="doc-section-box">
                  <h4 className="doc-box-title">💡 Estratégias Pedagógicas & Adaptações Curriculares</h4>
                  <ul className="doc-box-list">
                    <li><strong>Suporte Visual:</strong> Uso de rotina estruturada com cartões visuais para organização de tarefas.</li>
                    <li><strong>Tempo Ampliado:</strong> Concessão de 15 minutos adicionais para término das atividades escritas.</li>
                    <li><strong>Redução de Estímulos:</strong> Uso de abafadores de ruído durante atividades em grupo mais ruidosas.</li>
                  </ul>
                </div>

                <div className="doc-section-box">
                  <h4 className="doc-box-title">🛠️ Recursos de Tecnologia Assistiva recomendados</h4>
                  <p className="doc-box-text">
                    Aplicativos de comunicação alternativa (CAA), adaptadores de escrita para preensão e prancha de comunicação temática para a disciplina.
                  </p>
                </div>
              </div>
            )}

            <div className="mockup-doc-footer">
              <div className="mockup-signature">_____________________________________<br/>Assinatura do(a) Professor(a)</div>
              <div className="mockup-signature">_____________________________________<br/>Visto da Coordenação Pedagógica</div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Como Funciona (Passo a Passo) */}
      <section className="section-how-it-works" id="como-funciona">
        <div className="section-how-it-works-inner">
          <div className="how-it-works-header">
            <h2 className="how-it-works-title">Como utilizar o Edu.Plan em 4 passos simples</h2>
            <p className="how-it-works-sub">Desenvolvido pensando na rotina real dos professores e coordenadores pedagógicos</p>
          </div>

          <div className="steps-landing-grid">
            <div className="step-card-landing">
              <div className="step-landing-num">1</div>
              <h3 className="step-landing-title">Selecione a Disciplina</h3>
              <p className="step-landing-desc">Escolha o componente curricular e a série/ano escolar.</p>
            </div>

            <div className="step-card-landing">
              <div className="step-landing-num">2</div>
              <h3 className="step-landing-title">Escolha a Habilidade</h3>
              <p className="step-landing-desc">Filtre as habilidades da BNCC ou utilize a matriz da escola.</p>
            </div>

            <div className="step-card-landing">
              <div className="step-landing-num">3</div>
              <h3 className="step-landing-title">Gere com IA</h3>
              <p className="step-landing-desc">Clique em gerar para o DeepSeek criar a proposta didática.</p>
            </div>

            <div className="step-card-landing">
              <div className="step-landing-num">4</div>
              <h3 className="step-landing-title">Baixe ou Imprima</h3>
              <p className="step-landing-desc">Exporte para Word (.docx) ou PDF formatado imediatamente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Recursos Pedagógicos Detalhados */}
      <section className="section-pedagogical-features">
        <div className="pedagogical-features-inner">
          <div className="section-title-badge">
            <Zap className="w-4 h-4 text-amber-500 mr-2" />
            <span>Recursos Inteligentes</span>
          </div>
          <h2 className="section-main-title">Tudo o que você precisa em uma única plataforma</h2>

          <div className="pedagogical-grid">
            <div className="pedagogical-card">
              <Clock className="w-6 h-6 text-blue-500 mb-3" />
              <h3 className="pedagogical-title">Minutagem Exata</h3>
              <p className="pedagogical-desc">Roteiro dividido passo a passo (Acolhida, Prática e Avaliação) para caber exatamente no tempo da aula.</p>
            </div>

            <div className="pedagogical-card">
              <Award className="w-6 h-6 text-amber-500 mb-3" />
              <h3 className="pedagogical-title">Taxonomia de Bloom</h3>
              <p className="pedagogical-desc">Objetivos categorizados por verbos cognitivos (Lembrar, Compreender, Aplicar, Analisar, Criar).</p>
            </div>

            <div className="pedagogical-card">
              <Layers className="w-6 h-6 text-emerald-500 mb-3" />
              <h3 className="pedagogical-title">Metodologias Ativas</h3>
              <p className="pedagogical-desc">Propostas de Sala Invertida, Rotação por Estações, Gamificação e Aprendizagem Baseada em Problemas.</p>
            </div>

            <div className="pedagogical-card">
              <HeartHandshake className="w-6 h-6 text-rose-500 mb-3" />
              <h3 className="pedagogical-title">Educação Inclusiva AEE</h3>
              <p className="pedagogical-desc">Adequações específicas e tecnologia assistiva para alunos neurodivergentes e com deficiências.</p>
            </div>

            <div className="pedagogical-card">
              <Download className="w-6 h-6 text-indigo-500 mb-3" />
              <h3 className="pedagogical-title">Download Editável</h3>
              <p className="pedagogical-desc">Baixe em .docx para alterar o que desejar no Word ou em .pdf pronto para imprimir.</p>
            </div>

            <div className="pedagogical-card">
              <ShieldCheck className="w-6 h-6 text-teal-500 mb-3" />
              <h3 className="pedagogical-title">Histórico na Nuvem</h3>
              <p className="pedagogical-desc">Todos os seus planos ficam salvos em sua conta para você consultar, editar e reavaliar quando quiser.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Perguntas Frequentes (FAQ) */}
      <section className="section-faq" id="faq">
        <div className="faq-inner">
          <div className="section-title-badge">
            <HelpCircle className="w-4 h-4 text-amber-500 mr-2" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="section-main-title">Perguntas Frequentes (FAQ)</h2>
          <p className="section-main-sub">Respostas diretas para as principais dúvidas de professores e coordenadores</p>

          <div className="faq-accordion-list">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question-box">
                  <h3 className="faq-question">{faq.question}</h3>
                  <button className="faq-toggle-icon">
                    {openFaqIndex === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
                {openFaqIndex === index && (
                  <div className="faq-answer-box animate-fade-in">
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção: Vantagens e Benefícios (Banner Escuro Podia Style) */}
      <section className="section-benefits" id="beneficios">
        <div className="benefits-podia-banner">
          <div className="benefits-content">
            <h2 className="benefits-banner-title">Economize até 80% do tempo gasto em planejamento</h2>
            <ul className="benefits-list">
              <li className="benefits-item">
                <CheckCircle2 className="w-5 h-5 benefits-check-icon" />
                <span>Base oficial de Habilidades da BNCC e Matrizes SESI integrada</span>
              </li>
              <li className="benefits-item">
                <CheckCircle2 className="w-5 h-5 benefits-check-icon" />
                <span>Metodologias Ativas, Sala Invertida e Rotação por Estações</span>
              </li>
              <li className="benefits-item">
                <CheckCircle2 className="w-5 h-5 benefits-check-icon" />
                <span>Planos de Ensino Individualizados (PEI) para Educação Inclusiva</span>
              </li>
              <li className="benefits-item">
                <CheckCircle2 className="w-5 h-5 benefits-check-icon" />
                <span>Exportação limpa e editável em Word (.docx) e PDF A4</span>
              </li>
            </ul>
          </div>

          <div className="benefits-cta-box">
            <button className="btn-podia-white-hero" onClick={() => openAuth('signup')}>
              <span>Criar Conta Grátis Agora</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <p className="benefits-sub-note">Cadastro simples com e-mail e acesso imediato</p>
          </div>
        </div>
      </section>

      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={onLoginSuccess}
        initialMode={authMode}
      />

      {/* Rodapé Oficial */}
      <Footer />
    </div>
  );
}
