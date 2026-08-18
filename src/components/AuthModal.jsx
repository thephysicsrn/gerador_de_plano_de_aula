import React, { useState } from 'react';
import { User, Mail, Lock, X, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';
import { signInUser, signUpUser, signInWithGoogle, signInWithMicrosoft } from '../services/firebaseService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' ou 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [redeEnsino, setRedeEnsino] = useState('REDE_SESI');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Preencha o e-mail e a senha.');
      return;
    }

    if (mode === 'signup' && !displayName.trim()) {
      setErrorMsg('Informe o seu nome completo.');
      return;
    }

    setIsLoading(true);
    try {
      let user;
      if (mode === 'signup') {
        user = await signUpUser(email, password, displayName, redeEnsino);
      } else {
        user = await signInUser(email, password, redeEnsino);
      }
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao realizar autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const user = await signInWithGoogle(redeEnsino);
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao entrar com Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftAuth = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const user = await signInWithMicrosoft(redeEnsino);
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao entrar com Microsoft.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="modal-backdrop">
      <div className="modal-card auth-modal-card animate-fade-in">
        {/* Cabeçalho do Modal */}
        <div className="modal-header">
          <div className="brand-logo-podia">
            <span className="logo-text">Edu</span>
            <span className="logo-dot">.Plan</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alternador de Abas: Login vs Cadastro */}
        <div className="auth-tab-buttons">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrorMsg(''); }}
          >
            Entrar na Conta
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
          >
            Criar Conta Grátis
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-body">
          {errorMsg && (
            <div className="auth-error-banner">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div className="auth-field-group">
              <label className="auth-field-label">Nome Completo</label>
              <div className="auth-input-wrapper">
                <User className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input with-icon"
                  placeholder="Profª Maria Silva"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          {/* Seleção de Rede de Ensino (Rede SESI vs Outra Rede) */}
          <div className="auth-field-group">
            <label className="auth-field-label">
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>Rede de Ensino / Instituição</span>
            </label>
            <select
              className="auth-select"
              value={redeEnsino}
              onChange={(e) => setRedeEnsino(e.target.value)}
            >
              <option value="REDE_SESI">🏫 Professor da REDE SESI (Matrizes SESI + BNCC)</option>
              <option value="OUTRA_REDE">🎓 Outra Rede / Escola Geral (Apenas BNCC Oficial)</option>
            </select>

            <div className="auth-network-info-box">
              {redeEnsino === 'REDE_SESI' ? (
                <div className="auth-network-info-content">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Modo REDE SESI Ativo:</strong> Acesso completo às Matrizes Curriculares do SESI (Fundamental Anos Finais & Médio) + BNCC Oficial.</span>
                </div>
              ) : (
                <div className="auth-network-info-content">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span><strong>Modo Escola Geral Ativo:</strong> Acesso à Matriz Geral Oficial da BNCC.</span>
                </div>
              )}
            </div>
          </div>

          <div className="auth-field-group">
            <label className="auth-field-label">E-mail</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" />
              <input
                type="email"
                className="auth-input with-icon"
                placeholder="seu.email@escola.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label className="auth-field-label">Senha</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" />
              <input
                type="password"
                className="auth-input with-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-btn-loading">
                <span className="spinner mr-2"></span>
                Autenticando...
              </span>
            ) : (
              <span>{mode === 'signup' ? 'Criar Minha Conta Grátis' : 'Entrar no Edu.Plan'}</span>
            )}
          </button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 font-medium uppercase">ou acesse com</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="btn btn-secondary flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.3 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.6 6.3C.6 8.3 0 10.6 0 13s.6 4.7 1.6 6.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              onClick={handleMicrosoftAuth}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span>Microsoft</span>
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            {mode === 'login' ? (
              <>
                Ainda não tem uma conta?{' '}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => setMode('signup')}
                >
                  Cadastre-se grátis
                </button>
              </>
            ) : (
              <>
                Já possui cadastro?{' '}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => setMode('login')}
                >
                  Faça login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
