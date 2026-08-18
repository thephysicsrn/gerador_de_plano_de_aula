import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  FileText, 
  HeartHandshake, 
  Database, 
  BookmarkCheck, 
  Sparkles, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  Building2, 
  ChevronDown, 
  Layers, 
  UserCheck, 
  Accessibility, 
  Calendar, 
  Network,
  Grid
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, darkMode, setDarkMode, onOpenApiKeyModal, user, onLogout, onToggleRedeEnsino }) {
  const isSesi = user?.redeEnsino === 'REDE_SESI';
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const headerNavRef = useRef(null);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerNavRef.current && !headerNavRef.current.contains(event.target)) {
        setIsToolsOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectNav = (tab) => {
    setActiveTab(tab);
    setIsToolsOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-container" ref={headerNavRef}>
        {/* LADO ESQUERDO: Marca Edu.Plan + Tag da Rede */}
        <div className="header-left">
          <div className="header-brand" onClick={() => handleSelectNav('hero')}>
            <div className="brand-logo-podia">
              <span className="logo-text">Edu</span>
              <span className="logo-dot">.Plan</span>
            </div>
          </div>
          
          <button
            type="button"
            className={`brand-network-tag ${isSesi ? 'tag-sesi' : 'tag-geral'}`}
            onClick={onToggleRedeEnsino}
            title={isSesi ? "Modo REDE SESI Ativo. Clique para alternar para BNCC Geral." : "Modo BNCC Geral Ativo. Clique para alternar para REDE SESI."}
          >
            <Building2 className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span>{isSesi ? 'Rede SESI' : 'BNCC Geral'}</span>
            <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
          </button>
        </div>

        {/* CENTRO: Apenas 3 Links Limpos (Início, Mega Menu Ferramentas, Salvos) */}
        <nav className="header-nav-podia">
          {/* LINK 1: INÍCIO */}
          <button
            type="button"
            className={`nav-link-podia ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => handleSelectNav('hero')}
          >
            <Home className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Início</span>
          </button>

          {/* LINK 2: MEGA MENU DE FERRAMENTAS */}
          <div className="nav-dropdown-wrapper">
            <button
              type="button"
              className={`nav-link-podia ${['lesson-plan', 'annual-plan', 'sequence', 'interdisciplinary-project', 'pei', 'adapted-activity', 'report', 'bncc'].includes(activeTab) ? 'active' : ''}`}
              onClick={() => setIsToolsOpen(!isToolsOpen)}
            >
              <Grid className="w-4 h-4 mr-1.5 shrink-0 text-blue-500" />
              <span>Ferramentas Pedagógicas</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* MEGA MENU DROP DOWN ORGANIZADO */}
            {isToolsOpen && (
              <div className="mega-dropdown-menu animate-fade-in">
                {/* COLUNA 1: PLANEJAMENTO */}
                <div className="mega-menu-column">
                  <div className="mega-menu-heading">
                    <FileText className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                    <span>Planejamento de Ensino</span>
                  </div>

                  <button
                    type="button"
                    className={`dropdown-item-podia ${activeTab === 'lesson-plan' ? 'selected' : ''}`}
                    onClick={() => handleSelectNav('lesson-plan')}
                  >
                    <FileText className="w-4 h-4 mr-2 text-blue-500 shrink-0" />
                    <div>
                      <div className="item-title">Plano de Aula BNCC</div>
                      <div className="item-desc">Individual com minutagem e avaliação</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`dropdown-item-podia ${activeTab === 'annual-plan' ? 'selected' : ''}`}
                    onClick={() => handleSelectNav('annual-plan')}
                  >
                    <Calendar className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                    <div>
                      <div className="item-title">Plano de Curso Anual</div>
                      <div className="item-desc">Ementa bimestral do ano letivo</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`dropdown-item-podia ${activeTab === 'sequence' ? 'selected' : ''}`}
                    onClick={() => handleSelectNav('sequence')}
                  >
                    <Layers className="w-4 h-4 mr-2 text-purple-500 shrink-0" />
                    <div>
                      <div className="item-title">Sequência Didática</div>
                      <div className="item-desc">Roteiro de 4 a 8 aulas articuladas</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`dropdown-item-podia ${activeTab === 'interdisciplinary-project' ? 'selected' : ''}`}
                    onClick={() => handleSelectNav('interdisciplinary-project')}
                  >
                    <Network className="w-4 h-4 mr-2 text-emerald-500 shrink-0" />
                    <div>
                      <div className="item-title">Projeto Integrador</div>
                      <div className="item-desc">Interdisciplinar com produto maker</div>
                    </div>
                  </button>
                </div>

                {/* COLUNA 2: INCLUSÃO & RELATÓRIOS */}
                <div className="mega-menu-column border-l border-slate-100 dark:border-slate-800 pl-3">
                  <div className="mega-menu-heading">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-500 mr-1.5" />
                    <span>Inclusão, AEE & Avaliação</span>
                  </div>

                  <button
                    type="button"
                    className={`dropdown-item-podia ${activeTab === 'pei' ? 'selected' : ''}`}
                    onClick={() => handleSelectNav('pei')}
                  >
                    <HeartHandshake className="w-4 h-4 mr-2 text-amber-500 shrink-0" />
                    <div>
                      <div className="item-title">PEI Inclusivo</div>
                      <div className="item-desc">Plano Individualizado para AEE</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`dropdown-item-podia ${activeTab === 'adapted-activity' ? 'selected' : ''}`}
                    onClick={() => handleSelectNav('adapted-activity')}
                  >
                    <Accessibility className="w-4 h-4 mr-2 text-rose-500 shrink-0" />
                    <div>
                      <div className="item-title">Atividade Adaptada</div>
                      <div className="item-desc">Adaptação via texto ou PDF/Word</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`dropdown-item-podia ${activeTab === 'report' ? 'selected' : ''}`}
                    onClick={() => handleSelectNav('report')}
                  >
                    <UserCheck className="w-4 h-4 mr-2 text-teal-500 shrink-0" />
                    <div>
                      <div className="item-title">Parecer Descritivo</div>
                      <div className="item-desc">Relatório do aluno para reuniões</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`dropdown-item-podia ${activeTab === 'bncc' ? 'selected' : ''}`}
                    onClick={() => handleSelectNav('bncc')}
                  >
                    <Database className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                    <div>
                      <div className="item-title">Explorador BNCC & SESI</div>
                      <div className="item-desc">Consulta rápida de 570+ habilidades</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* LINK 3: PLANOS SALVOS */}
          <button
            type="button"
            className={`nav-link-podia ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleSelectNav('history')}
          >
            <BookmarkCheck className="w-4 h-4 mr-1.5 shrink-0 text-amber-500" />
            <span>Planos Salvos</span>
          </button>
        </nav>

        {/* LADO DIREITO: IA Status + Tema + Perfil */}
        <div className="header-actions">
          <button
            className="btn-ai-status"
            onClick={onOpenApiKeyModal}
            title="IA DeepSeek Ativa e Gratuita para todos os usuários."
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-500 shrink-0" />
            <span>DeepSeek IA</span>
          </button>

          <button
            className="theme-toggle-podia"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {user && (
            <div className="user-profile-badge">
              <div className="user-avatar-circle">
                <User className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
              </div>
              <span className="user-name-text" title={user.displayName || user.email}>
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button
                type="button"
                className="user-logout-btn"
                onClick={onLogout}
                title="Sair da Conta"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
