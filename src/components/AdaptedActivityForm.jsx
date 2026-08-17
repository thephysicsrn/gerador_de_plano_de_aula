import React, { useState, useRef } from 'react';
import { Accessibility, Sparkles, Upload, FileText, CheckCircle2, ChevronRight, Copy, File, AlertCircle, RefreshCw } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS, NECESSIDADES_PEI } from '../data/bnccData';

export default function AdaptedActivityForm({ onGenerate, isLoading }) {
  const [inputMode, setInputMode] = useState('text'); // 'text' ou 'upload'
  const [originalText, setOriginalText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileLoading, setFileLoading] = useState(false);

  // Parâmetros de Adaptação
  const [necessidade, setNecessidade] = useState('Transtorno do Espectro Autista (TEA / Autismo)');
  const [disciplina, setDisciplina] = useState('Língua Portuguesa');
  const [anoSerie, setAnoSerie] = useState('6º Ano');
  const [nivelSimplificacao, setNivelSimplificacao] = useState('Médio (Manter objetivo com suporte visual e frases curtas)');
  const [instrucoesExtras, setInstrucoesExtras] = useState('');

  const fileInputRef = useRef(null);

  // Leitura automática do arquivo enviado
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileLoading(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      let content = event.target.result;

      // Se for PDF ou binário com caracteres de controle, limpa os caracteres não imprimíveis
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        content = content
          .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      setOriginalText(content);
      setFileLoading(false);
    };

    reader.onerror = () => {
      alert('Erro ao ler o arquivo. Tente copiar e colar o texto diretamente.');
      setFileLoading(false);
    };

    // Lê como texto plano
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
      setFileName(file.name);
      setFileLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalText(event.target.result);
        setFileLoading(false);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (useAi = true) => {
    if (!originalText.trim()) {
      alert('Por favor, cole o texto da atividade ou faça o upload de um arquivo.');
      return;
    }

    const formData = {
      isAdaptedActivity: true,
      type: 'adaptedActivity',
      originalText,
      necessidade,
      disciplina,
      anoSerie,
      nivelSimplificacao,
      instrucoesExtras,
      fileName
    };

    onGenerate(formData, useAi);
  };

  return (
    <div className="form-page-container animate-fade-in">
      <div className="form-card-podia">
        {/* Cabeçalho do Formulário */}
        <div className="form-header-podia">
          <div className="form-badge-pill bg-rose-pill">
            <Accessibility className="w-4 h-4 mr-1.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Gerador de Atividades Adaptadas com IA</span>
          </div>
          <h2 className="form-title-podia">Adaptação Rápida de Atividades & Acessibilidade</h2>
          <p className="form-subtitle-podia">
            Transforme qualquer exercício ou texto de prova em uma versão acessível para TEA (Autismo), TDAH, Dislexia ou Baixa Visão instantaneamente.
          </p>
        </div>

        {/* Escolha do Modo de Entrada: Copiar & Colar vs Upload */}
        <div className="auth-tab-buttons mb-6">
          <button
            type="button"
            className={`auth-tab-btn ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            <Copy className="w-4 h-4 mr-2 inline" />
            Copiar & Colar Texto
          </button>

          <button
            type="button"
            className={`auth-tab-btn ${inputMode === 'upload' ? 'active' : ''}`}
            onClick={() => setInputMode('upload')}
          >
            <Upload className="w-4 h-4 mr-2 inline" />
            Upload de Arquivo (PDF / TXT / DOC)
          </button>
        </div>

        {/* MODO 1: COPIAR E COLAR TEXTO */}
        {inputMode === 'text' && (
          <div className="form-field-group animate-fade-in">
            <label className="form-label-podia">
              <FileText className="w-4 h-4 text-indigo-500 mr-1.5 inline shrink-0" />
              <span>Cole aqui a Atividade ou Enunciado Original</span>
            </label>
            <textarea
              className="form-textarea-podia font-mono text-sm"
              rows="6"
              placeholder="Ex: Questão 1: Leia o texto abaixo e analise as causas da Revolução Industrial na Europa do século XVIII..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
            />
          </div>
        )}

        {/* MODO 2: UPLOAD DE ARQUIVO */}
        {inputMode === 'upload' && (
          <div className="form-field-group animate-fade-in">
            <label className="form-label-podia">
              <Upload className="w-4 h-4 text-emerald-500 mr-1.5 inline shrink-0" />
              <span>Selecione o Arquivo da Atividade (PDF, TXT, DOCX)</span>
            </label>

            <div
              className="file-dropzone-box"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.pdf,.doc,.docx,.json,.md"
                style={{ display: 'none' }}
              />

              {fileLoading ? (
                <div className="dropzone-loading">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                  <span>Extraindo texto do arquivo...</span>
                </div>
              ) : fileName ? (
                <div className="dropzone-success">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{fileName}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Texto extraído com sucesso! Clique para alterar o arquivo.</span>
                </div>
              ) : (
                <div className="dropzone-prompt">
                  <File className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Clique para selecionar ou arraste o arquivo aqui</span>
                  <span className="text-xs text-slate-500 mt-1">Suporta PDF, TXT, Word (.docx) e arquivos de texto</span>
                </div>
              )}
            </div>

            {/* Preview do texto lido do arquivo */}
            {originalText && (
              <div className="mt-3">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 block">Pré-visualização do texto extraído:</label>
                <textarea
                  className="form-textarea-podia font-mono text-xs text-slate-700 dark:text-slate-300"
                  rows="4"
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* OPÇÕES DE ADAPTAÇÃO INCLUSIVA */}
        <div className="form-grid-2 mt-6">
          <div className="form-field-group">
            <label className="form-label-podia">
              <Accessibility className="w-4 h-4 text-rose-500 mr-1.5 inline shrink-0" />
              <span>Público-Alvo / Necessidade Específica</span>
            </label>
            <select
              className="form-select-podia"
              value={necessidade}
              onChange={(e) => setNecessidade(e.target.value)}
            >
              {NECESSIDADES_PEI.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="Adaptação Geral AEE (Simplificação de Vocabulário & Pistas Visuais)">Adaptação Geral AEE (Simplificação de Vocabulário & Pistas Visuais)</option>
            </select>
          </div>

          <div className="form-field-group">
            <label className="form-label-podia">
              <span>Série / Ano Escolar</span>
            </label>
            <select
              className="form-select-podia"
              value={anoSerie}
              onChange={(e) => setAnoSerie(e.target.value)}
            >
              {ANOS_SERIES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid-2 mt-4">
          <div className="form-field-group">
            <label className="form-label-podia">
              <span>Componente Curricular / Disciplina</span>
            </label>
            <select
              className="form-select-podia"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
            >
              {DISCIPLINAS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-field-group">
            <label className="form-label-podia">
              <span>Nível de Ajuste / Flexibilização</span>
            </label>
            <select
              className="form-select-podia"
              value={nivelSimplificacao}
              onChange={(e) => setNivelSimplificacao(e.target.value)}
            >
              <option value="Suave (Apenas suporte visual, negritos de destaque e caixas de apoio)">Suave (Apenas suporte visual, negritos de destaque e caixas de apoio)</option>
              <option value="Médio (Manter objetivo com suporte visual e frases curtas)">Médio (Manter objetivo com suporte visual e frases curtas)</option>
              <option value="Intenso (Adequação direta com imagem descritiva e enunciado fracionado)">Intenso (Adequação direta com imagem descritiva e enunciado fracionado)</option>
            </select>
          </div>
        </div>

        <div className="form-field-group mt-4">
          <label className="form-label-podia">
            <span>Observações Especiais para a IA (Opcional)</span>
          </label>
          <input
            type="text"
            className="form-input-podia"
            placeholder="Ex: Incluir caixa de palavras chave (banco de respostas) para o aluno consultar."
            value={instrucoesExtras}
            onChange={(e) => setInstrucoesExtras(e.target.value)}
          />
        </div>

        {/* CTA DE GERAÇÃO */}
        <div className="generate-cta-box-podia mt-6">
          <div className="generate-info">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <span> O DeepSeek reescreverá a atividade mantendo o objetivo pedagógico com suporte de acessibilidade.</span>
          </div>

          <div className="cta-button-row">
            <div></div>

            <button
              className="btn-podia-hero-black"
              onClick={() => handleSubmit(true)}
              disabled={isLoading || fileLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="spinner mr-2"></span>
                  Adaptando Atividade...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
                  <span>Gerar Versão Adaptada com IA</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
