import React, { useState, useEffect } from 'react';
import { BookmarkCheck, Search, FileText, HeartHandshake, Eye, Trash2, Calendar, Download } from 'lucide-react';
import { getSavedPlans, deletePlan } from '../utils/storage';
import { exportToWord } from '../services/exportService';

export default function SavedPlansList({ onSelectPlan, user }) {
  const [plans, setPlans] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const userIdentifier = user?.uid || user?.email || 'guest';

  useEffect(() => {
    setPlans(getSavedPlans(userIdentifier));
  }, [userIdentifier]);

  const handleDelete = (planId, e) => {
    e.stopPropagation();
    if (confirm('Deseja realmente excluir este plano salvo da sua conta?')) {
      const updated = deletePlan(planId, userIdentifier);
      setPlans(updated);
    }
  };

  const handleExportWordDirect = async (plan, e) => {
    e.stopPropagation();
    await exportToWord(plan);
  };

  const filteredPlans = plans.filter(p => {
    const isPei = p.type === 'PEI';
    const matchType = filterType === 'ALL' || (filterType === 'PEI' && isPei) || (filterType === 'AULA' && !isPei);
    const q = searchQuery.toLowerCase();
    const title = (p.titulo || p.nomeAluno || p.disciplina || '').toLowerCase();
    const matchQuery = !q || title.includes(q) || (p.conteudoProgramatico || '').toLowerCase().includes(q);

    return matchType && matchQuery;
  });

  return (
    <div className="history-container animate-fade-in">
      <div className="history-header">
        <div className="flex items-center space-x-3">
          <div className="icon-wrapper">
            <BookmarkCheck className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h2>Histórico de Planos Salvos</h2>
            <p>Gerencie seus Planos de Aula e PEIs salvos no dispositivo</p>
          </div>
        </div>
      </div>

      <div className="history-filters">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterType('ALL')}
          >
            Todos ({plans.length})
          </button>
          <button
            className={`filter-btn ${filterType === 'AULA' ? 'active' : ''}`}
            onClick={() => setFilterType('AULA')}
          >
            Planos de Aula
          </button>
          <button
            className={`filter-btn ${filterType === 'PEI' ? 'active' : ''}`}
            onClick={() => setFilterType('PEI')}
          >
            PEIs Inclusivos
          </button>
        </div>

        <div className="input-icon-group search-history">
          <Search className="w-4 h-4 text-slate-400 input-icon" />
          <input
            type="text"
            placeholder="Buscar por título, estudante ou disciplina..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input with-icon text-sm"
          />
        </div>
      </div>

      <div className="plans-grid mt-4">
        {filteredPlans.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-slate-800/30 rounded-2xl border border-slate-700/40">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-slate-300">Nenhum plano encontrado no histórico.</p>
            <p className="text-xs text-slate-400 mt-1">Crie e salve seus planos de aula ou PEIs para consultá-los aqui.</p>
          </div>
        ) : (
          filteredPlans.map(plan => {
            const isPei = plan.type === 'PEI';
            const title = isPei ? `PEI: ${plan.nomeAluno}` : (plan.titulo || `Plano: ${plan.disciplina}`);
            const dateStr = plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString('pt-BR') : '';

            return (
              <div
                key={plan.id}
                className="plan-card"
                onClick={() => onSelectPlan(plan)}
              >
                <div className="plan-card-header">
                  <span className={`type-badge ${isPei ? 'pei-badge' : 'aula-badge'}`}>
                    {isPei ? <HeartHandshake className="w-3.5 h-3.5 mr-1" /> : <FileText className="w-3.5 h-3.5 mr-1" />}
                    {isPei ? 'PEI INCLUSIVO' : 'PLANO DE AULA'}
                  </span>
                  <span className="date-badge">
                    <Calendar className="w-3 h-3 mr-1" />
                    {dateStr}
                  </span>
                </div>

                <h3 className="plan-card-title">{title}</h3>
                <p className="plan-card-meta">
                  <strong>{plan.disciplina}</strong> • {plan.anoSerie}
                </p>

                {plan.conteudoProgramatico && (
                  <p className="plan-card-preview">{plan.conteudoProgramatico}</p>
                )}

                {isPei && plan.necessidadeEspecial && (
                  <p className="plan-card-preview text-rose-400">
                    Necessidade: {plan.necessidadeEspecial}
                  </p>
                )}

                <div className="plan-card-actions">
                  <button
                    className="btn-card-action"
                    onClick={(e) => { e.stopPropagation(); onSelectPlan(plan); }}
                    title="Visualizar e Editar"
                  >
                    <Eye className="w-4 h-4 mr-1 text-indigo-400" />
                    <span>Abrir</span>
                  </button>

                  <button
                    className="btn-card-action"
                    onClick={(e) => handleExportWordDirect(plan, e)}
                    title="Baixar em Word (.docx)"
                  >
                    <Download className="w-4 h-4 mr-1 text-blue-400" />
                    <span>Word</span>
                  </button>

                  <button
                    className="btn-card-action hover:text-red-400 ml-auto"
                    onClick={(e) => handleDelete(plan.id, e)}
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
