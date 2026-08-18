import React, { useState } from 'react';
import { Network, Sparkles, BookOpen, Clock, ChevronRight, CheckCircle2, Award } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS } from '../data/bnccData';

export default function InterdisciplinaryProjectForm({ onGenerate, isLoading }) {
  const [activeStep, setActiveStep] = useState(1);

  // Campos do Formulário
  const [disciplinaPrincipal, setDisciplinaPrincipal] = useState('Física');
  const [disciplinasSecundarias, setDisciplinasSecundarias] = useState(['Matemática', 'Biologia']);
  const [anoSerie, setAnoSerie] = useState('1º Ano (Ensino Médio)');
  const [temaProjeto, setTemaProjeto] = useState('');
  const [duracaoProjeto, setDuracaoProjeto] = useState('3 Semanas (6 a 12 aulas)');
  const [produtoFinal, setProdutoFinal] = useState('Feira de Ciências & Apresentação de Protótipos');
  const [observacoes, setObservacoes] = useState('');

  const toggleSecundaria = (disc) => {
    if (disciplinasSecundarias.includes(disc)) {
      setDisciplinasSecundarias(disciplinasSecundarias.filter(d => d !== disc));
    } else {
      if (disciplinasSecundarias.length < 3) {
        setDisciplinasSecundarias([...disciplinasSecundarias, disc]);
      } else {
        alert('Você pode selecionar no máximo 3 disciplinas integradas.');
      }
    }
  };

  const handleNextStep = () => {
    if (activeStep === 1 && !temaProjeto.trim()) {
      alert('Por favor, informe o Tema Central ou Pergunta Guiadora do Projeto.');
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleSubmit = (useAi = true) => {
    const formData = {
      isInterdisciplinaryProject: true,
      type: 'interdisciplinaryProject',
      disciplinaPrincipal,
      disciplinasSecundarias,
      anoSerie,
      temaProjeto,
      duracaoProjeto,
      produtoFinal,
      observacoes
    };
    onGenerate(formData, useAi);
  };

  return (
    <div className="workspace-split-container animate-fade-in">
      <div className="form-card main-form-card">
        {/* Banner de Título Padrão */}
        <div className="form-card-header">
          <div className="icon-wrapper bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2>Projeto Interdisciplinar & Integrador</h2>
            <p>Conecte 2 ou mais componentes curriculares em uma proposta com cronograma maker, produto final e rubrica de avaliação</p>
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
            <span className="step-label">Disciplinas & Tema</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-400 step-arrow" />

          <button
            type="button"
            className={`step-tab ${activeStep === 2 ? 'active' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <span className="step-number">2</span>
            <span className="step-label">Produto Final & Geração</span>
          </button>
        </div>

        {/* PASSO 1: DISCIPLINAS E TEMA */}
        {activeStep === 1 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-grid">
              <div className="form-group col-span-6">
                <label className="form-label">
                  <BookOpen className="w-4 h-4 text-indigo-500 mr-1.5 inline shrink-0" />
                  <span>Disciplina Principal (Líder)</span>
                </label>
                <select
                  className="form-select"
                  value={disciplinaPrincipal}
                  onChange={(e) => setDisciplinaPrincipal(e.target.value)}
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

              {/* Seleção de Disciplinas Integradas */}
              <div className="form-group col-span-12 mt-3">
                <label className="form-label">
                  <Network className="w-4 h-4 text-emerald-500 mr-1.5 inline shrink-0" />
                  <span>Selecione até 3 Disciplinas Integradas (Parceiras)</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {DISCIPLINAS.map(dObj => typeof dObj === 'object' ? (dObj.name || dObj.label) : dObj)
                    .filter(name => name !== disciplinaPrincipal)
                    .map(name => {
                      const isSelected = disciplinasSecundarias.includes(name);
                      return (
                        <button
                          key={name}
                          type="button"
                          className={`btn-tag-select ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleSecundaria(name)}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />}
                          <span>{name}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              <div className="form-group col-span-12 mt-3">
                <label className="form-label">Tema Central ou Pergunta Guiadora do Projeto</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Como transformar o lixo orgânico da escola em energia limpa? / A Química dos Alimentos e a Saúde"
                  value={temaProjeto}
                  onChange={(e) => setTemaProjeto(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="step-nav-footer mt-6">
              <div></div>
              <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                <span>Avançar para Produto Final</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: PRODUTO FINAL E GERAÇÃO */}
        {activeStep === 2 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-grid">
              <div className="form-group col-span-6">
                <label className="form-label">
                  <Clock className="w-4 h-4 text-amber-500 mr-1.5 inline shrink-0" />
                  <span>Duração Estimada do Projeto</span>
                </label>
                <select
                  className="form-select"
                  value={duracaoProjeto}
                  onChange={(e) => setDuracaoProjeto(e.target.value)}
                >
                  <option value="2 Semanas (4 a 8 aulas)">2 Semanas (4 a 8 aulas)</option>
                  <option value="3 Semanas (6 a 12 aulas)">3 Semanas (6 a 12 aulas)</option>
                  <option value="1 Bimestre Letivo (Projeto Integrador)">1 Bimestre Letivo (Projeto Integrador)</option>
                  <option value="1 Semestre (Projeto de Vida / Feira)">1 Semestre (Projeto de Vida / Feira)</option>
                </select>
              </div>

              <div className="form-group col-span-6">
                <label className="form-label">
                  <Award className="w-4 h-4 text-purple-500 mr-1.5 inline shrink-0" />
                  <span>Tipo de Produto Final Esperado</span>
                </label>
                <select
                  className="form-select"
                  value={produtoFinal}
                  onChange={(e) => setProdutoFinal(e.target.value)}
                >
                  <option value="Feira de Ciências & Apresentação de Protótipos">Feira de Ciências & Apresentação de Protótipos</option>
                  <option value="Podcast / Infográfico Digital / E-book Didático">Podcast / Infográfico Digital / E-book Didático</option>
                  <option value="Maquete Física Interativa ou Modelo 3D">Maquete Física Interativa ou Modelo 3D</option>
                  <option value="Revista em Quadrinhos (HQ) ou Jornal Escolar">Revista em Quadrinhos (HQ) ou Jornal Escolar</option>
                  <option value="Vídeo Documentário ou Apresentação Teatral">Vídeo Documentário ou Apresentação Teatral</option>
                </select>
              </div>

              <div className="form-group col-span-12 mt-3">
                <label className="form-label">Instruções ou Requisitos Adicionais (Opcional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Ex: Incluir uma tabela com a divisão de tarefas por papel em cada equipe (Líder, Pesquisador, Designer, Relator)."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>
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
                    Estruturando Projeto...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
                    <span>Gerar Projeto Interdisciplinar com IA</span>
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
