import React, { useState, useMemo } from 'react';
import { Layers, Sparkles, BookOpen, Clock, Search, Check, Trash2, ChevronRight, Lightbulb } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS, TIPOS_METODOLOGIA, BNCC_HABILIDADES } from '../data/bnccData';
import { SESI_HABILIDADES } from '../data/sesiData';

export default function DidacticSequenceForm({ onGenerate, isLoading, user }) {
  const [activeStep, setActiveStep] = useState(1);
  const isSesiUser = user?.redeEnsino === 'REDE_SESI';

  // Campos do Formulário
  const [disciplina, setDisciplina] = useState('Ciências');
  const [anoSerie, setAnoSerie] = useState('6º Ano');
  const [numeroAulas, setNumeroAulas] = useState('4 Aulas (2 Semanas)');
  const [unidadeTematica, setUnidadeTematica] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [tipoMetodologia, setTipoMetodologia] = useState('Aprendizagem Baseada em Projetos (PBL)');
  const [observacoes, setObservacoes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Habilidades filtradas por disciplina e ano/série
  const availableSkills = useMemo(() => {
    let sourceSkills = BNCC_HABILIDADES;
    if (isSesiUser) {
      sourceSkills = [...SESI_HABILIDADES, ...BNCC_HABILIDADES];
    }

    return sourceSkills.filter(h => {
      const matchDisc = !disciplina || (h.subject && h.subject.toLowerCase() === disciplina.toLowerCase());
      const matchGrade = !anoSerie || (h.grade && h.grade.toLowerCase() === anoSerie.toLowerCase());
      const matchQuery = !searchTerm || 
        (h.code && h.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (h.description && h.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchDisc && matchGrade && matchQuery;
    });
  }, [disciplina, anoSerie, searchTerm, isSesiUser]);

  const toggleSkill = (skill) => {
    if (selectedSkills.some(s => s.code === skill.code)) {
      setSelectedSkills(selectedSkills.filter(s => s.code !== skill.code));
    } else {
      if (selectedSkills.length < 6) {
        setSelectedSkills([...selectedSkills, skill]);
      } else {
        alert('Você pode selecionar no máximo 6 habilidades para uma sequência didática.');
      }
    }
  };

  const handleNextStep = () => {
    if (activeStep === 1 && !unidadeTematica.trim()) {
      alert('Por favor, informe a Unidade Temática ou Conteúdo Central.');
      return;
    }
    if (activeStep === 2 && selectedSkills.length === 0) {
      alert('Selecione pelo menos uma habilidade para orientar a sequência didática.');
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleSubmit = (useAi = true) => {
    const formData = {
      isSequence: true,
      type: 'sequence',
      disciplina,
      anoSerie,
      numeroAulas,
      unidadeTematica,
      habilidadesBNCC: selectedSkills,
      tipoMetodologia,
      observacoes
    };
    onGenerate(formData, useAi);
  };

  return (
    <div className="form-page-container animate-fade-in">
      <div className="form-card-podia">
        {/* Cabeçalho do Formulário */}
        <div className="form-header-podia">
          <div className="form-badge-pill bg-purple-pill">
            <Layers className="w-4 h-4 mr-1.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Gerador de Sequência Didática IA</span>
          </div>
          <h2 className="form-title-podia">Sequência Didática Encadeada</h2>
          <p className="form-subtitle-podia">
            Crie um plano articulado de 4 a 8 aulas integradas para cobrir uma unidade temática inteira com objetivos progressivos.
          </p>
        </div>

        {/* Indicador de Passos */}
        <div className="stepper-bar-podia">
          <div className={`step-item-podia ${activeStep >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Unidade Temática</span>
          </div>
          <div className="step-line-podia"></div>
          <div className={`step-item-podia ${activeStep >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Habilidades Integradas</span>
          </div>
          <div className="step-line-podia"></div>
          <div className={`step-item-podia ${activeStep >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span className="step-label">Metodologia & Geração</span>
          </div>
        </div>

        {/* PASSO 1: UNIDADE TEMÁTICA E DURAÇÃO */}
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

            <div className="form-field-group mt-4">
              <label className="form-label-podia">
                <Clock className="w-4 h-4 text-amber-500 mr-1.5 inline shrink-0" />
                <span>Duração da Sequência Didática</span>
              </label>
              <select
                className="form-select-podia"
                value={numeroAulas}
                onChange={(e) => setNumeroAulas(e.target.value)}
              >
                <option value="4 Aulas (2 Semanas)">4 Aulas (2 Semanas)</option>
                <option value="6 Aulas (3 Semanas)">6 Aulas (3 Semanas)</option>
                <option value="8 Aulas (1 Mês / Projeto)">8 Aulas (1 Mês / Projeto)</option>
              </select>
            </div>

            <div className="form-field-group mt-4">
              <label className="form-label-podia">
                <Lightbulb className="w-4 h-4 text-amber-500 mr-1.5 inline shrink-0" />
                <span>Unidade Temática ou Eixo de Aprendizagem</span>
              </label>
              <input
                type="text"
                className="form-input-podia"
                placeholder="Ex: Mudanças Climáticas e Sustentabilidade / Funções Químicas no Cotidiano"
                value={unidadeTematica}
                onChange={(e) => setUnidadeTematica(e.target.value)}
                required
              />
            </div>

            <div className="step-actions-podia mt-6">
              <div></div>
              <button className="btn-podia-black" onClick={handleNextStep}>
                <span>Avançar para Habilidades</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: SELEÇÃO DE HABILIDADES */}
        {activeStep === 2 && (
          <div className="step-content-podia animate-fade-in">
            <div className="skills-selection-header">
              <div>
                <h3 className="section-sub-title">Selecione até 6 Habilidades para a Sequência</h3>
                <p className="section-sub-desc">As habilidades escolhidas guiarão a progressão das aulas de 1 a {numeroAulas.split(' ')[0]}.</p>
              </div>
              <div className="search-box-podia">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Pesquisar código ou palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Habilidades Selecionadas (Tags) */}
            {selectedSkills.length > 0 && (
              <div className="selected-skills-pill-box">
                <span className="selected-count-badge">{selectedSkills.length} Selecionadas:</span>
                {selectedSkills.map(s => (
                  <span key={s.code} className="selected-skill-pill">
                    <strong>{s.code}</strong>
                    <button onClick={() => toggleSkill(s)} className="remove-pill-btn">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Lista de Habilidades */}
            <div className="skills-list-scroll">
              {availableSkills.length === 0 ? (
                <div className="empty-skills-notice">
                  Nenhuma habilidade encontrada para <strong>{disciplina}</strong> - <strong>{anoSerie}</strong>. Digite um termo de busca diferente.
                </div>
              ) : (
                availableSkills.map(skill => {
                  const isSelected = selectedSkills.some(s => s.code === skill.code);
                  return (
                    <div
                      key={skill.code}
                      className={`skill-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSkill(skill)}
                    >
                      <div className="skill-card-checkbox">
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="skill-card-body">
                        <span className="skill-code-tag">{skill.code}</span>
                        <p className="skill-desc-text">{skill.description}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="step-actions-podia mt-6">
              <button className="btn btn-secondary rounded-full" onClick={() => setActiveStep(1)}>
                Voltar
              </button>
              <button className="btn-podia-black" onClick={handleNextStep}>
                <span>Avançar para Metodologia</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 3: METODOLOGIA E GERAÇÃO */}
        {activeStep === 3 && (
          <div className="step-content-podia animate-fade-in">
            <div className="form-field-group">
              <label className="form-label-podia">
                <span>Metodologia Ativa Principal</span>
              </label>
              <select
                className="form-select-podia"
                value={tipoMetodologia}
                onChange={(e) => setTipoMetodologia(e.target.value)}
              >
                {TIPOS_METODOLOGIA.map(m => {
                  const label = typeof m === 'object' ? (m.label || m.name) : m;
                  return <option key={label} value={label}>{label}</option>;
                })}
              </select>
            </div>

            <div className="form-field-group mt-4">
              <label className="form-label-podia">
                <span>Instruções ou Observações Adicionais (Opcional)</span>
              </label>
              <textarea
                className="form-textarea-podia"
                rows="3"
                placeholder="Ex: Incluir um experimento prático na Aula 3 e apresentação de projeto em equipe na Aula 4."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            <div className="generate-cta-box-podia mt-6">
              <div className="generate-info">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <span>O DeepSeek gerará o plano completo estruturado aula a aula com objetivos e avaliações.</span>
              </div>

              <div className="cta-button-row">
                <button className="btn btn-secondary rounded-full" onClick={() => setActiveStep(2)}>
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
                      Elaborando Sequência...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
                      <span>Gerar Sequência Didática com IA</span>
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
