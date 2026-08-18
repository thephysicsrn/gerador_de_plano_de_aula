import React, { useState } from 'react';
import { UserCheck, Sparkles, User, BookOpen, CheckCircle2, ChevronRight, HeartHandshake } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS } from '../data/bnccData';

export default function PedagogicalReportForm({ onGenerate, isLoading }) {
  const [activeStep, setActiveStep] = useState(1);

  // Campos do Formulário
  const [nomeAluno, setNomeAluno] = useState('');
  const [anoSerie, setAnoSerie] = useState('6º Ano');
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
    <div className="form-page-container animate-fade-in">
      <div className="form-card-podia">
        {/* Cabeçalho do Formulário */}
        <div className="form-header-podia">
          <div className="form-badge-pill bg-teal-pill">
            <UserCheck className="w-4 h-4 mr-1.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Gerador de Relatório Pedagógico & Parecer</span>
          </div>
          <h2 className="form-title-podia">Parecer Descritivo do Aluno</h2>
          <p className="form-subtitle-podia">
            Gere relatórios pedagógicos individuais, pareceres descritivos e pareceres de acompanhamento formativo acolhedores e formais para reuniões de pais.
          </p>
        </div>

        {/* Indicador de Passos */}
        <div className="stepper-bar-podia">
          <div className={`step-item-podia ${activeStep >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Identificação do Aluno</span>
          </div>
          <div className="step-line-podia"></div>
          <div className={`step-item-podia ${activeStep >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Observações & Geração</span>
          </div>
        </div>

        {/* PASSO 1: DADOS DO ALUNO E PERÍODO */}
        {activeStep === 1 && (
          <div className="step-content-podia animate-fade-in">
            <div className="form-field-group">
              <label className="form-label-podia">
                <User className="w-4 h-4 text-indigo-500 mr-1.5 inline shrink-0" />
                <span>Nome Completo do Aluno(a)</span>
              </label>
              <input
                type="text"
                className="form-input-podia"
                placeholder="Ex: Lucas Gabriel Oliveira"
                value={nomeAluno}
                onChange={(e) => setNomeAluno(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2 mt-4">
              <div className="form-field-group">
                <label className="form-label-podia">
                  <span>Série / Ano Escolar</span>
                </label>
                <select
                  className="form-select-podia"
                  value={anoSerie}
                  onChange={(e) => setAnoSerie(e.target.value)}
                >
                  {ANOS_SERIES.map(s => {
                    const label = typeof s === 'object' ? (s.label || s.name) : s;
                    return <option key={label} value={label}>{label}</option>;
                  })}
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-label-podia">
                  <BookOpen className="w-4 h-4 text-amber-500 mr-1.5 inline shrink-0" />
                  <span>Componente Curricular / Área</span>
                </label>
                <select
                  className="form-select-podia"
                  value={disciplina}
                  onChange={(e) => setDisciplina(e.target.value)}
                >
                  {DISCIPLINAS.map(d => {
                    const name = typeof d === 'object' ? (d.name || d.label) : d;
                    return <option key={name} value={name}>{name}</option>;
                  })}
                </select>
              </div>
            </div>

            <div className="form-grid-2 mt-4">
              <div className="form-field-group">
                <label className="form-label-podia">
                  <span>Período de Avaliação</span>
                </label>
                <select
                  className="form-select-podia"
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

              <div className="form-field-group">
                <label className="form-label-podia">
                  <span>Tipo de Relatório Pedagógico</span>
                </label>
                <select
                  className="form-select-podia"
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

            <div className="step-actions-podia mt-6">
              <div></div>
              <button className="btn-podia-black" onClick={handleNextStep}>
                <span>Avançar para Observações</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: OBSERVAÇÕES E GERAÇÃO */}
        {activeStep === 2 && (
          <div className="step-content-podia animate-fade-in">
            <div className="form-field-group">
              <label className="form-label-podia">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5 inline shrink-0" />
                <span>Pontos Fortes e Habilidades Adquiridas</span>
              </label>
              <textarea
                className="form-textarea-podia"
                rows="2"
                placeholder="Ex: Demonstra excelente raciocínio lógico, boa leitura expressiva e colabora com os colegas nas atividades em grupo."
                value={pontosFortes}
                onChange={(e) => setPontosFortes(e.target.value)}
              />
            </div>

            <div className="form-field-group mt-4">
              <label className="form-label-podia">
                <span>Aspectos a Desenvolver / Desafios Pedagógicos</span>
              </label>
              <textarea
                className="form-textarea-podia"
                rows="2"
                placeholder="Ex: Apresenta momentos de dispersão na leitura individual e precisa de apoio para organizar o tempo das tarefas."
                value={desafiosAprendizagem}
                onChange={(e) => setDesafiosAprendizagem(e.target.value)}
              />
            </div>

            <div className="form-field-group mt-4">
              <label className="form-label-podia">
                <span>Comportamento e Aspectos Socioemocionais</span>
              </label>
              <textarea
                className="form-textarea-podia"
                rows="2"
                placeholder="Ex: Aluno respeitoso, participativo e comunicativo. Demonstra empatia nas dinâmicas coletivas."
                value={comportamentoSocioemocional}
                onChange={(e) => setComportamentoSocioemocional(e.target.value)}
              />
            </div>

            <div className="form-field-group mt-4">
              <label className="form-label-podia">
                <HeartHandshake className="w-4 h-4 text-rose-500 mr-1.5 inline shrink-0" />
                <span>Recomendações para a Família e Próximo Período</span>
              </label>
              <textarea
                className="form-textarea-podia"
                rows="2"
                placeholder="Ex: Manter rotina de leitura diária de 15 minutos em casa e incentivar o uso da agenda para acompanhamento das tarefas."
                value={recomendacoesFamilia}
                onChange={(e) => setRecomendacoesFamilia(e.target.value)}
              />
            </div>

            <div className="generate-cta-box-podia mt-6">
              <div className="generate-info">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <span> O DeepSeek transformará essas observações em um parecer pedagógico fluido, acolhedor e altamente profissional.</span>
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
          </div>
        )}
      </div>
    </div>
  );
}
