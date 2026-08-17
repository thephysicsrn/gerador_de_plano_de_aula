import React, { useState, useEffect } from 'react';
import { Download, FileText, Copy, Printer, Save, Check, ArrowLeft } from 'lucide-react';
import { exportToWord, exportToPdf, copyToClipboard } from '../services/exportService';
import { savePlan } from '../utils/storage';

export default function PlanViewer({ plan, onBack, onSaveSuccess, user }) {
  const [editableData, setEditableData] = useState(plan);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setEditableData(plan);
    setSaved(false);
  }, [plan]);

  if (!editableData) return null;

  const isPei = editableData.type === 'PEI';
  const content = editableData.content || editableData;

  const handleFieldChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      content: {
        ...(prev.content || prev),
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    const userIdentifier = user?.uid || user?.email || 'guest';
    savePlan(editableData, userIdentifier);
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
      const rawTitle = content.titulo || editableData.conteudoProgramatico || editableData.nomeAluno || 'Documento';
      const cleanTitle = rawTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
      const filename = `${isPei ? 'PEI' : 'Plano_Aula'}_${cleanTitle}.pdf`;
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
              {isPei ? 'PLANO DE ENSINO INDIVIDUALIZADO (PEI)' : 'PLANO DE AULA / MATRIZ PEDAGÓGICA'}
            </div>
            <h1 className="doc-title">
              {isPei 
                ? `PEI: ${editableData.nomeAluno || 'Estudante'}` 
                : (content.titulo || `Plano de Aula - ${editableData.disciplina}`)}
            </h1>
            <p className="doc-subtitle">Base Curricular & Diretrizes Nacionais de Educação</p>
          </div>

          {/* Tabela de Metadados */}
          <div className="doc-meta-grid">
            {!isPei ? (
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

          {/* Seção Habilidades BNCC Detalhadas */}
          {((editableData.habilidadesBNCC && editableData.habilidadesBNCC.length > 0) ||
            (editableData.habilidadesBNCCAlvo && editableData.habilidadesBNCCAlvo.length > 0)) && (
            <div className="doc-section">
              <h3 className="doc-section-title">Habilidades da BNCC Mobilizadas</h3>
              <div className="doc-bncc-box">
                {(content.habilidadesDetalhadas && Array.isArray(content.habilidadesDetalhadas)) ? (
                  content.habilidadesDetalhadas.map((item, idx) => (
                    <div key={idx} className="doc-bncc-item-detailed mb-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="doc-bncc-code font-bold bg-slate-900 text-white px-2 py-0.5 rounded text-xs">{item.code}</span>
                        {item.descricaoOficial && <span className="text-xs text-slate-600 dark:text-slate-400 italic">{item.descricaoOficial}</span>}
                      </div>
                      {item.detalhamento && (
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 pl-2 border-l-2 border-slate-400">
                          <strong>Mediação Pedagógica:</strong> {item.detalhamento}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  (editableData.habilidadesBNCC || editableData.habilidadesBNCCAlvo).map(skill => (
                    <div key={skill.code} className="doc-bncc-item">
                      <span className="doc-bncc-code">{skill.code}</span>
                      <span className="doc-bncc-text">{skill.description}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Conteúdo Dinâmico do Plano de Aula */}
          {!isPei && (
            <>
              {/* Objetivo Geral */}
              {content.objetivoGeral && (
                <div className="doc-section">
                  <h3 className="doc-section-title">1. Objetivo Geral</h3>
                  <p className="doc-paragraph">{content.objetivoGeral}</p>
                </div>
              )}

              {/* Objetivos Específicos */}
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

              {/* Passo a Passo Metodológico */}
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

              {/* Estratégia Metodológica */}
              {content.estrategiaMetodologica && (
                <div className="doc-section">
                  <h3 className="doc-section-title">4. Estratégia e Recursos Metodológicos</h3>
                  <p className="doc-paragraph">{content.estrategiaMetodologica}</p>
                </div>
              )}

              {/* Recursos Didáticos */}
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

              {/* Avaliação Formativa */}
              {content.avaliacaoFormativa && (
                <div className="doc-section">
                  <h3 className="doc-section-title">6. Avaliação Formativa</h3>
                  <p className="doc-paragraph">{content.avaliacaoFormativa}</p>
                </div>
              )}

              {/* Atividades de Fixação */}
              {content.atividadesFixacao && (
                <div className="doc-section">
                  <h3 className="doc-section-title">7. Atividades de Fixação / Tarefa</h3>
                  <p className="doc-paragraph">{content.atividadesFixacao}</p>
                </div>
              )}

              {/* Adaptação Inclusiva */}
              {content.adaptacaoInclusiva && (
                <div className="doc-section doc-section-highlight">
                  <h3 className="doc-section-title">8. Dica de Acessibilidade / Inclusão</h3>
                  <p className="doc-paragraph">{content.adaptacaoInclusiva}</p>
                </div>
              )}
            </>
          )}

          {/* Conteúdo Dinâmico do PEI */}
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
            <p className="doc-footer-note">Gerado pelo Edu.Plan • Conforme as diretrizes da BNCC (MEC)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
