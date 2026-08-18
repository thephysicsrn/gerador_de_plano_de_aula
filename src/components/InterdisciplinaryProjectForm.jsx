import React, { useState } from 'react';
import { Network, Sparkles, BookOpen, Clock, ChevronRight, CheckCircle2, Award, Layers } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS } from '../data/bnccData';

export default function InterdisciplinaryProjectForm({ onGenerate, isLoading }) {
  const [activeStep, setActiveStep] = useState(1);

  // Campos do Formulário
  const [disciplinaPrincipal, setDisciplinaPrincipal] = useState('Física');
  const [disciplinasSecundarias, setDisciplinasSecundarias] = useState(['Matemática', 'Biologia']);
  const [anoSerie, setAnoSerie] = useState('1ª Série');
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
    <div className="form-page-container animate-fade-in">
      <div className="form-card-podia">
        {/* Cabeçalho do Formulário */}
        <div className="form-header-podia">
          <div className="form-badge-pill bg-emerald-pill">
            <Network className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Gerador de Projetos Integradores IA</span>
          </div>
          <h2 className="form-title-podia">Projeto Interdisciplinar & Integrador</h2>
          <p className="form-subtitle-podia">
            Conecte 2 ou mais componentes curriculares em uma proposta pedagógica rica com cronograma de etapas, produto final e rubrica de avaliação conjunta.
          </p>
        </div>

        {/* Indicador de Passos */}
        <div className="stepper-bar-podia">
          <div className={`step-item-podia ${activeStep >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Disciplinas & Tema</span>
          </div>
          <div className="step-line-podia"></div>
          <div className={`step-item-podia ${activeStep >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Produto Final & Geração</span>
          </div>
        </div>

        {/* PASSO 1: DISCIPLINAS E TEMA */}
        {activeStep === 1 && (
          <div className="step-content-podia animate-fade-in">
            <div className="form-grid-2">
              <div className="form-field-group">
                <label className="form-label-podia">
                  <BookOpen className="w-4 h-4 text-indigo-500 mr-1.5 inline shrink-0" />
                  <span>Disciplina Principal (Líder)</span>
                </label>
                <select
                  className="form-select-podia"
                  value={disciplinaPrincipal}
                  onChange={(e) => setDisciplinaPrincipal(e.target.value)}
                >
                  {DISCIPLINAS.map(d => {
                    const name = typeof d === 'object' ? (d.name || d.label) : d;
                    return <option key={name} value={name}>{name}</option>;
                  })}
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
                  {ANOS_SERIES.map(s => {
                    const label = typeof s === 'object' ? (s.label || s.name) : s;
                    return <option key={label} value={label}>{label}</option>;
                  })}
                </select>
              </div>
            </div>

            {/* Seleção de Disciplinas Integradas */}
            <div className="form-field-group mt-4">
              <label className="form-label-podia">
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

            <div className="form-field-group mt-4">
              <label className="form-label-podia">
                <span>Tema Central ou Pergunta Guiadora do Projeto</span>
              </label>
              <input
                type="text"
                className="form-input-podia"
                placeholder="Ex: Como transformar o lixo orgânico da escola em energia limpa? / A Química dos Alimentos e a Saúde"
                value={temaProjeto}
                onChange={(e) => setTemaProjeto(e.target.value)}
                required
              />
            </div>

            <div className="step-actions-podia mt-6">
              <div></div>
              <button className="btn-podia-black" onClick={handleNextStep}>
                <span>Avançar para Produto Final</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: PRODUTO FINAL E GERAÇÃO */}
        {activeStep === 2 && (
          <div className="step-content-podia animate-fade-in">
            <div className="form-grid-2">
              <div className="form-field-group">
                <label className="form-label-podia">
                  <Clock className="w-4 h-4 text-amber-500 mr-1.5 inline shrink-0" />
                  <span>Duração Estimada do Projeto</span>
                </label>
                <select
                  className="form-select-podia"
                  value={duracaoProjeto}
                  onChange={(e) => setDuracaoProjeto(e.target.value)}
                >
                  <option value="2 Semanas (4 a 8 aulas)">2 Semanas (4 a 8 aulas)</option>
                  <option value="3 Semanas (6 a 12 aulas)">3 Semanas (6 a 12 aulas)</option>
                  <option value="1 Bimestre Letivo (Projeto Integrador)">1 Bimestre Letivo (Projeto Integrador)</option>
                  <option value="1 Semestre (Projeto de Vida / Feira)">1 Semestre (Projeto de Vida / Feira)</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-label-podia">
                  <Award className="w-4 h-4 text-purple-500 mr-1.5 inline shrink-0" />
                  <span>Tipo de Produto Final Esperado</span>
                </label>
                <select
                  className="form-select-podia"
                  value={produtoFinal}
                  onChange={(e) => setProdutoFinal(e.target.value)}
                >
                  <option value="Feira de Ciências & Apresentação de Protótipos">Feira de Ciências & Apresentação de Protótipos</option>
                  <option value="Podcast / Infográfico Digital / E-book Didático">Podcast / Infográfico Digital / E-book Didático</option>
                  <option value="Maquete Física Interativa ou Modelo 3D">Maquete Física Interativa ou Modelo 3D</option>
                  <option value="Revista em Quadrinhos (HQ) ou Jornal Escolar">Revista em Quadrinhos (HQ) ou Jornal Escolar</option>
                  <option value="Vídeo Documentário ou Apresentação de Teatral">Vídeo Documentário ou Apresentação Teatral</option>
                </select>
              </div>
            </div>

            <div className="form-field-group mt-4">
              <label className="form-label-podia">
                <span>Instruções ou Requisitos Adicionais (Opcional)</span>
              </label>
              <textarea
                className="form-textarea-podia"
                rows="3"
                placeholder="Ex: Incluir uma tabela com a divisão de tarefas por papel em cada equipe (Líder, Pesquisador, Designer, Relator)."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            <div className="generate-cta-box-podia mt-6">
              <div className="generate-info">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <span>O DeepSeek criará a proposta integradora conectando os objetivos de {disciplinaPrincipal} com {disciplinasSecundarias.join(', ')}.</span>
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
          </div>
        )}
      </div>
    </div>
  );
}
