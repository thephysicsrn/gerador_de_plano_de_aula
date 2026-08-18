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
  Network 
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, darkMode, setDarkMode, onOpenApiKeyModal, user, onLogout, onToggleRedeEnsino }) {
  const isSesi = user?.redeEnsino === 'REDE_SESI';
  const [openDropdown, setOpenDropdown] = useState(null); // 'planning' | 'inclusion' | 'reports' | null
  const headerNavRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerNavRef.current && !headerNavRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectNav = (tab) => {
    setActiveTab(tab);
    setOpenDropdown(null);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header className="app-header">
      <div className="header-container">
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

        {/* CENTRO: Navegação Organizada em Categorias & Dropdowns */}
        <nav className="header-nav-podia" ref={headerNavRef}>
          {/* LINK: INÍCIO */}
          <button
            type="button"
            className={`nav-link-podia ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => handleSelectNav('hero')}
          >
            <Home className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Início</span>
          </button>

          {/* DROPDOWN 1: PLANEJAMENTO */}
          <div className="nav-dropdown-wrapper">
            <button
              type="button"
              className={`nav-link-podia ${['lesson-plan', 'annual-plan', 'sequence', 'interdisciplinary-project'].includes(activeTab) ? 'active' : ''}`}
              onClick={() => toggleDropdown('planning')}
            >
              <FileText className="w-4 h-4 mr-1.5 shrink-0 text-blue-500" />
              <span>Planejamento</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${openDropdown === 'planning' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'planning' && (
              <div className="nav-dropdown-menu animate-fade-in">
                <button
                  type="button"
                  className={`dropdown-item-podia ${activeTab === 'lesson-plan' ? 'selected' : ''}`}
                  onClick={() => handleSelectNav('lesson-plan')}
                >
                  <FileText className="w-4 h-4 mr-2 text-blue-500 shrink-0" />
                  <div>
                    <div className="item-title">Plano de Aula BNCC</div>
                    <div className="item-desc">Aula individual com minutagem e avaliação</div>
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
                    <div className="item-desc">Ementa dos 4 bimestres do ano</div>
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
                    <div className="item-desc">Planejamento articulado de 4 a 8 aulas</div>
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
                    <div className="item-desc">Projeto interdisciplinar com produto maker</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* DROPDOWN 2: INCLUSÃO & AEE */}
          <div className="nav-dropdown-wrapper">
            <button
              type="button"
              className={`nav-link-podia ${['pei', 'adapted-activity'].includes(activeTab) ? 'active' : ''}`}
              onClick={() => toggleDropdown('inclusion')}
            >
              <HeartHandshake className="w-4 h-4 mr-1.5 shrink-0 text-rose-500" />
              <span>Inclusão & AEE</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${openDropdown === 'inclusion' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'inclusion' && (
              <div className="nav-dropdown-menu animate-fade-in">
                <button
                  type="button"
                  className={`dropdown-item-podia ${activeTab === 'pei' ? 'selected' : ''}`}
                  onClick={() => handleSelectNav('pei')}
                >
                  <HeartHandshake className="w-4 h-4 mr-2 text-amber-500 shrink-0" />
                  <div>
                    <div className="item-title">PEI Inclusivo</div>
                    <div className="item-desc">Plano de Ensino Individualizado para AEE</div>
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
                    <div className="item-desc">Adaptação rápida via texto ou upload (PDF/Word)</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* DROPDOWN 3: RELATÓRIOS & GESTÃO */}
          <div className="nav-dropdown-wrapper">
            <button
              type="button"
              className={`nav-link-podia ${['report', 'bncc'].includes(activeTab) ? 'active' : ''}`}
              onClick={() => toggleDropdown('reports')}
            >
              <UserCheck className="w-4 h-4 mr-1.5 shrink-0 text-teal-500" />
              <span>Relatórios & BNCC</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${openDropdown === 'reports' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'reports' && (
              <div className="nav-dropdown-menu animate-fade-in">
                <button
                  type="button"
                  className={`dropdown-item-podia ${activeTab === 'report' ? 'selected' : ''}`}
                  onClick={() => handleSelectNav('report')}
                >
                  <UserCheck className="w-4 h-4 mr-2 text-teal-500 shrink-0" />
                  <div>
                    <div className="item-title">Parecer Descritivo</div>
                    <div className="item-desc">Relatório pedagógico individual do aluno</div>
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
            )}
          </div>

          {/* LINK: SALVOS */}
          <button
            type="button"
            className={`nav-link-podia ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleSelectNav('history')}
          >
            <BookmarkCheck className="w-4 h-4 mr-1.5 shrink-0 text-amber-500" />
            <span>Salvos</span>
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
