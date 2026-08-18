import React, { useState } from 'react';
import { Calendar, Sparkles, BookOpen, Clock, ChevronRight, CheckCircle2, Layers } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS } from '../data/bnccData';

export default function AnnualCoursePlanForm({ onGenerate, isLoading }) {
  const [activeStep, setActiveStep] = useState(1);

  // Campos do Formulário
  const [disciplina, setDisciplina] = useState('Física');
  const [anoSerie, setAnoSerie] = useState('1ª Série');
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
    <div className="form-page-container animate-fade-in">
      <div className="form-card-podia">
        {/* Cabeçalho do Formulário */}
        <div className="form-header-podia">
          <div className="form-badge-pill bg-blue-pill">
            <Calendar className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Planejador de Curso Anual & Bimestral IA</span>
          </div>
          <h2 className="form-title-podia">Plano de Curso Anual & Ementa Bimestral</h2>
          <p className="form-subtitle-podia">
            Mapeie e distribua todas as unidades temáticas, conteúdos e habilidades da BNCC e Matriz SESI ao longo dos 4 bimestres letivos do ano.
          </p>
        </div>

        {/* Indicador de Passos */}
        <div className="stepper-bar-podia">
          <div className={`step-item-podia ${activeStep >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Estrutura do Ano</span>
          </div>
          <div className="step-line-podia"></div>
          <div className={`step-item-podia ${activeStep >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Diretrizes & Geração</span>
          </div>
        </div>

        {/* PASSO 1: ESTRUTURA DO ANO */}
        {activeStep === 1 && (
          <div className="step-content-podia animate-fade-in">
            <div className="form-grid-2">
              <div className="form-field-group">
                <label className="form-label-podia">
                  <BookOpen className="w-4 h-4 text-indigo-500 mr-1.5 inline shrink-0" />
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
                  <Clock className="w-4 h-4 text-amber-500 mr-1.5 inline shrink-0" />
                  <span>Carga Horária Anual Prevista</span>
                </label>
                <select
                  className="form-select-podia"
                  value={cargaHoraria}
                  onChange={(e) => setCargaHoraria(e.target.value)}
                >
                  <option value="40 horas/aula (1 aula semanal)">40 horas/aula (1 aula semanal)</option>
                  <option value="80 horas/aula (2 aulas semanais)">80 horas/aula (2 aulas semanais)</option>
                  <option value="120 horas/aula (3 aulas semanais)">120 horas/aula (3 aulas semanais)</option>
                  <option value="160 horas/aula (4 aulas semanais)">160 horas/aula (4 aulas semanais)</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-label-podia">
                  <Layers className="w-4 h-4 text-purple-500 mr-1.5 inline shrink-0" />
                  <span>Divisão dos Períodos Letivos</span>
                </label>
                <select
                  className="form-select-podia"
                  value={divisaoPeriodo}
                  onChange={(e) => setDivisaoPeriodo(e.target.value)}
                >
                  <option value="4 Bimestres Letivos">4 Bimestres Letivos (Padrão)</option>
                  <option value="3 Trimestres Letivos">3 Trimestres Letivos</option>
                  <option value="2 Semestres Letivos">2 Semestres Letivos</option>
                </select>
              </div>
            </div>

            <div className="step-actions-podia mt-6">
              <div></div>
              <button className="btn-podia-black" onClick={handleNextStep}>
                <span>Avançar para Diretrizes</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: DIRETRIZES E GERAÇÃO */}
        {activeStep === 2 && (
          <div className="step-content-podia animate-fade-in">
            <div className="form-field-group">
              <label className="form-label-podia">
                <span>Foco Pedagogico ou Unidades Especiais (Opcional)</span>
              </label>
              <input
                type="text"
                className="form-input-podia"
                placeholder="Ex: Ênfase em Educação Ambiental e Experimentos Práticos / Foco em Resolução de Problemas do ENEM"
                value={focoPedagogico}
                onChange={(e) => setFocoPedagogico(e.target.value)}
              />
            </div>

            <div className="form-field-group mt-4">
              <label className="form-label-podia">
                <span>Observações para a IA (Opcional)</span>
              </label>
              <textarea
                className="form-textarea-podia"
                rows="3"
                placeholder="Ex: Reservar as últimas 2 semanas do 4º Bimestre para revisão e projeto integrador final."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            <div className="generate-cta-box-podia mt-6">
              <div className="generate-info">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <span>O DeepSeek distribuirá os tópicos curriculares, habilidades da BNCC e avaliações pelos bimestres do ano.</span>
              </div>

              <div className="cta-button-row">
                <button className="btn btn-secondary rounded-full" onClick={() => setActiveStep(1)}>
                  Voltar
                </button>

                <button
                  className="btn-podia-hero-black"
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
          </div>
        )}
      </div>
    </div>
  );
}
