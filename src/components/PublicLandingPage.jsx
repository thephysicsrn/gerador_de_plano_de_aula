import React, { useState } from 'react';
import { 
  FileText, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  UserCheck, 
  Sun, 
  Moon
} from 'lucide-react';
import AuthModal from './AuthModal';
import Footer from './Footer';

export default function PublicLandingPage({ onLoginSuccess, darkMode, setDarkMode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

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
            <a href="#funcionalidades" className="nav-link-podia">Funcionalidades</a>
            <a href="#como-funciona" className="nav-link-podia">Como Funciona</a>
            <a href="#beneficios" className="nav-link-podia">Vantagens</a>
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
            <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
            <span>Inteligência Artificial DeepSeek Integrada</span>
          </div>

          <h1 className="hero-podia-title">
            Planejamento pedagógico inteligente, simples e 100% alinhado à BNCC
          </h1>
          <p className="hero-podia-subtitle">
            Gere planos de aula completos e Planos de Ensino Individualizados (PEI) em segundos. Baixe em Word (.docx) ou PDF formatado para impressão.
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

      {/* Seção: Como Funciona (Passo a Passo) */}
      <section className="section-how-it-works" id="como-funciona">
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
      </section>

      {/* Seção: Vantagens e Benefícios (Banner Escuro Podia Style) */}
      <section className="section-benefits" id="beneficios">
        <div className="benefits-podia-banner">
          <div className="benefits-content">
            <h2 className="benefits-banner-title">Economize até 80% do tempo gasto em planejamento</h2>
            <ul className="benefits-list">
              <li className="benefits-item">
                <CheckCircle2 className="w-5 h-5 benefits-check-icon" />
                <span>Base oficial de Habilidades da BNCC integrada e pesquisável</span>
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
            <p className="benefits-sub-note">Acesso instantâneo com e-mail ou modo visitante</p>
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
