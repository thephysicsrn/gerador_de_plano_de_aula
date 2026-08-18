import React, { useState } from 'react';
import { Download, FileText, Copy, Check, Save, ArrowLeft, Printer } from 'lucide-react';
import { exportToWord, exportToPdf, copyToClipboard } from '../services/exportService';
import { savePlan } from '../utils/storage';

export default function PlanViewer({ plan, onBack, onSaveSuccess, user }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!plan) return null;

  const planType = (plan.type || '').toLowerCase();
  const isPei = plan.isPei || planType === 'pei';
  const isSequence = plan.isSequence || planType === 'sequence' || planType === 'didacticsequence';
  const isReport = plan.isReport || planType === 'report' || planType === 'pedagogicalreport';
  const isAdaptedActivity = plan.isAdaptedActivity || planType === 'adaptedactivity';
  const isAnnualPlan = plan.isAnnualPlan || planType === 'annualplan' || planType === 'annualcourseplan';
  const isInterdisciplinaryProject = plan.isInterdisciplinaryProject || planType === 'interdisciplinaryproject';
  const content = plan.content || plan;
  const editableData = { ...plan, ...content };

  const handleSave = () => {
    savePlan(plan, user?.uid || '');
    setSaved(true);
    if (onSaveSuccess) onSaveSuccess();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopy = () => {
    copyToClipboard(editableData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWordExport = async () => {
    setIsExporting(true);
    try {
      await exportToWord(editableData);
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar documento Word.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePdfExport = async () => {
    setIsExporting(true);
    try {
      const rawTitle = content.titulo || content.tituloRelatorio || content.tituloAtividade || content.tituloPlanoAnual || content.tituloProjeto || editableData.conteudoProgramatico || editableData.nomeAluno || 'Documento';
      const cleanTitle = rawTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
      const prefix = isPei ? 'PEI' : (isSequence ? 'Sequencia' : (isReport ? 'Relatorio' : (isAdaptedActivity ? 'Atividade_Adaptada' : (isAnnualPlan ? 'Plano_Anual' : (isInterdisciplinaryProject ? 'Projeto_Integrador' : 'Plano_Aula')))));
      const filename = `${prefix}_${cleanTitle}.pdf`;
      await exportToPdf('a4-document-paper', filename);
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="plan-viewer-container animate-fade-in">
      {/* Barra de Ações Superior */}
      <div className="viewer-toolbar">
        <button className="btn btn-secondary text-sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar ao Formulário
        </button>

        <div className="toolbar-actions">
          <button className="btn btn-action" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-emerald-400 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button className="btn btn-action" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-1" />
            <span>Imprimir</span>
          </button>

          <button className="btn btn-action btn-word" onClick={handleWordExport} disabled={isExporting}>
            <FileText className="w-4 h-4 mr-1" />
            <span>Baixar Word (.docx)</span>
          </button>

          <button className="btn btn-action btn-pdf" onClick={handlePdfExport} disabled={isExporting}>
            <Download className="w-4 h-4 mr-1" />
            <span>Baixar PDF</span>
          </button>

          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? <Check className="w-4 h-4 mr-1 text-emerald-400" /> : <Save className="w-4 h-4 mr-1" />}
            <span>{saved ? 'Salvo na Sua Conta Edu.Plan!' : 'Salvar na Minha Conta'}</span>
          </button>
        </div>
      </div>

      {/* Folha de Papel A4 para Visualização e Impressão */}
      <div className="a4-wrapper">
        <div id="a4-document-paper" className="a4-paper">
          {/* Cabeçalho Institucional */}
          <div className="doc-header">
            <div className="doc-badge">
              {isPei && 'PLANO DE ENSINO INDIVIDUALIZADO (PEI)'}
              {isSequence && 'SEQUÊNCIA DIDÁTICA ENCADEDA'}
              {isReport && 'RELATÓRIO PEDAGÓGICO & PARECER DESCRITIVO'}
              {isAdaptedActivity && 'ATIVIDADE ADAPTADA — EDUCAÇÃO INCLUSIVA AEE'}
              {isAnnualPlan && 'PLANO DE CURSO ANUAL & EMENTA BIMESTRAL'}
              {isInterdisciplinaryProject && 'PROJETO INTERDISCIPLINAR & INTEGRADOR'}
              {!isPei && !isSequence && !isReport && !isAdaptedActivity && !isAnnualPlan && !isInterdisciplinaryProject && 'PLANO DE AULA / MATRIZ PEDAGÓGICA'}
            </div>
            <h1 className="doc-title">
              {isPei && `PEI: ${editableData.nomeAluno || 'Estudante'}`}
              {isSequence && (content.titulo || `Sequência Didática - ${editableData.disciplina}`)}
              {isReport && (content.tituloRelatorio || `Relatório Pedagógico - ${editableData.nomeAluno}`)}
              {isAdaptedActivity && (content.tituloAtividade || `Atividade Adaptada - ${editableData.disciplina}`)}
              {isAnnualPlan && (content.tituloPlanoAnual || `Plano de Curso Anual - ${editableData.disciplina}`)}
              {isInterdisciplinaryProject && (content.tituloProjeto || `Projeto Integrador - ${editableData.disciplinaPrincipal}`)}
              {!isPei && !isSequence && !isReport && !isAdaptedActivity && !isAnnualPlan && !isInterdisciplinaryProject && (content.titulo || `Plano de Aula - ${editableData.disciplina}`)}
            </h1>
            <p className="doc-subtitle">Base Curricular & Diretrizes Nacionais de Educação (MEC / BNCC / SESI)</p>
          </div>

          {/* Tabela de Metadados */}
          <div className="doc-meta-grid">
            {isAnnualPlan ? (
              <>
                <div className="meta-item">
                  <span className="meta-label">Componente Curricular:</span>
                  <span className="meta-value">{editableData.disciplina}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Série / Ano:</span>
                  <span className="meta-value">{editableData.anoSerie}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Carga Horária:</span>
                  <span className="meta-value">{editableData.cargaHoraria}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Divisão:</span>
                  <span className="meta-value font-semibold text-blue-700">{editableData.divisaoPeriodo}</span>
                </div>
              </>
            ) : isInterdisciplinaryProject ? (
              <>
                <div className="meta-item">
                  <span className="meta-label">Disciplina Principal:</span>
                  <span className="meta-value font-semibold">{editableData.disciplinaPrincipal}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Disciplinas Integradas:</span>
                  <span className="meta-value text-emerald-700">
                    {Array.isArray(editableData.disciplinasSecundarias) ? editableData.disciplinasSecundarias.join(', ') : editableData.disciplinasSecundarias}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Série / Ano:</span>
                  <span className="meta-value">{editableData.anoSerie}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Produto Final:</span>
                  <span className="meta-value font-semibold">{editableData.produtoFinal}</span>
                </div>
              </>
            ) : isAdaptedActivity ? (
              <>
                <div className="meta-item">
                  <span className="meta-label">Componente Curricular:</span>
                  <span className="meta-value">{editableData.disciplina}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Série / Ano:</span>
                  <span className="meta-value">{editableData.anoSerie}</span>
                </div>
                <div className="meta-item col-span-full">
                  <span className="meta-label">Público-Alvo / Adaptação:</span>
                  <span className="meta-value font-semibold text-rose-700">{editableData.necessidade}</span>
                </div>
              </>
            ) : isReport ? (
              <>
                <div className="meta-item">
                  <span className="meta-label">Estudante:</span>
                  <span className="meta-value font-semibold">{editableData.nomeAluno}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Série / Ano:</span>
                  <span className="meta-value">{editableData.anoSerie}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Componente Curricular:</span>
                  <span className="meta-value">{editableData.disciplina}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Período de Avaliação:</span>
                  <span className="meta-value font-semibold text-indigo-700">{editableData.periodo}</span>
                </div>
              </>
            ) : isSequence ? (
              <>
                <div className="meta-item">
                  <span className="meta-label">Disciplina:</span>
                  <span className="meta-value">{editableData.disciplina}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Série / Ano:</span>
                  <span className="meta-value">{editableData.anoSerie}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Duração Prevista:</span>
                  <span className="meta-value font-semibold">{editableData.numeroAulas}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Metodologia:</span>
                  <span className="meta-value text-indigo-700">{editableData.tipoMetodologia}</span>
                </div>
                <div className="meta-item col-span-full">
                  <span className="meta-label">Unidade Temática:</span>
                  <span className="meta-value font-semibold">{editableData.unidadeTematica}</span>
                </div>
              </>
            ) : !isPei ? (
              <>
                <div className="meta-item">
                  <span className="meta-label">Disciplina / Componente:</span>
                  <span className="meta-value">{editableData.disciplina}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Série / Ano:</span>
                  <span className="meta-value">{editableData.anoSerie}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tempo de Aula:</span>
                  <span className="meta-value">{editableData.tempoAula}</span>
                </div>
                <div className="meta-item col-span-full">
                  <span className="meta-label">Conteúdo Programático:</span>
                  <span className="meta-value font-semibold">{editableData.conteudoProgramatico}</span>
                </div>
              </>
            ) : (
              <>
                <div className="meta-item">
                  <span className="meta-label">Estudante:</span>
                  <span className="meta-value font-semibold">{editableData.nomeAluno}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Série / Ano:</span>
                  <span className="meta-value">{editableData.anoSerie}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Disciplina:</span>
                  <span className="meta-value">{editableData.disciplina}</span>
                </div>
                <div className="meta-item col-span-full">
                  <span className="meta-label">Necessidade Especial:</span>
                  <span className="meta-value font-semibold text-rose-700">{editableData.necessidadeEspecial}</span>
                </div>
              </>
            )}
          </div>

          {/* Seção Habilidades BNCC (se houver) */}
          {((editableData.habilidadesBNCC && editableData.habilidadesBNCC.length > 0) ||
            (editableData.habilidadesBNCCAlvo && editableData.habilidadesBNCCAlvo.length > 0)) && (
            <div className="doc-section">
              <h3 className="doc-section-title">Habilidades da BNCC Mobilizadas</h3>
              <div className="doc-bncc-box">
                {(editableData.habilidadesBNCC || editableData.habilidadesBNCCAlvo).map(skill => (
                  <div key={skill.code} className="doc-bncc-item">
                    <span className="doc-bncc-code">{skill.code}</span>
                    <span className="doc-bncc-text">{skill.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTEÚDO DA SEQUÊNCIA DIDÁTICA */}
          {isSequence && (
            <>
              {content.objetivoGeral && (
                <div className="doc-section">
                  <h3 className="doc-section-title">1. Objetivo Geral da Sequência</h3>
                  <p className="doc-paragraph">{content.objetivoGeral}</p>
                </div>
              )}

              {content.aulasEncadeadas && Array.isArray(content.aulasEncadeadas) && (
                <div className="doc-section">
                  <h3 className="doc-section-title">2. Estrutura das Aulas Encadeadas</h3>
                  <div className="doc-steps">
                    {content.aulasEncadeadas.map((aula, idx) => (
                      <div key={idx} className="step-card mb-4">
                        <div className="step-header">
                          <span className="step-title">{aula.aulaNumero}: {aula.temaAula}</span>
                        </div>
                        <p className="step-desc mt-1"><strong>Objetivo:</strong> {aula.objetivoEspecifico}</p>
                        <p className="step-desc mt-1"><strong>Desenvolvimento:</strong> {aula.desenvolvimento}</p>
                        <p className="step-desc mt-1"><strong>Recursos:</strong> {aula.recursos}</p>
                        <p className="step-desc mt-1"><strong>Avaliação Formativa:</strong> {aula.avaliacaoFormacao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.avaliacaoFinalSequencia && (
                <div className="doc-section">
                  <h3 className="doc-section-title">3. Critérios de Avaliação Final da Sequência</h3>
                  <p className="doc-paragraph">{content.avaliacaoFinalSequencia}</p>
                </div>
              )}
            </>
          )}

          {/* CONTEÚDO DO RELATÓRIO PEDAGÓGICO / PARECER */}
          {isReport && (
            <>
              {content.introducaoContexto && (
                <div className="doc-section">
                  <h3 className="doc-section-title">1. Contextualização Inicial</h3>
                  <p className="doc-paragraph">{content.introducaoContexto}</p>
                </div>
              )}

              {content.desenvolvimentoCognitivo && (
                <div className="doc-section">
                  <h3 className="doc-section-title">2. Desenvolvimento Cognitivo e Acadêmico</h3>
                  <p className="doc-paragraph">{content.desenvolvimentoCognitivo}</p>
                </div>
              )}

              {content.desenvolvimentoSocioemocional && (
                <div className="doc-section">
                  <h3 className="doc-section-title">3. Aspectos Sociocomportamentais e Afetivos</h3>
                  <p className="doc-paragraph">{content.desenvolvimentoSocioemocional}</p>
                </div>
              )}

              {content.pontosFortesDestacados && (
                <div className="doc-section">
                  <h3 className="doc-section-title">4. Destaques e Pontos Fortes</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.pontosFortesDestacados)
                      ? content.pontosFortesDestacados.map((item, i) => <li key={i}>{item}</li>)
                      : <li>{content.pontosFortesDestacados}</li>}
                  </ul>
                </div>
              )}

              {content.desafiosECombinados && (
                <div className="doc-section">
                  <h3 className="doc-section-title">5. Aspectos em Desenvolvimento e Combinados</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.desafiosECombinados)
                      ? content.desafiosECombinados.map((item, i) => <li key={i}>{item}</li>)
                      : <li>{content.desafiosECombinados}</li>}
                  </ul>
                </div>
              )}

              {content.recomendacoesPedagógicas && (
                <div className="doc-section doc-section-highlight">
                  <h3 className="doc-section-title">6. Recomendações para a Família & Próximo Período</h3>
                  <p className="doc-paragraph">{content.recomendacoesPedagógicas}</p>
                </div>
              )}

              {content.consideracoesFinais && (
                <div className="doc-section">
                  <h3 className="doc-section-title">7. Considerações Finais</h3>
                  <p className="doc-paragraph">{content.consideracoesFinais}</p>
                </div>
              )}
            </>
          )}

          {/* CONTEÚDO DA ATIVIDADE ADAPTADA */}
          {isAdaptedActivity && (
            <>
              {/* Análise da IA da atividade original */}
              {content.analiseOriginal && (
                <div className="doc-section" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '16px' }}>
                  <h3 className="doc-section-title" style={{ color: '#0369a1' }}>🔍 Análise da IA — Diagnóstico da Atividade Original</h3>
                  <p className="doc-paragraph" style={{ color: '#0c4a6e', fontSize: '0.9rem' }}>{content.analiseOriginal}</p>
                </div>
              )}

              {content.enunciadoAdaptado && (
                <div className="doc-section">
                  <h3 className="doc-section-title">1. Instruções e Orientação Acessível</h3>
                  <p className="doc-paragraph">{content.enunciadoAdaptado}</p>
                </div>
              )}

              {content.questoesEExercicios && Array.isArray(content.questoesEExercicios) && (
                <div className="doc-section">
                  <h3 className="doc-section-title">2. Exercícios Adaptados</h3>
                  <div className="doc-steps">
                    {content.questoesEExercicios.map((q, idx) => (
                      <div key={idx} className="step-card mb-4 p-4 border border-slate-200 rounded-lg">
                        <div className="step-header mb-2 flex flex-wrap items-center gap-2">
                          <span className="step-title font-bold text-slate-900">{q.numero}</span>
                          {q.tipoOriginal && (
                            <span style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#4338ca', borderRadius: '999px', padding: '2px 10px', fontWeight: 600 }}>
                              {q.tipoOriginal}
                            </span>
                          )}
                        </div>
                        {q.estrategiaAdotada && (
                          <p style={{ fontSize: '0.75rem', color: '#6d28d9', background: '#f5f3ff', borderRadius: '6px', padding: '6px 10px', marginBottom: '8px', borderLeft: '3px solid #7c3aed' }}>
                            🧠 <strong>Estratégia:</strong> {q.estrategiaAdotada}
                          </p>
                        )}
                        <p className="step-desc text-sm text-slate-800 font-semibold mb-2">{q.enunciadoSimples}</p>
                        {q.opcoesOuEspaco && (
                          <pre className="bg-slate-50 p-3 rounded text-xs font-mono whitespace-pre-wrap text-slate-700 mb-2">
                            {q.opcoesOuEspaco}
                          </pre>
                        )}
                        {q.dicaAcessibilidade && (
                          <p className="text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-200 italic">
                            💡 <strong>Apoio/Dica:</strong> {q.dicaAcessibilidade}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.bancoDeRespostasOuApoio && Array.isArray(content.bancoDeRespostasOuApoio) && content.bancoDeRespostasOuApoio.length > 0 && (
                <div className="doc-section">
                  <h3 className="doc-section-title">3. Caixa de Palavras de Apoio / Banco de Dicas</h3>
                  <ul className="doc-list">
                    {content.bancoDeRespostasOuApoio.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}

              {content.orientacaoAoProfessor && (
                <div className="doc-section doc-section-highlight">
                  <h3 className="doc-section-title">4. Orientação Pedagógica de Aplicação (AEE)</h3>
                  <p className="doc-paragraph">{content.orientacaoAoProfessor}</p>
                </div>
              )}

              {content.recursosComplementaresSugeridos && Array.isArray(content.recursosComplementaresSugeridos) && content.recursosComplementaresSugeridos.length > 0 && (
                <div className="doc-section">
                  <h3 className="doc-section-title">5. Recursos Complementares Sugeridos pela IA</h3>
                  <ul className="doc-list">
                    {content.recursosComplementaresSugeridos.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* CONTEÚDO DO PLANO DE CURSO ANUAL / BIMESTRAL */}
          {isAnnualPlan && (
            <>
              {content.ementaGeral && (
                <div className="doc-section">
                  <h3 className="doc-section-title">1. Ementa Geral do Curso</h3>
                  <p className="doc-paragraph">{content.ementaGeral}</p>
                </div>
              )}

              {content.objetivosAnuais && (
                <div className="doc-section">
                  <h3 className="doc-section-title">2. Objetivos Gerais do Ano Letivo</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.objetivosAnuais)
                      ? content.objetivosAnuais.map((obj, i) => <li key={i}>{obj}</li>)
                      : <li>{content.objetivosAnuais}</li>}
                  </ul>
                </div>
              )}

              {content.distribuicaoBimestral && Array.isArray(content.distribuicaoBimestral) && (
                <div className="doc-section">
                  <h3 className="doc-section-title">3. Distribuição Curricular por Período Letivo</h3>
                  <div className="doc-steps">
                    {content.distribuicaoBimestral.map((per, idx) => (
                      <div key={idx} className="step-card mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                        <div className="step-header mb-2 flex items-center justify-between">
                          <span className="step-title font-bold text-blue-900 text-base">{per.bimestre}: {per.unidadeTematica}</span>
                        </div>
                        {per.conteudosEssenciais && (
                          <div className="mb-2">
                            <strong className="text-xs text-blue-800 block mb-1">Conteúdos Essenciais:</strong>
                            <ul className="doc-list text-xs text-slate-700">
                              {Array.isArray(per.conteudosEssenciais) 
                                ? per.conteudosEssenciais.map((c, i) => <li key={i}>{c}</li>)
                                : <li>{per.conteudosEssenciais}</li>}
                            </ul>
                          </div>
                        )}
                        <p className="step-desc text-xs text-slate-700 mt-2"><strong>Metodologia:</strong> {per.metodologiaErecursos}</p>
                        <p className="step-desc text-xs text-slate-700 mt-1"><strong>Avaliação:</strong> {per.avaliacaoPeriodo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* CONTEÚDO DO PROJETO INTERDISCIPLINAR / INTEGRADOR */}
          {isInterdisciplinaryProject && (
            <>
              {content.perguntaDisparadora && (
                <div className="doc-section doc-section-highlight">
                  <h3 className="doc-section-title">1. Pergunta Disparadora / Desafio do Projeto</h3>
                  <p className="doc-paragraph font-bold text-slate-800 text-base">{content.perguntaDisparadora}</p>
                </div>
              )}

              {content.justificativaEDisciplinas && (
                <div className="doc-section">
                  <h3 className="doc-section-title">2. Justificativa & Articulação Curricular</h3>
                  <p className="doc-paragraph">{content.justificativaEDisciplinas}</p>
                </div>
              )}

              {content.cronogramaEtapas && Array.isArray(content.cronogramaEtapas) && (
                <div className="doc-section">
                  <h3 className="doc-section-title">3. Cronograma de Etapas do Projeto</h3>
                  <div className="doc-steps">
                    {content.cronogramaEtapas.map((et, idx) => (
                      <div key={idx} className="step-card mb-3 p-3 border border-emerald-200 rounded-lg">
                        <div className="step-header mb-1">
                          <span className="step-title font-bold text-emerald-900">{et.etapaNumero}: {et.nomeEtapa}</span>
                        </div>
                        <p className="step-desc text-xs text-slate-700">{et.descricaoAcoes}</p>
                        <p className="step-desc text-xs text-emerald-700 mt-1"><strong>Responsabilidade:</strong> {et.responsavelDisciplina}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.criteriosAvaliacaoConjunta && (
                <div className="doc-section">
                  <h3 className="doc-section-title">4. Critérios de Avaliação Conjunta</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.criteriosAvaliacaoConjunta)
                      ? content.criteriosAvaliacaoConjunta.map((crit, i) => <li key={i}>{crit}</li>)
                      : <li>{content.criteriosAvaliacaoConjunta}</li>}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* CONTEÚDO DO PLANO DE AULA PADRÃO */}
          {!isPei && !isSequence && !isReport && !isAdaptedActivity && !isAnnualPlan && !isInterdisciplinaryProject && (
            <>
              {content.objetivoGeral && (
                <div className="doc-section">
                  <h3 className="doc-section-title">1. Objetivo Geral</h3>
                  <p className="doc-paragraph">{content.objetivoGeral}</p>
                </div>
              )}

              {content.objetivosEspecificos && (
                <div className="doc-section">
                  <h3 className="doc-section-title">2. Objetivos Específicos</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.objetivosEspecificos)
                      ? content.objetivosEspecificos.map((obj, i) => <li key={i}>{obj}</li>)
                      : <li>{content.objetivosEspecificos}</li>}
                  </ul>
                </div>
              )}

              {content.desenvolvimentoPassoAPasso && (
                <div className="doc-section">
                  <h3 className="doc-section-title">3. Desenvolvimento da Aula (Passo a Passo)</h3>
                  <div className="doc-steps">
                    {Array.isArray(content.desenvolvimentoPassoAPasso) && content.desenvolvimentoPassoAPasso.map((step, index) => (
                      <div key={index} className="step-card">
                        <div className="step-header">
                          <span className="step-title">{step.etapa}</span>
                          <span className="step-badge">{step.tempo}</span>
                        </div>
                        <p className="step-desc">{step.descricao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.estrategiaMetodologica && (
                <div className="doc-section">
                  <h3 className="doc-section-title">4. Estratégia e Recursos Metodológicos</h3>
                  <p className="doc-paragraph">{content.estrategiaMetodologica}</p>
                </div>
              )}

              {content.recursosDidaticos && (
                <div className="doc-section">
                  <h3 className="doc-section-title">5. Recursos Didáticos Necessários</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.recursosDidaticos)
                      ? content.recursosDidaticos.map((rec, i) => <li key={i}>{rec}</li>)
                      : <li>{content.recursosDidaticos}</li>}
                  </ul>
                </div>
              )}

              {content.avaliacaoFormativa && (
                <div className="doc-section">
                  <h3 className="doc-section-title">6. Avaliação Formativa</h3>
                  <p className="doc-paragraph">{content.avaliacaoFormativa}</p>
                </div>
              )}

              {content.atividadesFixacao && (
                <div className="doc-section">
                  <h3 className="doc-section-title">7. Atividades de Fixação / Tarefa</h3>
                  <p className="doc-paragraph">{content.atividadesFixacao}</p>
                </div>
              )}

              {content.adaptacaoInclusiva && (
                <div className="doc-section doc-section-highlight">
                  <h3 className="doc-section-title">8. Dica de Acessibilidade / Inclusão</h3>
                  <p className="doc-paragraph">{content.adaptacaoInclusiva}</p>
                </div>
              )}
            </>
          )}

          {/* CONTEÚDO DO PEI COMPLETO E ROBUSTO */}
          {isPei && (
            <>
              {/* 1. Diagnóstico Pedagógico Funcional */}
              {(content.diagnosticoFuncional || content.perfilAluno) && (
                <div className="doc-section">
                  <h3 className="doc-section-title">1. Diagnóstico e Avaliação Pedagógica Funcional</h3>
                  <p className="doc-paragraph">{content.diagnosticoFuncional || content.perfilAluno}</p>
                </div>
              )}

              {/* 2. Potencialidades e Hiperfocos */}
              {content.potencialidadesEInteresses && Array.isArray(content.potencialidadesEInteresses) && content.potencialidadesEInteresses.length > 0 && (
                <div className="doc-section" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
                  <h3 className="doc-section-title" style={{ color: '#15803d' }}>⭐ 2. Potencialidades, Interesses & Hiperfocos (Âncoras de Aprendizagem)</h3>
                  <ul className="doc-list" style={{ color: '#166534' }}>
                    {content.potencialidadesEInteresses.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}

              {/* 3. Barreiras de Aprendizagem */}
              {content.barreirasAprendizagemIdentificadas && Array.isArray(content.barreirasAprendizagemIdentificadas) && content.barreirasAprendizagemIdentificadas.length > 0 && (
                <div className="doc-section">
                  <h3 className="doc-section-title">3. Barreiras de Acesso ao Currículo Mapeadas</h3>
                  <ul className="doc-list">
                    {content.barreirasAprendizagemIdentificadas.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}

              {/* 4. Metas e Objetivos Curriculares Adaptados */}
              {content.objetivosCurricularesAdaptados && (
                <div className="doc-section">
                  <h3 className="doc-section-title">4. Metas e Objetivos Curriculares Adaptados</h3>
                  {typeof content.objetivosCurricularesAdaptados === 'object' && !Array.isArray(content.objetivosCurricularesAdaptados) ? (
                    <div className="doc-steps">
                      {content.objetivosCurricularesAdaptados.curtoPrazo && (
                        <div className="step-card mb-3 p-3 border border-indigo-200 rounded-lg bg-indigo-50/40">
                          <strong className="text-xs font-bold text-indigo-900 block mb-1">🎯 Metas de Curto Prazo (1 a 2 meses):</strong>
                          <ul className="doc-list text-xs text-slate-700">
                            {content.objetivosCurricularesAdaptados.curtoPrazo.map((m, i) => <li key={i}>{m}</li>)}
                          </ul>
                        </div>
                      )}
                      {content.objetivosCurricularesAdaptados.medioPrazo && (
                        <div className="step-card mb-3 p-3 border border-blue-200 rounded-lg bg-blue-50/40">
                          <strong className="text-xs font-bold text-blue-900 block mb-1">📈 Metas de Médio Prazo (Semestral):</strong>
                          <ul className="doc-list text-xs text-slate-700">
                            {content.objetivosCurricularesAdaptados.medioPrazo.map((m, i) => <li key={i}>{m}</li>)}
                          </ul>
                        </div>
                      )}
                      {content.objetivosCurricularesAdaptados.longoPrazo && (
                        <div className="step-card mb-3 p-3 border border-emerald-200 rounded-lg bg-emerald-50/40">
                          <strong className="text-xs font-bold text-emerald-900 block mb-1">🏆 Metas de Longo Prazo (Ano Letivo):</strong>
                          <ul className="doc-list text-xs text-slate-700">
                            {content.objetivosCurricularesAdaptados.longoPrazo.map((m, i) => <li key={i}>{m}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <ul className="doc-list">
                      {Array.isArray(content.objetivosCurricularesAdaptados)
                        ? content.objetivosCurricularesAdaptados.map((item, i) => <li key={i}>{item}</li>)
                        : <li>{content.objetivosCurricularesAdaptados}</li>}
                    </ul>
                  )}
                </div>
              )}

              {/* 5. Adaptação Detalhada por Habilidade da BNCC */}
              {content.adaptacoesHabilidadesBNCC && Array.isArray(content.adaptacoesHabilidadesBNCC) && content.adaptacoesHabilidadesBNCC.length > 0 && (
                <div className="doc-section">
                  <h3 className="doc-section-title">5. Planejamento de Adaptação por Habilidade da BNCC</h3>
                  <div className="doc-steps">
                    {content.adaptacoesHabilidadesBNCC.map((hab, idx) => (
                      <div key={idx} className="step-card mb-4 p-4 border border-rose-200 rounded-lg bg-rose-50/20">
                        <div className="step-header mb-2 flex items-center justify-between">
                          <span className="step-title font-bold text-rose-900 text-sm">
                            📌 {hab.code}: {hab.descricaoBNCC || ''}
                          </span>
                        </div>
                        <p className="step-desc text-xs text-slate-800 mt-1">
                          <strong>🎯 Objetivo Flexibilizado:</strong> {hab.objetivoAdaptado}
                        </p>
                        <p className="step-desc text-xs text-slate-700 mt-1">
                          <strong>👩‍🏫 Estratégia Didática em Sala:</strong> {hab.estrategiaDidatica}
                        </p>
                        {hab.recursoApoio && (
                          <p className="step-desc text-xs text-rose-700 mt-1">
                            <strong>🛠️ Recurso / Suporte de Apoio:</strong> {hab.recursoApoio}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Estratégias Pedagógicas Especiais na Sala Regular */}
              {content.estrategiasPedagogicasEspeciais && (
                <div className="doc-section">
                  <h3 className="doc-section-title">6. Estratégias Pedagógicas & Rotina em Sala de Aula</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.estrategiasPedagogicasEspeciais)
                      ? content.estrategiasPedagogicasEspeciais.map((item, i) => <li key={i}>{item}</li>)
                      : <li>{content.estrategiasPedagogicasEspeciais}</li>}
                  </ul>
                </div>
              )}

              {/* 7. Tecnologia Assistiva e Acessibilidade */}
              {content.recursosTecnologiaAssistiva && (
                <div className="doc-section">
                  <h3 className="doc-section-title">7. Recursos de Tecnologia Assistiva, CAA & Acessibilidade</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.recursosTecnologiaAssistiva)
                      ? content.recursosTecnologiaAssistiva.map((item, i) => <li key={i}>{item}</li>)
                      : <li>{content.recursosTecnologiaAssistiva}</li>}
                  </ul>
                </div>
              )}

              {/* 8. Plano de Atendimento no AEE */}
              {content.planoAtendimentoAEE && (
                <div className="doc-section" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <h3 className="doc-section-title" style={{ color: '#0f172a' }}>8. Plano de Atendimento na Sala de Recursos (AEE)</h3>
                  <p className="doc-paragraph text-slate-700">{content.planoAtendimentoAEE}</p>
                </div>
              )}

              {/* 9. Flexibilização Avaliativa */}
              {content.flexibilizacaoAvaliativa && (
                <div className="doc-section">
                  <h3 className="doc-section-title">9. Critérios & Flexibilização Avaliativa Processual</h3>
                  <p className="doc-paragraph">{content.flexibilizacaoAvaliativa}</p>
                </div>
              )}

              {/* 10. Ações Integradas com a Família e Terapeutas */}
              {(content.acoesIntegradasFamiliaAEE || content.parceriaFamiliaETerapeutas) && (
                <div className="doc-section doc-section-highlight">
                  <h3 className="doc-section-title">10. Articulação Escola, Família & Terapeutas</h3>
                  <p className="doc-paragraph">{content.acoesIntegradasFamiliaAEE || content.parceriaFamiliaETerapeutas}</p>
                </div>
              )}

              {/* 11. Cronograma de Revisão */}
              {content.cronogramaRevisaoPEI && (
                <div className="doc-section">
                  <h3 className="doc-section-title">11. Cronograma de Monitoramento & Revisão Periódica</h3>
                  <p className="doc-paragraph text-slate-600 font-medium text-xs">{content.cronogramaRevisaoPEI}</p>
                </div>
              )}
            </>
          )}

          {/* Rodapé e Assinaturas */}
          <div className="doc-footer">
            <div className="signatures-grid">
              <div className="sig-line">
                <span>Assinatura do Docente</span>
              </div>
              <div className="sig-line">
                <span>Coordenação Pedagógica / AEE</span>
              </div>
            </div>
            <p className="doc-footer-note">Gerado pelo Edu.Plan • Conforme as diretrizes da BNCC (MEC / SESI)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
