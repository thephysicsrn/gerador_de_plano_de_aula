import React, { useState } from 'react';
import { User, Mail, Lock, X, Sparkles, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';
import { signInUser, signUpUser, signInDemoUser } from '../services/firebaseService';

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

  const handleDemoLogin = (selectedRede) => {
    const user = signInDemoUser(selectedRede || redeEnsino);
    onAuthSuccess(user);
    onClose();
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

          <div className="auth-divider">
            <span>ou continue com</span>
          </div>

          <button
            type="button"
            className="auth-demo-btn"
            onClick={() => handleDemoLogin('REDE_SESI')}
          >
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Entrar como Professor REDE SESI (Demonstração)</span>
          </button>
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
