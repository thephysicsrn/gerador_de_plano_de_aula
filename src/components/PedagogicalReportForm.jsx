import React, { useState } from 'react';
import { UserCheck, Sparkles, User, BookOpen, CheckCircle2, ChevronRight, HeartHandshake } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS } from '../data/bnccData';

export default function PedagogicalReportForm({ onGenerate, isLoading }) {
  const [activeStep, setActiveStep] = useState(1);

  // Campos do Formulário
  const [nomeAluno, setNomeAluno] = useState('');
  const [anoSerie, setAnoSerie] = useState('6º Ano (Ensino Fundamental II)');
  const [disciplina, setDisciplina] = useState('Língua Portuguesa');
  const [periodo, setPeriodo] = useState('1º Bimestre / Trimestre');
  const [tipoRelatorio, setTipoRelatorio] = useState('Relatório de Desempenho e Acompanhamento Escolar');
  
  // Tópicos de observação do professor
  const [pontosFortes, setPontosFortes] = useState('');
  const [desafiosAprendizagem, setDesafiosAprendizagem] = useState('');
  const [comportamentoSocioemocional, setComportamentoSocioemocional] = useState('');
  const [recomendacoesFamilia, setRecomendacoesFamilia] = useState('');

  const handleNextStep = () => {
    if (activeStep === 1 && !nomeAluno.trim()) {
      alert('Por favor, informe o nome do aluno.');
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleSubmit = (useAi = true) => {
    const formData = {
      isReport: true,
      type: 'report',
      nomeAluno,
      anoSerie,
      disciplina,
      periodo,
      tipoRelatorio,
      pontosFortes,
      desafiosAprendizagem,
      comportamentoSocioemocional,
      recomendacoesFamilia
    };
    onGenerate(formData, useAi);
  };

  return (
    <div className="workspace-split-container animate-fade-in">
      <div className="form-card main-form-card">
        {/* Banner de Título Padrão */}
        <div className="form-card-header">
          <div className="icon-wrapper bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2>Parecer Descritivo do Aluno</h2>
            <p>Gere relatórios pedagógicos individuais, pareceres descritivos e acompanhamento formativo acolhedores e formais</p>
          </div>
        </div>

        {/* Barra de Progresso / Etapas Padrão */}
        <div className="step-progress-bar">
          <button
            type="button"
            className={`step-tab ${activeStep === 1 ? 'active' : ''}`}
            onClick={() => setActiveStep(1)}
          >
            <span className="step-number">1</span>
            <span className="step-label">Identificação do Aluno</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-400 step-arrow" />

          <button
            type="button"
            className={`step-tab ${activeStep === 2 ? 'active' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <span className="step-number">2</span>
            <span className="step-label">Observações & Geração</span>
          </button>
        </div>

        {/* PASSO 1: DADOS DO ALUNO E PERÍODO */}
        {activeStep === 1 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-grid">
              <div className="form-group col-span-12">
                <label className="form-label">
                  <User className="w-4 h-4 text-indigo-500 mr-1.5 inline shrink-0" />
                  <span>Nome Completo do Aluno(a)</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Lucas Gabriel Oliveira"
                  value={nomeAluno}
                  onChange={(e) => setNomeAluno(e.target.value)}
                  required
                />
              </div>

              <div className="form-group col-span-6 mt-3">
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
                <label className="form-label">
                  <BookOpen className="w-4 h-4 text-amber-500 mr-1.5 inline shrink-0" />
                  <span>Componente Curricular / Área</span>
                </label>
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
                <label className="form-label">Período de Avaliação</label>
                <select
                  className="form-select"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                >
                  <option value="1º Bimestre / Trimestre">1º Bimestre / Trimestre</option>
                  <option value="2º Bimestre / Trimestre">2º Bimestre / Trimestre</option>
                  <option value="3º Bimestre / Trimestre">3º Bimestre / Trimestre</option>
                  <option value="4º Bimestre / Trimestre">4º Bimestre / Trimestre</option>
                  <option value="Relatório Final Anual">Relatório Final Anual</option>
                </select>
              </div>

              <div className="form-group col-span-6 mt-3">
                <label className="form-label">Tipo de Relatório Pedagógico</label>
                <select
                  className="form-select"
                  value={tipoRelatorio}
                  onChange={(e) => setTipoRelatorio(e.target.value)}
                >
                  <option value="Relatório de Desempenho e Acompanhamento Escolar">Relatório de Desempenho e Acompanhamento Escolar</option>
                  <option value="Parecer Descritivo Pedagógico para Reunião de Pais">Parecer Descritivo Pedagógico para Reunião de Pais</option>
                  <option value="Relatório de Acompanhamento AEE (Educação Inclusiva)">Relatório de Acompanhamento AEE (Educação Inclusiva)</option>
                  <option value="Relatório Sociocomportamental e de Engajamento">Relatório Sociocomportamental e de Engajamento</option>
                </select>
              </div>
            </div>

            <div className="step-nav-footer mt-6">
              <div></div>
              <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                <span>Avançar para Observações</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: OBSERVAÇÕES E GERAÇÃO */}
        {activeStep === 2 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-group col-span-12">
              <label className="form-label">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5 inline shrink-0" />
                <span>Pontos Fortes e Habilidades Adquiridas</span>
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Ex: Demonstra excelente raciocínio lógico, boa leitura expressiva e colabora com os colegas nas atividades em grupo."
                value={pontosFortes}
                onChange={(e) => setPontosFortes(e.target.value)}
              />
            </div>

            <div className="form-group col-span-12 mt-3">
              <label className="form-label">Aspectos a Desenvolver / Desafios Pedagógicos</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Ex: Apresenta momentos de dispersão na leitura individual e precisa de apoio para organizar o tempo das tarefas."
                value={desafiosAprendizagem}
                onChange={(e) => setDesafiosAprendizagem(e.target.value)}
              />
            </div>

            <div className="form-group col-span-12 mt-3">
              <label className="form-label">Comportamento e Aspectos Socioemocionais</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Ex: Aluno respeitoso, participativo e comunicativo. Demonstra empatia nas dinâmicas coletivas."
                value={comportamentoSocioemocional}
                onChange={(e) => setComportamentoSocioemocional(e.target.value)}
              />
            </div>

            <div className="form-group col-span-12 mt-3">
              <label className="form-label">
                <HeartHandshake className="w-4 h-4 text-rose-500 mr-1.5 inline shrink-0" />
                <span>Recomendações para a Família e Próximo Período</span>
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Ex: Manter rotina de leitura diária de 15 minutos em casa e incentivar o uso da agenda para acompanhamento das tarefas."
                value={recomendacoesFamilia}
                onChange={(e) => setRecomendacoesFamilia(e.target.value)}
              />
            </div>

            <div className="step-nav-footer mt-6">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveStep(1)}>
                Voltar
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sparkle"
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="spinner mr-2"></span>
                    Redigindo Relatório...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
                    <span>Gerar Relatório Pedagógico com IA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
