import React, { useState } from 'react';
import { Download, FileText, Copy, Check, Save, ArrowLeft, Printer } from 'lucide-react';
import { exportToWord, exportToPdf, copyToClipboard } from '../services/exportService';
import { savePlan } from '../utils/storage';

export default function PlanViewer({ plan, onBack, onSaveSuccess, user }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!plan) return null;

  const isPei = plan.isPei || plan.type === 'pei';
  const isSequence = plan.isSequence || plan.type === 'sequence';
  const isReport = plan.isReport || plan.type === 'report';
  const isAdaptedActivity = plan.isAdaptedActivity || plan.type === 'adaptedActivity';
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
      const rawTitle = content.titulo || content.tituloRelatorio || content.tituloAtividade || editableData.conteudoProgramatico || editableData.nomeAluno || 'Documento';
      const cleanTitle = rawTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
      const prefix = isPei ? 'PEI' : (isSequence ? 'Sequencia' : (isReport ? 'Relatorio' : (isAdaptedActivity ? 'Atividade_Adaptada' : 'Plano_Aula')));
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
              {!isPei && !isSequence && !isReport && !isAdaptedActivity && 'PLANO DE AULA / MATRIZ PEDAGÓGICA'}
            </div>
            <h1 className="doc-title">
              {isPei && `PEI: ${editableData.nomeAluno || 'Estudante'}`}
              {isSequence && (content.titulo || `Sequência Didática - ${editableData.disciplina}`)}
              {isReport && (content.tituloRelatorio || `Relatório Pedagógico - ${editableData.nomeAluno}`)}
              {isAdaptedActivity && (content.tituloAtividade || `Atividade Adaptada - ${editableData.disciplina}`)}
              {!isPei && !isSequence && !isReport && !isAdaptedActivity && (content.titulo || `Plano de Aula - ${editableData.disciplina}`)}
            </h1>
            <p className="doc-subtitle">Base Curricular & Diretrizes Nacionais de Educação (MEC / BNCC / SESI)</p>
          </div>

          {/* Tabela de Metadados */}
          <div className="doc-meta-grid">
            {isAdaptedActivity ? (
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
                        <div className="step-header mb-2">
                          <span className="step-title font-bold text-slate-900">{q.numero}</span>
                        </div>
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
            </>
          )}

          {/* CONTEÚDO DO PLANO DE AULA PADRÃO */}
          {!isPei && !isSequence && !isReport && !isAdaptedActivity && (
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

          {/* CONTEÚDO DO PEI */}
          {isPei && (
            <>
              {content.perfilAluno && (
                <div className="doc-section">
                  <h3 className="doc-section-title">1. Perfil e Potencialidades do Estudante</h3>
                  <p className="doc-paragraph">{content.perfilAluno}</p>
                </div>
              )}

              {content.objetivosCurricularesAdaptados && (
                <div className="doc-section">
                  <h3 className="doc-section-title">2. Objetivos Curriculares Adaptados</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.objetivosCurricularesAdaptados)
                      ? content.objetivosCurricularesAdaptados.map((item, i) => <li key={i}>{item}</li>)
                      : <li>{content.objetivosCurricularesAdaptados}</li>}
                  </ul>
                </div>
              )}

              {content.estrategiasPedagogicasEspeciais && (
                <div className="doc-section">
                  <h3 className="doc-section-title">3. Estratégias Pedagógicas Diferenciadas</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.estrategiasPedagogicasEspeciais)
                      ? content.estrategiasPedagogicasEspeciais.map((item, i) => <li key={i}>{item}</li>)
                      : <li>{content.estrategiasPedagogicasEspeciais}</li>}
                  </ul>
                </div>
              )}

              {content.recursosTecnologiaAssistiva && (
                <div className="doc-section">
                  <h3 className="doc-section-title">4. Recursos de Acessibilidade e Tecnologia Assistiva</h3>
                  <ul className="doc-list">
                    {Array.isArray(content.recursosTecnologiaAssistiva)
                      ? content.recursosTecnologiaAssistiva.map((item, i) => <li key={i}>{item}</li>)
                      : <li>{content.recursosTecnologiaAssistiva}</li>}
                  </ul>
                </div>
              )}

              {content.flexibilizacaoAvaliativa && (
                <div className="doc-section">
                  <h3 className="doc-section-title">5. Critérios e Flexibilização Avaliativa</h3>
                  <p className="doc-paragraph">{content.flexibilizacaoAvaliativa}</p>
                </div>
              )}

              {content.acoesIntegradasFamiliaAEE && (
                <div className="doc-section doc-section-highlight">
                  <h3 className="doc-section-title">6. Parceria Família & Equipe de AEE</h3>
                  <p className="doc-paragraph">{content.acoesIntegradasFamiliaAEE}</p>
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
