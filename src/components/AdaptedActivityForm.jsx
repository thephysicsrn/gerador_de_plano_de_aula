import React, { useState, useRef } from 'react';
import { Accessibility, Sparkles, Upload, FileText, CheckCircle2, Copy, File, RefreshCw } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS, NECESSIDADES_PEI } from '../data/bnccData';

export default function AdaptedActivityForm({ onGenerate, isLoading }) {
  const [inputMode, setInputMode] = useState('text'); // 'text' ou 'upload'
  const [originalText, setOriginalText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileLoading, setFileLoading] = useState(false);

  // Parâmetros de Adaptação
  const [necessidade, setNecessidade] = useState('Transtorno do Espectro Autista (TEA / Autismo)');
  const [disciplina, setDisciplina] = useState('Língua Portuguesa');
  const [anoSerie, setAnoSerie] = useState('6º Ano (Ensino Fundamental II)');
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
    <div className="workspace-split-container animate-fade-in">
      <div className="form-card main-form-card">
        {/* Banner de Título Padrão */}
        <div className="form-card-header">
          <div className="icon-wrapper bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
            <Accessibility className="w-6 h-6" />
          </div>
          <div>
            <h2>Adaptação Rápida de Atividades & Acessibilidade</h2>
            <p>Transforme qualquer exercício ou texto de prova em uma versão acessível para TEA, TDAH, Dislexia ou Baixa Visão</p>
          </div>
        </div>

        {/* Escolha do Modo de Entrada: Copiar & Colar vs Upload */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            className={`btn flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${inputMode === 'text' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setInputMode('text')}
          >
            <Copy className="w-4 h-4 mr-2 inline" />
            Copiar & Colar Texto
          </button>

          <button
            type="button"
            className={`btn flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${inputMode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setInputMode('upload')}
          >
            <Upload className="w-4 h-4 mr-2 inline" />
            Upload de Arquivo (PDF / TXT / DOC)
          </button>
        </div>

        {/* MODO 1: COPIAR E COLAR TEXTO */}
        {inputMode === 'text' && (
          <div className="form-group col-span-12 animate-fade-in mb-4">
            <label className="form-label">
              <FileText className="w-4 h-4 text-indigo-500 mr-1.5 inline shrink-0" />
              <span>Cole aqui a Atividade ou Enunciado Original</span>
            </label>
            <textarea
              className="form-textarea font-mono text-sm"
              rows={5}
              placeholder="Ex: Questão 1: Leia o texto abaixo e analise as causas da Revolução Industrial na Europa do século XVIII..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
            />
          </div>
        )}

        {/* MODO 2: UPLOAD DE ARQUIVO */}
        {inputMode === 'upload' && (
          <div className="form-group col-span-12 animate-fade-in mb-4">
            <label className="form-label">
              <Upload className="w-4 h-4 text-emerald-500 mr-1.5 inline shrink-0" />
              <span>Selecione o Arquivo da Atividade (PDF, TXT, DOCX)</span>
            </label>

            <div
              className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center cursor-pointer hover:border-emerald-500 transition-colors bg-slate-50/50 dark:bg-slate-900/50"
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
                <div className="flex flex-col items-center justify-center py-4">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                  <span className="text-sm font-medium">Extraindo texto do arquivo...</span>
                </div>
              ) : fileName ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{fileName}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Texto extraído com sucesso! Clique para alterar.</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <File className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Clique para selecionar ou arraste o arquivo aqui</span>
                  <span className="text-xs text-slate-500 mt-1">Suporta PDF, TXT, Word (.docx) e arquivos de texto</span>
                </div>
              )}
            </div>

            {/* Preview do texto lido */}
            {originalText && (
              <div className="mt-3">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 block">Pré-visualização do texto extraído:</label>
                <textarea
                  className="form-textarea font-mono text-xs text-slate-700 dark:text-slate-300"
                  rows={3}
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* OPÇÕES DE ADAPTAÇÃO INCLUSIVA */}
        <div className="form-grid">
          <div className="form-group col-span-6">
            <label className="form-label">
              <Accessibility className="w-4 h-4 text-rose-500 mr-1.5 inline shrink-0" />
              <span>Público-Alvo / Necessidade Específica</span>
            </label>
            <select
              className="form-select"
              value={necessidade}
              onChange={(e) => setNecessidade(e.target.value)}
            >
              {NECESSIDADES_PEI.map(n => {
                const label = typeof n === 'object' ? (n.label || n.name) : n;
                return <option key={label} value={label}>{label}</option>;
              })}
              <option value="Adaptação Geral AEE (Simplificação de Vocabulário & Pistas Visuais)">Adaptação Geral AEE (Simplificação de Vocabulário & Pistas Visuais)</option>
            </select>
          </div>

          <div className="form-group col-span-6">
            <label className="form-label">Série / Ano Escolar</label>
            <select
              className="form-select"
              value={anoSerie}
              onChange={(e) => setAnoSerie(e.target.value)}
            >
              {ANOS_SERIES.map(s => {
                const label = typeof s === 'object' ? (s.label || s.name) : s;
                return <option key={label} value={label}>{label}</option>;
              })}
            </select>
          </div>

          <div className="form-group col-span-6 mt-3">
            <label className="form-label">Componente Curricular / Disciplina</label>
            <select
              className="form-select"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
            >
              {DISCIPLINAS.map(d => {
                const name = typeof d === 'object' ? (d.name || d.label) : d;
                return <option key={name} value={name}>{name}</option>;
              })}
            </select>
          </div>

          <div className="form-group col-span-6 mt-3">
            <label className="form-label">Nível de Ajuste / Flexibilização</label>
            <select
              className="form-select"
              value={nivelSimplificacao}
              onChange={(e) => setNivelSimplificacao(e.target.value)}
            >
              <option value="Suave (Apenas suporte visual, negritos de destaque e caixas de apoio)">Suave (Apenas suporte visual, negritos de destaque e caixas de apoio)</option>
              <option value="Médio (Manter objetivo com suporte visual e frases curtas)">Médio (Manter objetivo com suporte visual e frases curtas)</option>
              <option value="Intenso (Adequação direta com imagem descritiva e enunciado fracionado)">Intenso (Adequação direta com imagem descritiva e enunciado fracionado)</option>
            </select>
          </div>

          <div className="form-group col-span-12 mt-3">
            <label className="form-label">Observações Especiais para a IA (Opcional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Incluir caixa de palavras chave (banco de respostas) para o aluno consultar."
              value={instrucoesExtras}
              onChange={(e) => setInstrucoesExtras(e.target.value)}
            />
          </div>
        </div>

        {/* CTA DE GERAÇÃO */}
        <div className="step-nav-footer mt-6">
          <div></div>

          <button
            type="button"
            className="btn btn-primary btn-sparkle"
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
  );
}
