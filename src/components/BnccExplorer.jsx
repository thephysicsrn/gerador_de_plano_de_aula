import React, { useState, useMemo } from 'react';
import { Database, Search, Plus, Trash2, LayoutList, LayoutGrid, Sparkles, BookOpen, Tag } from 'lucide-react';
import { ANOS_SERIES, DISCIPLINAS, BNCC_HABILIDADES } from '../data/bnccData';
import { SESI_HABILIDADES } from '../data/sesiData';
import { getCustomCurriculum, saveCustomSkill, deleteCustomSkill } from '../utils/storage';

export default function BnccExplorer({ user }) {
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Habilidades customizadas da escola
  const [customList, setCustomList] = useState(() => getCustomCurriculum());

  // Form de adição de nova habilidade customizada
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newSubject, setNewSubject] = useState('MA');
  const [newGrade, setNewGrade] = useState('EF06');
  const [newDesc, setNewDesc] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newDesc.trim()) {
      alert('Preencha o Código e a Descrição da habilidade.');
      return;
    }

    const updated = saveCustomSkill({
      code: newCode.trim().toUpperCase(),
      subject: newSubject,
      grade: newGrade,
      description: newDesc.trim()
    });

    setCustomList(updated);
    setNewCode('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const handleDeleteCustom = (id) => {
    if (confirm('Tem certeza que deseja remover esta habilidade personalizada da matriz da escola?')) {
      const updated = deleteCustomSkill(id);
      setCustomList(updated);
    }
  };

  // Habilidades unificadas (Exibe Matriz SESI se o usuário for da REDE SESI)
  const isSesiUser = user?.redeEnsino === 'REDE_SESI';
  const allHabilidades = useMemo(() => {
    return isSesiUser 
      ? [...customList, ...SESI_HABILIDADES, ...BNCC_HABILIDADES]
      : [...customList, ...BNCC_HABILIDADES];
  }, [customList, isSesiUser]);

  // Filtragem
  const filteredHabilidades = useMemo(() => {
    return allHabilidades.filter(item => {
      const matchSubject = selectedSubject === 'ALL' || item.subject === selectedSubject;
      const matchGrade = selectedGrade === 'ALL' || item.grade === selectedGrade;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        item.code.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q);

      return matchSubject && matchGrade && matchQuery;
    });
  }, [allHabilidades, selectedSubject, selectedGrade, searchQuery]);

  return (
    <div className="explorer-container animate-fade-in">
      {/* Cabeçalho da Matriz BNCC */}
      <div className="explorer-header">
        <div className="flex items-center space-x-3">
          <div className="icon-wrapper">
            <Database className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h2>Matriz Curricular BNCC & Escola</h2>
            <p>Consulte habilidades oficiais da BNCC e gerencie os objetivos de aprendizagem da sua instituição</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Alternador de Visualização (Tabela vs Cards) */}
          <div className="bncc-view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Visualização em Tabela Executiva"
            >
              <LayoutList className="w-4 h-4 mr-1.5" />
              <span>Tabela</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Visualização em Cards"
            >
              <LayoutGrid className="w-4 h-4 mr-1.5" />
              <span>Cards</span>
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>{showAddForm ? 'Cancelar' : 'Nova Habilidade da Escola'}</span>
          </button>
        </div>
      </div>

      {/* Formulário de Adição de Habilidade Customizada */}
      {showAddForm && (
        <form onSubmit={handleAddSkill} className="form-card mb-6 animate-fade-in border-indigo-500/40 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Cadastrar Habilidade / Matriz Específica</h3>
          </div>
          <div className="form-grid">
            <div className="form-group col-span-3">
              <label className="form-label">Código (Ex: ESC-MA-01)</label>
              <input
                type="text"
                className="form-input font-mono uppercase"
                placeholder="ESC-MA-01"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                required
              />
            </div>
            <div className="form-group col-span-3">
              <label className="form-label">Disciplina</label>
              <select
                className="form-select"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              >
                {DISCIPLINAS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-span-3">
              <label className="form-label">Série / Ano</label>
              <select
                className="form-select"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
              >
                {ANOS_SERIES.map(a => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-span-12">
              <label className="form-label">Descrição da Habilidade / Objetivos de Aprendizagem</label>
              <textarea
                rows="2"
                className="form-textarea"
                placeholder="Descreva minunciosamente o que o estudante deve aprender ou aplicar..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-secondary text-sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary text-sm">
              Salvar Habilidade na Matriz
            </button>
          </div>
        </form>
      )}

      {/* Barra de Filtros e Pesquisa */}
      <div className="explorer-filters-bar">
        <div className="filter-group-col">
          <label className="filter-label">Disciplina</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="form-select"
          >
            <option value="ALL">Todas as Disciplinas</option>
            {DISCIPLINAS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group-col">
          <label className="filter-label">Série / Ano Escolar</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="form-select"
          >
            <option value="ALL">Todos os Anos / Séries</option>
            {ANOS_SERIES.map(a => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group-col search-grow">
          <label className="filter-label">Busca por Código ou Descrição</label>
          <div className="input-icon-group">
            <Search className="w-4 h-4 text-slate-400 input-icon" />
            <input
              type="text"
              placeholder="Buscar por código (ex: EF06MA05) ou palavra-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input with-icon text-sm"
            />
          </div>
        </div>
      </div>

      {/* Contador de Resultados */}
      <div className="bncc-results-count">
        <span>Mostrando <strong>{filteredHabilidades.length}</strong> habilidade(s) cadastrada(s)</span>
      </div>

      {/* MODO 1: TABELA EXECUTIVA (HIGH CONTRAST) */}
      {viewMode === 'table' ? (
        <div className="bncc-table-wrapper">
          <table className="bncc-executive-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Código</th>
                <th>Descrição da Habilidade / Competência (BNCC)</th>
                <th style={{ width: '160px' }}>Disciplina</th>
                <th style={{ width: '160px' }}>Ano / Série</th>
                <th style={{ width: '130px' }}>Origem</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredHabilidades.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    Nenhuma habilidade encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredHabilidades.map(item => {
                  const discObj = DISCIPLINAS.find(d => d.id === item.subject);
                  const gradeObj = ANOS_SERIES.find(g => g.id === item.grade);

                  return (
                    <tr key={item.id || item.code} className="bncc-table-row">
                      <td className="cell-code">
                        <span className="bncc-code-badge">{item.code}</span>
                      </td>
                      <td className="cell-desc">
                        <p className="bncc-table-desc-text">{item.description}</p>
                      </td>
                      <td className="cell-subject">
                        <span className="pill-badge pill-subject">
                          <BookOpen className="w-3 h-3 mr-1 shrink-0" />
                          {discObj ? discObj.name : item.subject}
                        </span>
                      </td>
                      <td className="cell-grade">
                        <span className="pill-badge pill-grade">
                          {gradeObj ? gradeObj.label : item.grade}
                        </span>
                      </td>
                      <td className="cell-origin">
                        {item.isSesi ? (
                          <span className="pill-badge pill-sesi bg-amber-500 text-white font-bold">REDE SESI</span>
                        ) : item.isCustom ? (
                          <span className="pill-badge pill-custom">Escola</span>
                        ) : (
                          <span className="pill-badge pill-bncc">Oficial BNCC</span>
                        )}
                      </td>
                      <td className="cell-actions">
                        {item.isCustom && (
                          <button
                            onClick={() => handleDeleteCustom(item.id)}
                            className="btn-table-delete"
                            title="Excluir habilidade da escola"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* MODO 2: CARDS GRID PODIA */
        <div className="skills-grid">
          {filteredHabilidades.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-400">
              Nenhuma habilidade encontrada para os filtros selecionados.
            </div>
          ) : (
            filteredHabilidades.map(item => {
              const discObj = DISCIPLINAS.find(d => d.id === item.subject);
              const gradeObj = ANOS_SERIES.find(g => g.id === item.grade);

              return (
                <div key={item.id || item.code} className="skill-card-podia">
                  <div className="skill-card-header">
                    <span className="bncc-code-badge">{item.code}</span>
                    {item.isCustom ? (
                      <span className="pill-badge pill-custom">Matriz Escola</span>
                    ) : (
                      <span className="pill-badge pill-bncc">BNCC Oficial</span>
                    )}
                    {item.isCustom && (
                      <button
                        onClick={() => handleDeleteCustom(item.id)}
                        className="btn-table-delete ml-auto"
                        title="Deletar habilidade da escola"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="skill-description">{item.description}</p>
                  <div className="skill-footer">
                    <span className="pill-badge pill-subject">{discObj ? discObj.name : item.subject}</span>
                    <span className="pill-badge pill-grade">{gradeObj ? gradeObj.label : item.grade}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
