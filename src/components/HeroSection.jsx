import React from 'react';
import { FileText, HeartHandshake, Database, ArrowRight } from 'lucide-react';

export default function HeroSection({ onSelectTab }) {
  return (
    <section className="hero-podia-section animate-fade-in">
      {/* Título Principal */}
      <div className="hero-podia-header">
        <h1 className="hero-podia-title">
          Edu.Plan — O sistema completo para seus planos de aula e PEI
        </h1>
        <p className="hero-podia-subtitle">
          Crie, personalize e exporte planos de aula alinhados à BNCC e Planos de Ensino Individualizados em segundos com inteligência artificial.
        </p>
        <div className="hero-cta-group">
          <button className="btn-podia-hero-black" onClick={() => onSelectTab('lesson-plan')}>
            <span>Criar Plano de Aula Agora</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Grid com os 3 Cards de Cores da Podia */}
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

        {/* CARD 2: PEI INCLUSIVO (OCRE/DOURO PASTEL) */}
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

        {/* CARD 3: BASE BNCC & MATRIZ (ROXO/LAVANDA PASTEL) */}
        <div
          className="podia-feature-card card-purple"
          onClick={() => onSelectTab('bncc')}
        >
          <div className="card-top">
            <span className="card-tag">Base BNCC & Matriz ›</span>
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
