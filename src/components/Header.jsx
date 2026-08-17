import React from 'react';
import { Home, FileText, HeartHandshake, Database, BookmarkCheck, Sparkles, Sun, Moon, LogOut, User, Building2, ChevronDown, Layers, UserCheck } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, darkMode, setDarkMode, onOpenApiKeyModal, user, onLogout, onToggleRedeEnsino }) {
  const isSesi = user?.redeEnsino === 'REDE_SESI';

  return (
    <header className="app-header">
      <div className="header-container">
        {/* LADO ESQUERDO: Marca Edu.Plan + Tag da Rede */}
        <div className="header-left">
          <div className="header-brand" onClick={() => setActiveTab('hero')}>
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
            <Building2 className="w-3 h-3 mr-1 shrink-0" />
            <span>{isSesi ? 'Rede SESI' : 'BNCC Geral'}</span>
            <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
          </button>
        </div>

        {/* CENTRO: Navegação Principal */}
        <nav className="header-nav-podia">
          <button
            className={`nav-link-podia ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <Home className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Início</span>
          </button>

          <button
            className={`nav-link-podia ${activeTab === 'lesson-plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('lesson-plan')}
          >
            <FileText className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Plano de Aula</span>
          </button>

          <button
            className={`nav-link-podia ${activeTab === 'sequence' ? 'active' : ''}`}
            onClick={() => setActiveTab('sequence')}
          >
            <Layers className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Sequência Didática</span>
          </button>

          <button
            className={`nav-link-podia ${activeTab === 'pei' ? 'active' : ''}`}
            onClick={() => setActiveTab('pei')}
          >
            <HeartHandshake className="w-4 h-4 mr-1.5 shrink-0" />
            <span>PEI Inclusivo</span>
          </button>

          <button
            className={`nav-link-podia ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <UserCheck className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Relatório Pedagógico</span>
          </button>

          <button
            className={`nav-link-podia ${activeTab === 'bncc' ? 'active' : ''}`}
            onClick={() => setActiveTab('bncc')}
          >
            <Database className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Base BNCC</span>
          </button>

          <button
            className={`nav-link-podia ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <BookmarkCheck className="w-4 h-4 mr-1.5 shrink-0" />
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
