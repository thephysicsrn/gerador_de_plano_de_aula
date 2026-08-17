import React from 'react';
import { FileText, HeartHandshake, Database, ArrowRight, Layers, UserCheck } from 'lucide-react';

export default function HeroSection({ onSelectTab }) {
  return (
    <section className="hero-podia-section animate-fade-in">
      {/* Título Principal */}
      <div className="hero-podia-header">
        <h1 className="hero-podia-title">
          Edu.Plan — O estúdio completo para seus planejamentos e documentos pedagógicos
        </h1>
        <p className="hero-podia-subtitle">
          Crie planos de aula, sequências didáticas encadeadas, relatórios descritivos e PEIs inclusivos em segundos com Inteligência Artificial.
        </p>
        <div className="hero-cta-group">
          <button className="btn-podia-hero-black" onClick={() => onSelectTab('lesson-plan')}>
            <span>Criar Plano de Aula Agora</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Grid com os Cards de Ação Rápidos da Podia */}
      <div className="podia-cards-grid">
        {/* CARD 1: PLANO DE AULA (AZUL PASTEL) */}
        <div
          className="podia-feature-card card-blue"
          onClick={() => onSelectTab('lesson-plan')}
        >
          <div className="card-top">
            <span className="card-tag">Plano de Aula BNCC ›</span>
            <p className="card-desc">
              Gere objetivos na Taxonomia de Bloom, desenvolvimento passo a passo com tempo, recursos e avaliação.
            </p>
          </div>
          <div className="card-bottom">
            <div className="card-mock-ui">
              <FileText className="w-5 h-5 mr-2 shrink-0" />
              <span>Educação Básica & Ensino Médio</span>
            </div>
          </div>
        </div>

        {/* CARD 2: SEQUÊNCIA DIDÁTICA (ROXO PASTEL) */}
        <div
          className="podia-feature-card card-purple"
          onClick={() => onSelectTab('sequence')}
        >
          <div className="card-top">
            <span className="card-tag">Sequência Didática ›</span>
            <p className="card-desc">
              Crie um plano articulado de 4 a 8 aulas encadeadas para cobrir uma unidade temática inteira.
            </p>
          </div>
          <div className="card-bottom">
            <div className="card-mock-ui">
              <Layers className="w-5 h-5 mr-2 shrink-0" />
              <span>Planejamento de 4 a 8 Aulas</span>
            </div>
          </div>
        </div>

        {/* CARD 3: PEI INCLUSIVO (OCRE/DOURO PASTEL) */}
        <div
          className="podia-feature-card card-ochre"
          onClick={() => onSelectTab('pei')}
        >
          <div className="card-top">
            <span className="card-tag">PEI Inclusivo ›</span>
            <p className="card-desc">
              Adaptações para autismo (TEA), TDAH, deficiências e tecnologias assistivas do AEE.
            </p>
          </div>
          <div className="card-bottom">
            <div className="card-mock-ui">
              <HeartHandshake className="w-5 h-5 mr-2 shrink-0" />
              <span>Atendimento Especializado (AEE)</span>
            </div>
          </div>
        </div>

        {/* CARD 4: RELATÓRIO PEDAGÓGICO (VERDE PASTEL) */}
        <div
          className="podia-feature-card card-teal"
          onClick={() => onSelectTab('report')}
        >
          <div className="card-top">
            <span className="card-tag">Parecer Descritivo ›</span>
            <p className="card-desc">
              Relatórios de acompanhamento do aluno, pareceres descritivos e recomendações para reuniões de pais.
            </p>
          </div>
          <div className="card-bottom">
            <div className="card-mock-ui">
              <UserCheck className="w-5 h-5 mr-2 shrink-0" />
              <span>Acompanhamento Individual</span>
            </div>
          </div>
        </div>

        {/* CARD 5: BASE BNCC & MATRIZ (CINZA/AZUL PASTEL) */}
        <div
          className="podia-feature-card card-blue"
          onClick={() => onSelectTab('bncc')}
        >
          <div className="card-top">
            <span className="card-tag">Base BNCC & Matriz SESI ›</span>
            <p className="card-desc">
              Consulte todas as habilidades oficiais da BNCC e cadastre o conteúdo da matriz própria da escola.
            </p>
          </div>
          <div className="card-bottom">
            <div className="card-mock-ui">
              <Database className="w-5 h-5 mr-2 shrink-0" />
              <span>Matriz Curricular Integrada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
