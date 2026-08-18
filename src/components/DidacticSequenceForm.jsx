import React, { useState, useMemo } from 'react';
import { Layers, Sparkles, BookOpen, Clock, Search, Check, Trash2, ChevronRight, Lightbulb } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS, TIPOS_METODOLOGIA, BNCC_HABILIDADES } from '../data/bnccData';
import { SESI_HABILIDADES } from '../data/sesiData';

export default function DidacticSequenceForm({ onGenerate, isLoading, user }) {
  const [activeStep, setActiveStep] = useState(1);
  const isSesiUser = user?.redeEnsino === 'REDE_SESI';

  // Campos do Formulário
  const [disciplina, setDisciplina] = useState('Ciências');
  const [anoSerie, setAnoSerie] = useState('6º Ano (Ensino Fundamental II)');
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
    <div className="workspace-split-container animate-fade-in">
      <div className="form-card main-form-card">
        {/* Banner de Título Padrão */}
        <div className="form-card-header">
          <div className="icon-wrapper bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2>Sequência Didática Encadeada</h2>
            <p>Crie um plano articulado de 4 a 8 aulas integradas para cobrir uma unidade temática com objetivos progressivos</p>
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
            <span className="step-label">Unidade Temática</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-400 step-arrow" />

          <button
            type="button"
            className={`step-tab ${activeStep === 2 ? 'active' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <span className="step-number">2</span>
            <span className="step-label">Habilidades ({selectedSkills.length})</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-400 step-arrow" />

          <button
            type="button"
            className={`step-tab ${activeStep === 3 ? 'active' : ''}`}
            onClick={() => setActiveStep(3)}
          >
            <span className="step-number">3</span>
            <span className="step-label">Metodologia & Geração</span>
          </button>
        </div>

        {/* PASSO 1: UNIDADE TEMÁTICA E DURAÇÃO */}
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

              <div className="form-group col-span-12 mt-3">
                <label className="form-label">
                  <Clock className="w-4 h-4 text-amber-500 mr-1.5 inline shrink-0" />
                  <span>Duração da Sequência Didática</span>
                </label>
                <select
                  className="form-select"
                  value={numeroAulas}
                  onChange={(e) => setNumeroAulas(e.target.value)}
                >
                  <option value="4 Aulas (2 Semanas)">4 Aulas (2 Semanas)</option>
                  <option value="6 Aulas (3 Semanas)">6 Aulas (3 Semanas)</option>
                  <option value="8 Aulas (1 Mês / Projeto)">8 Aulas (1 Mês / Projeto)</option>
                </select>
              </div>

              <div className="form-group col-span-12 mt-3">
                <label className="form-label">
                  <Lightbulb className="w-4 h-4 text-amber-500 mr-1.5 inline shrink-0" />
                  <span>Unidade Temática ou Eixo de Aprendizagem</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Mudanças Climáticas e Sustentabilidade / Funções Químicas no Cotidiano"
                  value={unidadeTematica}
                  onChange={(e) => setUnidadeTematica(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="step-nav-footer mt-6">
              <div></div>
              <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                <span>Avançar para Habilidades</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: SELEÇÃO DE HABILIDADES */}
        {activeStep === 2 && (
          <div className="form-step-content animate-fade-in">
            <div className="skills-selection-header mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Selecione até 6 Habilidades para a Sequência</h3>
                <p className="text-xs text-slate-500">As habilidades escolhidas guiarão a progressão das aulas de 1 a {numeroAulas.split(' ')[0]}.</p>
              </div>
              <div className="search-box-podia mt-2">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Pesquisar código ou palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input with-icon"
                />
              </div>
            </div>

            {/* Habilidades Selecionadas (Tags) */}
            {selectedSkills.length > 0 && (
              <div className="selected-skills-pill-box mb-4">
                <span className="selected-count-badge">{selectedSkills.length} Selecionadas:</span>
                {selectedSkills.map(s => (
                  <span key={s.code} className="selected-skill-pill">
                    <strong>{s.code}</strong>
                    <button type="button" onClick={() => toggleSkill(s)} className="remove-pill-btn ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Lista de Habilidades */}
            <div className="skills-list-scroll max-h-80 overflow-y-auto pr-1">
              {availableSkills.length === 0 ? (
                <div className="empty-skills-notice p-4 text-center text-sm text-slate-500">
                  Nenhuma habilidade encontrada para <strong>{disciplina}</strong> - <strong>{anoSerie}</strong>. Digite um termo de busca diferente.
                </div>
              ) : (
                availableSkills.map(skill => {
                  const isSelected = selectedSkills.some(s => s.code === skill.code);
                  return (
                    <div
                      key={skill.code}
                      className={`skill-select-card p-3 mb-2 border rounded-xl flex items-start cursor-pointer transition-all ${isSelected ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20' : 'border-slate-200 dark:border-slate-800'}`}
                      onClick={() => toggleSkill(skill)}
                    >
                      <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-slate-300'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 block mb-0.5">{skill.code}</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{skill.description}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="step-nav-footer mt-6">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveStep(1)}>
                Voltar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                <span>Avançar para Metodologia</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 3: METODOLOGIA E GERAÇÃO */}
        {activeStep === 3 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-group col-span-12">
              <label className="form-label">Metodologia Ativa Principal</label>
              <select
                className="form-select"
                value={tipoMetodologia}
                onChange={(e) => setTipoMetodologia(e.target.value)}
              >
                {TIPOS_METODOLOGIA.map(m => {
                  const label = typeof m === 'object' ? (m.label || m.name) : m;
                  return <option key={label} value={label}>{label}</option>;
                })}
              </select>
            </div>

            <div className="form-group col-span-12 mt-4">
              <label className="form-label">Instruções ou Observações Adicionais (Opcional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Ex: Incluir um experimento prático na Aula 3 e apresentação de projeto em equipe na Aula 4."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            <div className="step-nav-footer mt-6">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveStep(2)}>
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
        )}
      </div>
    </div>
  );
}
