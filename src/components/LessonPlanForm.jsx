import React, { useState, useMemo } from 'react';
import { Sparkles, BookOpen, Clock, Search, Check, Trash2, ChevronRight, Layers, Lightbulb, FileText, CheckCircle2 } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS, TIPOS_METODOLOGIA, BNCC_HABILIDADES, CONTEUDOS_EXEMPLO } from '../data/bnccData';
import { SESI_HABILIDADES } from '../data/sesiData';
import { getCustomCurriculum } from '../utils/storage';

export default function LessonPlanForm({ onGenerate, isLoading, apiKeyConfigured, onOpenApiKeyModal, user }) {
  const [activeStep, setActiveStep] = useState(1);

  const [disciplina, setDisciplina] = useState('MA');
  const [anoSerie, setAnoSerie] = useState('EF06');
  const [tempoAula, setTempoAula] = useState('50 minutos (1 aula)');
  const [conteudoProgramatico, setConteudoProgramatico] = useState('');
  const [tipoMetodologia, setTipoMetodologia] = useState('ativa');
  const [observacoesEspeciais, setObservacoesEspeciais] = useState('');
  
  // Habilidades selecionadas
  const [selectedBNCC, setSelectedBNCC] = useState([]);
  const [bnccSearch, setBnccSearch] = useState('');

  // Carregar habilidades customizadas da escola
  const customSkills = useMemo(() => getCustomCurriculum(), []);

  // Lista combinada (Exibe habilidades do SESI se o professor pertencer à REDE SESI)
  const isSesiUser = user?.redeEnsino === 'REDE_SESI';
  const allHabilidades = useMemo(() => {
    return isSesiUser 
      ? [...customSkills, ...SESI_HABILIDADES, ...BNCC_HABILIDADES]
      : [...customSkills, ...BNCC_HABILIDADES];
  }, [customSkills, isSesiUser]);

  // Filtrar habilidades inteligentemente
  const filteredHabilidades = useMemo(() => {
    const query = bnccSearch.toLowerCase().trim();

    return allHabilidades.filter(hab => {
      // Se houver busca por texto/código, buscar em toda a base ou na disciplina
      if (query) {
        return (
          hab.code.toLowerCase().includes(query) ||
          hab.description.toLowerCase().includes(query)
        );
      }

      // Filtrar por disciplina
      const matchSubject = !disciplina || hab.subject === disciplina;
      return matchSubject;
    }).sort((a, b) => {
      // Priorizar habilidades do ano/série selecionado no topo
      if (a.grade === anoSerie && b.grade !== anoSerie) return -1;
      if (a.grade !== anoSerie && b.grade === anoSerie) return 1;
      return a.code.localeCompare(b.code);
    });
  }, [allHabilidades, disciplina, anoSerie, bnccSearch]);

  const toggleSelectSkill = (skill) => {
    if (selectedBNCC.some(s => s.code === skill.code)) {
      setSelectedBNCC(selectedBNCC.filter(s => s.code !== skill.code));
    } else {
      setSelectedBNCC([...selectedBNCC, skill]);
    }
  };

  const handleSuggestContent = (topic) => {
    setConteudoProgramatico(topic);
  };

  const handleSubmit = (useAi = true) => {
    if (!conteudoProgramatico.trim()) {
      alert('Por favor, informe o Conteúdo Programático da aula.');
      setActiveStep(2);
      return;
    }

    const currentDiscObj = DISCIPLINAS.find(d => d.id === disciplina);
    const currentGradeObj = ANOS_SERIES.find(g => g.id === anoSerie);
    const currentMetodoObj = TIPOS_METODOLOGIA.find(m => m.id === tipoMetodologia);

    onGenerate({
      type: 'PLANO_AULA',
      disciplina: currentDiscObj ? currentDiscObj.name : disciplina,
      anoSerie: currentGradeObj ? currentGradeObj.label : anoSerie,
      tempoAula,
      conteudoProgramatico,
      habilidadesBNCC: selectedBNCC,
      tipoMetodologia: currentMetodoObj ? currentMetodoObj.label : tipoMetodologia,
      observacoesEspeciais
    }, useAi);
  };

  const sugeridos = CONTEUDOS_EXEMPLO[disciplina] || [];
  const selectedSubjectObj = DISCIPLINAS.find(d => d.id === disciplina);

  return (
    <div className="workspace-split-container animate-fade-in">
      {/* Coluna Esquerda: Formulário Estruturado em Etapas */}
      <div className="form-card main-form-card">
        {/* Banner de Título */}
        <div className="form-card-header">
          <div className="icon-wrapper">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2>Gerador de Plano de Aula BNCC</h2>
            <p>Monte diretrizes pedagógicas alinhadas às competências e matriz escolar</p>
          </div>
        </div>

        {/* Barra de Progresso / Etapas */}
        <div className="step-progress-bar">
          <button
            className={`step-tab ${activeStep === 1 ? 'active' : ''} ${disciplina ? 'completed' : ''}`}
            onClick={() => setActiveStep(1)}
          >
            <span className="step-number">1</span>
            <span className="step-label">Identificação</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-400 step-arrow" />

          <button
            className={`step-tab ${activeStep === 2 ? 'active' : ''} ${conteudoProgramatico ? 'completed' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <span className="step-number">2</span>
            <span className="step-label">Conteúdo & BNCC</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-400 step-arrow" />

          <button
            className={`step-tab ${activeStep === 3 ? 'active' : ''}`}
            onClick={() => setActiveStep(3)}
          >
            <span className="step-number">3</span>
            <span className="step-label">Metodologia</span>
          </button>
        </div>

        {/* ETAPA 1: Identificação Básica */}
        {activeStep === 1 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-grid">
              <div className="form-group col-span-6">
                <label className="form-label">Disciplina / Componente Curricular</label>
                <select
                  value={disciplina}
                  onChange={(e) => setDisciplina(e.target.value)}
                  className="form-select"
                >
                  {DISCIPLINAS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group col-span-6">
                <label className="form-label">Série / Ano Escolar</label>
                <select
                  value={anoSerie}
                  onChange={(e) => setAnoSerie(e.target.value)}
                  className="form-select"
                >
                  {ANOS_SERIES.map(a => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group col-span-12">
                <label className="form-label">Carga Horária / Tempo de Aula</label>
                <div className="input-icon-group">
                  <Clock className="w-4 h-4 text-slate-400 input-icon" />
                  <select
                    value={tempoAula}
                    onChange={(e) => setTempoAula(e.target.value)}
                    className="form-select with-icon"
                  >
                    <option value="50 minutos (1 aula)">50 minutos (1 aula regular)</option>
                    <option value="100 minutos (2 aulas seguidas)">100 minutos (2 aulas geminadas)</option>
                    <option value="150 minutos (3 aulas / Oficina)">150 minutos (Oficina / Laboratório)</option>
                    <option value="45 minutos (Período Reduzido)">45 minutos (Período Reduzido)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="step-nav-footer mt-6">
              <div></div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveStep(2)}
              >
                <span>Próximo: Conteúdo & BNCC</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: Conteúdo & Seleção de Habilidades BNCC */}
        {activeStep === 2 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-grid">
              <div className="form-group col-span-12">
                <label className="form-label">Conteúdo Programático da Aula *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Porcentagem e Acréscimos Financeiros, Sintaxe da Oração..."
                  value={conteudoProgramatico}
                  onChange={(e) => setConteudoProgramatico(e.target.value)}
                />
                {sugeridos.length > 0 && (
                  <div className="suggestions-chips mt-2">
                    <span className="text-xs text-slate-500 font-medium mr-1">Sugestões rápidas:</span>
                    {sugeridos.map((topic, i) => (
                      <button
                        key={i}
                        type="button"
                        className="chip"
                        onClick={() => handleSuggestContent(topic)}
                      >
                        + {topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group col-span-12">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label mb-0">Habilidades da BNCC / Matriz da Escola</label>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedBNCC.length} selecionada(s)
                  </span>
                </div>

                {selectedBNCC.length > 0 && (
                  <div className="selected-bncc-list mb-3">
                    {selectedBNCC.map(s => (
                      <div key={s.code} className="bncc-badge-chip">
                        <strong className="mr-1">{s.code}</strong>
                        <span className="text-xs truncate max-w-xs">{s.description}</span>
                        <button
                          type="button"
                          onClick={() => toggleSelectSkill(s)}
                          className="ml-2 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="input-icon-group mb-2">
                  <Search className="w-4 h-4 text-slate-400 input-icon" />
                  <input
                    type="text"
                    placeholder="Buscar por código (ex: EF06MA05) ou palavra-chave..."
                    value={bnccSearch}
                    onChange={(e) => setBnccSearch(e.target.value)}
                    className="form-input with-icon text-sm"
                  />
                </div>

                <div className="bncc-selector-box">
                  {filteredHabilidades.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-400">
                      Nenhuma habilidade encontrada para a disciplina atual.
                    </div>
                  ) : (
                    filteredHabilidades.map(skill => {
                      const isSelected = selectedBNCC.some(s => s.code === skill.code);
                      return (
                        <div
                          key={skill.code}
                          className={`bncc-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleSelectSkill(skill)}
                        >
                          <div className="checkbox-indicator">
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <div>
                            <span className="bncc-code">{skill.code}</span>
                            {skill.isSesi && <span className="custom-tag bg-amber-500 text-white font-bold ml-1.5 px-1.5 py-0.5 rounded text-[10px]">REDE SESI</span>}
                            {skill.isCustom && <span className="custom-tag ml-1.5">Escola</span>}
                            <p className="bncc-desc">{skill.description}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="step-nav-footer mt-6">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveStep(1)}
              >
                Voltar
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveStep(3)}
              >
                <span>Próximo: Metodologia</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: Metodologia e Finalização */}
        {activeStep === 3 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-grid">
              <div className="form-group col-span-12">
                <label className="form-label">Abordagem Metodológica Principal</label>
                <select
                  value={tipoMetodologia}
                  onChange={(e) => setTipoMetodologia(e.target.value)}
                  className="form-select"
                >
                  {TIPOS_METODOLOGIA.map(m => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group col-span-12">
                <label className="form-label">Observações da Turma / Contexto (Opcional)</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  placeholder="Ex: Alunos com grande interesse prático; necessidade de atividades visuais..."
                  value={observacoesEspeciais}
                  onChange={(e) => setObservacoesEspeciais(e.target.value)}
                />
              </div>
            </div>

            {/* Ações de Geração */}
            <div className="form-actions-bar mt-6">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Modelo Pedagógico Rápido
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="spinner mr-2"></span>
                    DeepSeek Gerando Plano...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>Gerar Plano com DeepSeek IA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Coluna Direita: Resumo do Pré-Plano (Side Draft Card) */}
      <div className="side-summary-card">
        <div className="side-summary-header">
          <FileText className="w-4 h-4 text-indigo-500 mr-2" />
          <h3 className="text-sm font-bold">Resumo da Estrutura</h3>
        </div>

        <div className="side-summary-body">
          <div className="summary-item">
            <span className="summary-label">Componente:</span>
            <span className="summary-val">{selectedSubjectObj ? selectedSubjectObj.name : disciplina}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Série:</span>
            <span className="summary-val">{ANOS_SERIES.find(a => a.id === anoSerie)?.label || anoSerie}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Tempo:</span>
            <span className="summary-val">{tempoAula}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Conteúdo:</span>
            <span className="summary-val font-semibold">{conteudoProgramatico || 'Não definido'}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Habilidades:</span>
            <span className="summary-val">{selectedBNCC.length} selecionada(s)</span>
          </div>

          <div className="side-tips-box mt-4">
            <Lightbulb className="w-4 h-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              O DeepSeek utilizará os dados acima para estruturar objetivos específicos na Taxonomia de Bloom e dividir a aula em momentos metodológicos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
