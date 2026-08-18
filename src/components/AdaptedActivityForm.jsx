import React, { useState, useRef } from 'react';
import { Accessibility, Sparkles, Upload, FileText, CheckCircle2, Copy, File, RefreshCw, AlertTriangle } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS, NECESSIDADES_PEI } from '../data/bnccData';

export default function AdaptedActivityForm({ onGenerate, isLoading }) {
  const [inputMode, setInputMode] = useState('text');
  const [originalText, setOriginalText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  // Parâmetros de Adaptação
  const [necessidade, setNecessidade] = useState('Transtorno do Espectro Autista (TEA / Autismo)');
  const [disciplina, setDisciplina] = useState('Língua Portuguesa');
  const [anoSerie, setAnoSerie] = useState('6º Ano (Ensino Fundamental II)');
  const [nivelSimplificacao, setNivelSimplificacao] = useState('Médio (Manter objetivo com suporte visual e frases curtas)');
  const [instrucoesExtras, setInstrucoesExtras] = useState('');

  const fileInputRef = useRef(null);

  // --- Extratores de texto por tipo de arquivo ---

  const extractPdfText = async (arrayBuffer) => {
    const pdfjsLib = await import('pdfjs-dist');
    // Aponta o worker para o arquivo correto dentro do node_modules
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageTexts = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // Agrupa itens por linha usando transform[5] (y-coordinate)
      const lines = {};
      textContent.items.forEach((item) => {
        const y = Math.round(item.transform[5]);
        if (!lines[y]) lines[y] = [];
        lines[y].push(item.str);
      });
      const sortedY = Object.keys(lines).map(Number).sort((a, b) => b - a);
      const pageText = sortedY.map((y) => lines[y].join(' ')).join('\n');
      pageTexts.push(pageText);
    }
    return pageTexts.join('\n\n').trim();
  };

  const extractDocxText = async (arrayBuffer) => {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  };

  const extractTxtText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Falha ao ler arquivo de texto.'));
      reader.readAsText(file, 'UTF-8');
    });
  };

  // --- Handler principal de upload ---

  const processFile = async (file) => {
    setFileName(file.name);
    setFileLoading(true);
    setOriginalText('');
    setFileError('');

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      let extractedText = '';

      if (ext === 'pdf') {
        const buffer = await file.arrayBuffer();
        extractedText = await extractPdfText(buffer);
      } else if (ext === 'docx' || ext === 'doc') {
        const buffer = await file.arrayBuffer();
        extractedText = await extractDocxText(buffer);
      } else if (['txt', 'md', 'csv'].includes(ext)) {
        extractedText = await extractTxtText(file);
      } else {
        // Tenta ler como texto puro como fallback
        extractedText = await extractTxtText(file);
      }

      if (!extractedText || extractedText.length < 10) {
        setFileError('Não foi possível extrair texto legível deste arquivo. Tente copiar e colar o conteúdo diretamente.');
        setOriginalText('');
      } else {
        setOriginalText(extractedText);
      }
    } catch (err) {
      console.error('Erro ao processar arquivo:', err);
      setFileError('Erro ao processar o arquivo: ' + (err.message || 'formato não suportado. Use PDF, DOCX ou TXT.'));
      setOriginalText('');
    } finally {
      setFileLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleReset = () => {
    setFileName('');
    setOriginalText('');
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Submit ---

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
        {/* Banner de Título */}
        <div className="form-card-header">
          <div className="icon-wrapper bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
            <Accessibility className="w-6 h-6" />
          </div>
          <div>
            <h2>Adaptação Rápida de Atividades &amp; Acessibilidade</h2>
            <p>Transforme qualquer exercício ou texto de prova em uma versão acessível para TEA, TDAH, Dislexia ou Baixa Visão</p>
          </div>
        </div>

        {/* Modo de entrada */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            className={`btn flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${inputMode === 'text' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setInputMode('text')}
          >
            <Copy className="w-4 h-4 mr-2 inline" />
            Copiar &amp; Colar Texto
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

        {/* MODO 1: COPIAR E COLAR */}
        {inputMode === 'text' && (
          <div className="form-group col-span-12 animate-fade-in mb-4">
            <label className="form-label">
              <FileText className="w-4 h-4 text-indigo-500 mr-1.5 inline shrink-0" />
              <span>Cole aqui a Atividade ou Enunciado Original</span>
            </label>
            <textarea
              className="form-textarea text-sm"
              rows={6}
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

            {/* Drop zone */}
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
                accept=".txt,.pdf,.doc,.docx,.md"
                style={{ display: 'none' }}
              />

              {fileLoading ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                  <span className="text-sm font-medium text-slate-600">Extraindo texto do arquivo...</span>
                  <span className="text-xs text-slate-400 mt-1">Isso pode levar alguns segundos para PDFs grandes</span>
                </div>
              ) : fileError ? (
                <div className="flex flex-col items-center justify-center py-3">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="font-bold text-amber-700 dark:text-amber-400 text-sm mb-1">Não foi possível ler o arquivo</span>
                  <span className="text-xs text-slate-500 max-w-xs">{fileError}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="mt-3 text-xs text-indigo-600 underline hover:text-indigo-800"
                  >
                    Tentar outro arquivo
                  </button>
                </div>
              ) : fileName && originalText ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{fileName}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    ✅ {originalText.length.toLocaleString('pt-BR')} caracteres extraídos · Clique para alterar
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <File className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Clique para selecionar ou arraste o arquivo aqui</span>
                  <span className="text-xs text-slate-500 mt-1">PDF, TXT e Word (.docx) — extração automática de texto</span>
                </div>
              )}
            </div>

            {/* Pré-visualização do texto extraído */}
            {originalText && !fileLoading && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Pré-visualização do texto extraído ({originalText.split('\n').filter(l => l.trim()).length} linhas):
                  </label>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-rose-500 hover:text-rose-700 underline"
                  >
                    Limpar arquivo
                  </button>
                </div>
                <textarea
                  className="form-textarea text-xs text-slate-700 dark:text-slate-300"
                  style={{ fontFamily: 'inherit', lineHeight: '1.6' }}
                  rows={5}
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">💡 Você pode editar o texto acima antes de gerar a adaptação.</p>
              </div>
            )}
          </div>
        )}

        {/* OPÇÕES DE ADAPTAÇÃO */}
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
              <option value="Adaptação Geral AEE (Simplificação de Vocabulário &amp; Pistas Visuais)">
                Adaptação Geral AEE (Simplificação de Vocabulário &amp; Pistas Visuais)
              </option>
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

        {/* CTA */}
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
