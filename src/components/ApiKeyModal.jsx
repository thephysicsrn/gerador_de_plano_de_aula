import React, { useState } from 'react';
import { Key, CheckCircle, ShieldCheck, X, Sparkles, Star } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, getStoredGeminiKey, setStoredGeminiKey } from '../utils/storage';

export default function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [geminiKey, setGeminiKey] = useState(getStoredGeminiKey());
  const [deepseekKey, setDeepseekKey] = useState(getStoredApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const hasGemini = !!geminiKey.trim();
  const hasDeepSeek = !!deepseekKey.trim();

  const handleSave = (e) => {
    e.preventDefault();
    setStoredGeminiKey(geminiKey.trim());
    setStoredApiKey(deepseekKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSave();
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setGeminiKey('');
    setDeepseekKey('');
    setStoredGeminiKey('');
    setStoredApiKey('');
    onSave();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3>Configurar Inteligência Artificial</h3>
              <p>Ative a IA para gerar planos pedagógicos personalizados</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body">

          {/* OPÇÃO 1: GEMINI (RECOMENDADA) */}
          <div className="form-group" style={{
            border: '2px solid #6366f1',
            borderRadius: '14px',
            padding: '16px',
            background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
            marginBottom: '16px'
          }}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-indigo-500 fill-indigo-500" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#4338ca' }}>
                Google Gemini Flash — GRATUITO ✨
              </span>
              <span style={{
                fontSize: '0.65rem', background: '#4338ca', color: 'white',
                borderRadius: '999px', padding: '2px 8px', fontWeight: 700
              }}>RECOMENDADO</span>
            </div>

            <label htmlFor="gemini-key" className="form-label" style={{ fontSize: '0.8rem' }}>
              <Key className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              Chave de API do Google Gemini
            </label>
            <input
              id="gemini-key"
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.85rem' }}
            />
            <div className="info-box info-box-blue" style={{ marginTop: '10px', padding: '10px 12px' }}>
              <ShieldCheck className="w-4 h-4 mr-2 text-blue-400 shrink-0" />
              <div style={{ fontSize: '0.8rem' }}>
                <strong>Como obter gratuitamente (sem cartão de crédito):</strong><br />
                1. Acesse{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="underline font-semibold">
                  aistudio.google.com/apikey
                </a>
                <br />
                2. Clique em <strong>"Create API key"</strong><br />
                3. Copie e cole a chave aqui — <strong>1.500 gerações/dia grátis!</strong>
              </div>
            </div>
          </div>

          {/* OPÇÃO 2: DEEPSEEK (ALTERNATIVA) */}
          <div className="form-group" style={{
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px',
            background: '#f8fafc',
            marginBottom: '8px'
          }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>
                DeepSeek — Alternativa Paga
              </span>
            </div>

            <label htmlFor="deepseek-key" className="form-label" style={{ fontSize: '0.8rem' }}>
              <Key className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Chave de API do DeepSeek (opcional)
            </label>
            <input
              id="deepseek-key"
              type="password"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={deepseekKey}
              onChange={(e) => setDeepseekKey(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.85rem' }}
            />
            <span className="form-hint" style={{ fontSize: '0.75rem' }}>
              Usado se a chave Gemini não estiver configurada. Obtenha em{' '}
              <a href="https://platform.deepseek.com" target="_blank" rel="noreferrer" className="underline">
                platform.deepseek.com
              </a>
            </span>
          </div>

          {/* Status ativo */}
          {(hasGemini || hasDeepSeek) && !savedSuccess && (
            <div className="info-box info-box-green" style={{ padding: '10px 14px' }}>
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
              <span style={{ fontSize: '0.82rem' }}>
                IA ativa:{' '}
                <strong>
                  {hasGemini ? '✨ Google Gemini (gratuito)' : ''}
                  {hasGemini && hasDeepSeek ? ' + ' : ''}
                  {hasDeepSeek ? 'DeepSeek' : ''}
                </strong>
                {hasGemini && ' — Gemini será usado com prioridade.'}
              </span>
            </div>
          )}

          {savedSuccess && (
            <div className="info-box info-box-green">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
              <span>Configurações salvas! Assistente IA ativado.</span>
            </div>
          )}

          <div className="modal-footer">
            {(getStoredGeminiKey() || getStoredApiKey()) && (
              <button type="button" className="btn btn-secondary text-red-500" onClick={handleClear}>
                Remover Chaves
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
