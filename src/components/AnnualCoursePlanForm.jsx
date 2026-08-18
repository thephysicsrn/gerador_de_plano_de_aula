import React, { useState } from 'react';
import { Calendar, Sparkles, BookOpen, Clock, ChevronRight, Layers } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS } from '../data/bnccData';

export default function AnnualCoursePlanForm({ onGenerate, isLoading }) {
  const [activeStep, setActiveStep] = useState(1);

  // Campos do Formulário
  const [disciplina, setDisciplina] = useState('Física');
  const [anoSerie, setAnoSerie] = useState('1º Ano (Ensino Médio)');
  const [cargaHoraria, setCargaHoraria] = useState('80 horas/aula (2 aulas semanais)');
  const [divisaoPeriodo, setDivisaoPeriodo] = useState('4 Bimestres Letivos');
  const [focoPedagogico, setFocoPedagogico] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleNextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleSubmit = (useAi = true) => {
    const formData = {
      isAnnualPlan: true,
      type: 'annualPlan',
      disciplina,
      anoSerie,
      cargaHoraria,
      divisaoPeriodo,
      focoPedagogico,
      observacoes
    };
    onGenerate(formData, useAi);
  };

  return (
    <div className="workspace-split-container animate-fade-in">
      <div className="form-card main-form-card">
        {/* Banner de Título Padrão */}
        <div className="form-card-header">
          <div className="icon-wrapper bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2>Plano de Curso Anual & Ementa Bimestral</h2>
            <p>Mapeie e distribua as unidades temáticas, conteúdos e habilidades da BNCC e SESI nos 4 bimestres do ano</p>
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
            <span className="step-label">Estrutura do Ano</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-400 step-arrow" />

          <button
            type="button"
            className={`step-tab ${activeStep === 2 ? 'active' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <span className="step-number">2</span>
            <span className="step-label">Diretrizes & Geração</span>
          </button>
        </div>

        {/* PASSO 1: ESTRUTURA DO ANO */}
        {activeStep === 1 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-grid">
              <div className="form-group col-span-6">
                <label className="form-label">
                  <BookOpen className="w-4 h-4 text-indigo-500 mr-1.5 inline shrink-0" />
                  <span>Componente Curricular / Disciplina</span>
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

              <div className="form-group col-span-6 mt-2">
                <label className="form-label">
                  <Clock className="w-4 h-4 text-amber-500 mr-1.5 inline shrink-0" />
                  <span>Carga Horária Anual Prevista</span>
                </label>
                <select
                  className="form-select"
                  value={cargaHoraria}
                  onChange={(e) => setCargaHoraria(e.target.value)}
                >
                  <option value="40 horas/aula (1 aula semanal)">40 horas/aula (1 aula semanal)</option>
                  <option value="80 horas/aula (2 aulas semanais)">80 horas/aula (2 aulas semanais)</option>
                  <option value="120 horas/aula (3 aulas semanais)">120 horas/aula (3 aulas semanais)</option>
                  <option value="160 horas/aula (4 aulas semanais)">160 horas/aula (4 aulas semanais)</option>
                </select>
              </div>

              <div className="form-group col-span-6 mt-2">
                <label className="form-label">
                  <Layers className="w-4 h-4 text-purple-500 mr-1.5 inline shrink-0" />
                  <span>Divisão dos Períodos Letivos</span>
                </label>
                <select
                  className="form-select"
                  value={divisaoPeriodo}
                  onChange={(e) => setDivisaoPeriodo(e.target.value)}
                >
                  <option value="4 Bimestres Letivos">4 Bimestres Letivos (Padrão)</option>
                  <option value="3 Trimestres Letivos">3 Trimestres Letivos</option>
                  <option value="2 Semestres Letivos">2 Semestres Letivos</option>
                </select>
              </div>
            </div>

            <div className="step-nav-footer mt-6">
              <div></div>
              <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                <span>Avançar para Diretrizes</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: DIRETRIZES E GERAÇÃO */}
        {activeStep === 2 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-group col-span-12">
              <label className="form-label">Foco Pedagógico ou Unidades Especiais (Opcional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Ênfase em Educação Ambiental e Experimentos Práticos / Foco em Resolução de Problemas do ENEM"
                value={focoPedagogico}
                onChange={(e) => setFocoPedagogico(e.target.value)}
              />
            </div>

            <div className="form-group col-span-12 mt-4">
              <label className="form-label">Observações para a IA (Opcional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Ex: Reservar as últimas 2 semanas do 4º Bimestre para revisão e projeto integrador final."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
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
                    Gerando Plano Anual...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
                    <span>Gerar Plano de Curso Anual com IA</span>
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
