import React, { useState, useMemo } from 'react';
import { HeartHandshake, Sparkles, User, Search, Check, Trash2, Accessibility, ChevronRight, FileText, Lightbulb } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS, NECESSIDADES_PEI, BNCC_HABILIDADES } from '../data/bnccData';
import { SESI_HABILIDADES } from '../data/sesiData';

export default function PeiForm({ onGenerate, isLoading, apiKeyConfigured, onOpenApiKeyModal, user }) {
  const [activeStep, setActiveStep] = useState(1);

  const [nomeAluno, setNomeAluno] = useState('');
  const [anoSerie, setAnoSerie] = useState('EF06');
  const [disciplina, setDisciplina] = useState('LP');
  const [necessidadeEspecial, setNecessidadeEspecial] = useState('Transtorno do Espectro Autista (TEA)');
  const [diagnosticoHistorico, setDiagnosticoHistorico] = useState('');
  const [habilidadesAtuais, setHabilidadesAtuais] = useState('');
  const [recursosAcessibilidade, setRecursosAcessibilidade] = useState('');

  // Habilidades BNCC/SESI a adaptar
  const [selectedBNCC, setSelectedBNCC] = useState([]);
  const [bnccSearch, setBnccSearch] = useState('');

  const isSesiUser = user?.redeEnsino === 'REDE_SESI';
  const availableSkills = useMemo(() => {
    return isSesiUser ? [...SESI_HABILIDADES, ...BNCC_HABILIDADES] : BNCC_HABILIDADES;
  }, [isSesiUser]);

  const filteredHabilidades = useMemo(() => {
    const query = bnccSearch.toLowerCase().trim();

    return availableSkills.filter(hab => {
      if (query) {
        return (
          hab.code.toLowerCase().includes(query) ||
          hab.description.toLowerCase().includes(query)
        );
      }
      const matchSubject = !disciplina || hab.subject === disciplina;
      return matchSubject;
    }).sort((a, b) => {
      if (a.grade === anoSerie && b.grade !== anoSerie) return -1;
      if (a.grade !== anoSerie && b.grade === anoSerie) return 1;
      return a.code.localeCompare(b.code);
    });
  }, [availableSkills, disciplina, anoSerie, bnccSearch]);

  const toggleSelectSkill = (skill) => {
    if (selectedBNCC.some(s => s.code === skill.code)) {
      setSelectedBNCC(selectedBNCC.filter(s => s.code !== skill.code));
    } else {
      setSelectedBNCC([...selectedBNCC, skill]);
    }
  };

  const handleSubmit = (useAi = true) => {
    if (!necessidadeEspecial) {
      alert('Informe a Necessidade Educacional Especial do estudante.');
      return;
    }

    const currentDiscObj = DISCIPLINAS.find(d => d.id === disciplina);
    const currentGradeObj = ANOS_SERIES.find(g => g.id === anoSerie);

    onGenerate({
      type: 'PEI',
      nomeAluno: nomeAluno.trim() || 'Estudante',
      anoSerie: currentGradeObj ? currentGradeObj.label : anoSerie,
      disciplina: currentDiscObj ? currentDiscObj.name : disciplina,
      necessidadeEspecial,
      diagnosticoHistorico,
      habilidadesAtuais,
      habilidadesBNCCAlvo: selectedBNCC,
      recursosAcessibilidade
    }, useAi);
  };

  return (
    <div className="workspace-split-container animate-fade-in">
      <div className="form-card main-form-card">
        {/* Banner do PEI */}
        <div className="form-card-header pei-header">
          <div className="icon-wrapper pei-icon-bg">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2>Plano de Ensino Individualizado (PEI)</h2>
            <p>Adaptação pedagógica inclusiva focada nas potencialidades do estudante</p>
          </div>
        </div>

        {/* Etapas do PEI */}
        <div className="step-progress-bar">
          <button
            className={`step-tab ${activeStep === 1 ? 'active' : ''}`}
            onClick={() => setActiveStep(1)}
          >
            <span className="step-number">1</span>
            <span className="step-label">Estudante</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-400 step-arrow" />

          <button
            className={`step-tab ${activeStep === 2 ? 'active' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <span className="step-number">2</span>
            <span className="step-label">AEE & Diagnóstico</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-400 step-arrow" />

          <button
            className={`step-tab ${activeStep === 3 ? 'active' : ''}`}
            onClick={() => setActiveStep(3)}
          >
            <span className="step-number">3</span>
            <span className="step-label">BNCC & Recursos</span>
          </button>
        </div>

        {/* ETAPA 1 */}
        {activeStep === 1 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-grid">
              <div className="form-group col-span-6">
                <label className="form-label">Nome do Aluno(a)</label>
                <div className="input-icon-group">
                  <User className="w-4 h-4 text-slate-400 input-icon" />
                  <input
                    type="text"
                    className="form-input with-icon"
                    placeholder="Ex: Lucas Gabriel"
                    value={nomeAluno}
                    onChange={(e) => setNomeAluno(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group col-span-3">
                <label className="form-label">Série / Ano</label>
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

              <div className="form-group col-span-3">
                <label className="form-label">Disciplina / Área</label>
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
            </div>

            <div className="step-nav-footer mt-6">
              <div></div>
              <button
                type="button"
                className="btn btn-rose"
                onClick={() => setActiveStep(2)}
              >
                <span>Próximo: AEE & Diagnóstico</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2 */}
        {activeStep === 2 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-grid">
              <div className="form-group col-span-6">
                <label className="form-label">Necessidade Educacional / Condição</label>
                <select
                  value={necessidadeEspecial}
                  onChange={(e) => setNecessidadeEspecial(e.target.value)}
                  className="form-select"
                >
                  {NECESSIDADES_PEI.map(n => (
                    <option key={n.id} value={n.label}>{n.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group col-span-6">
                <label className="form-label">Resumo Clínico / Diagnóstico (Opcional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Laudo F84.0; acompanhado por fonoaudióloga..."
                  value={diagnosticoHistorico}
                  onChange={(e) => setDiagnosticoHistorico(e.target.value)}
                />
              </div>

              <div className="form-group col-span-12">
                <label className="form-label">Habilidades Atuais e Potencialidades</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  placeholder="Ex: Excelente memória visual; responde bem a estimulação concreta..."
                  value={habilidadesAtuais}
                  onChange={(e) => setHabilidadesAtuais(e.target.value)}
                />
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
                className="btn btn-rose"
                onClick={() => setActiveStep(3)}
              >
                <span>Próximo: BNCC & Recursos</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3 */}
        {activeStep === 3 && (
          <div className="form-step-content animate-fade-in">
            <div className="form-grid">
              <div className="form-group col-span-12">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label mb-0">Habilidades BNCC Alvo da Adaptação</label>
                  <span className="text-xs font-semibold text-rose-500">
                    {selectedBNCC.length} selecionada(s)
                  </span>
                </div>

                {selectedBNCC.length > 0 && (
                  <div className="selected-bncc-list mb-3">
                    {selectedBNCC.map(s => (
                      <div key={s.code} className="bncc-badge-chip pei-chip">
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
                    placeholder="Buscar habilidades para adaptar..."
                    value={bnccSearch}
                    onChange={(e) => setBnccSearch(e.target.value)}
                    className="form-input with-icon text-sm"
                  />
                </div>

                <div className="bncc-selector-box">
                  {filteredHabilidades.map(skill => {
                    const isSelected = selectedBNCC.some(s => s.code === skill.code);
                    return (
                      <div
                        key={skill.code}
                        className={`bncc-item ${isSelected ? 'selected-pei' : ''}`}
                        onClick={() => toggleSelectSkill(skill)}
                      >
                        <div className="checkbox-indicator pei-check">
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div>
                          <span className="bncc-code">{skill.code}</span>
                          <p className="bncc-desc">{skill.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-group col-span-12">
                <label className="form-label">Recursos de Tecnologia Assistiva / Acessibilidade</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Prancha de Comunicação PECS, Textos Ampliados 24pt..."
                  value={recursosAcessibilidade}
                  onChange={(e) => setRecursosAcessibilidade(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions-bar mt-6">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
              >
                <Accessibility className="w-4 h-4 mr-2" />
                Modelo PEI Rápido
              </button>

              <button
                type="button"
                className="btn btn-rose"
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="spinner mr-2"></span>
                    Gerando PEI com IA...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>Gerar PEI com DeepSeek IA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resumo do PEI */}
      <div className="side-summary-card pei-side">
        <div className="side-summary-header">
          <HeartHandshake className="w-4 h-4 text-rose-500 mr-2" />
          <h3 className="text-sm font-bold">Resumo do PEI</h3>
        </div>

        <div className="side-summary-body">
          <div className="summary-item">
            <span className="summary-label">Estudante:</span>
            <span className="summary-val font-semibold">{nomeAluno || 'Estudante'}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Série:</span>
            <span className="summary-val">{ANOS_SERIES.find(a => a.id === anoSerie)?.label || anoSerie}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Condição:</span>
            <span className="summary-val text-rose-600 dark:text-rose-400 font-medium">{necessidadeEspecial}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">BNCC Alvo:</span>
            <span className="summary-val">{selectedBNCC.length} habilidade(s)</span>
          </div>

          <div className="side-tips-box mt-4">
            <Lightbulb className="w-4 h-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              O PEI gerado focará em adaptações curriculares acessíveis e estratégias para a equipe de AEE e docentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
