import React, { useState } from 'react';
import { Key, CheckCircle, ShieldCheck, X, Sparkles } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../utils/storage';

export default function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSave();
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    onSave();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3>Integração com DeepSeek IA</h3>
              <p>Gere planos de aula e PEIs personalizados com inteligência artificial</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body">
          <div className="form-group">
            <label htmlFor="deepseek-key">
              <Key className="w-4 h-4 mr-1 text-indigo-400" />
              Chave de API do DeepSeek (DeepSeek API Key)
            </label>
            <input
              id="deepseek-key"
              type="password"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="form-input"
            />
            <span className="form-hint">
              Sua chave é armazenada exclusivamente no seu navegador com total segurança local.
            </span>
          </div>

          <div className="info-box info-box-blue">
            <ShieldCheck className="w-5 h-5 mr-2 text-blue-400 shrink-0" />
            <div className="text-sm">
              <strong>Como obter sua chave gratuita?</strong>
              <br />
              Acesse a plataforma da DeepSeek (<a href="https://platform.deepseek.com" target="_blank" rel="noreferrer" className="underline font-semibold">platform.deepseek.com</a>), crie sua conta e gere sua chave na aba "API Keys".
            </div>
          </div>

          {savedSuccess && (
            <div className="info-box info-box-green">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
              <span>Chave salva com sucesso! O assistente IA está ativado.</span>
            </div>
          )}

          <div className="modal-footer">
            {getStoredApiKey() && (
              <button type="button" className="btn btn-secondary text-red-500" onClick={handleClear}>
                Remover Chave
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar e Ativar IA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
