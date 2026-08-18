import React from 'react';
import { Sparkles, FileText, HeartHandshake, ArrowRight, Layers, UserCheck, Calendar, Network } from 'lucide-react';

export default function HeroSection({ onSelectTab }) {
  return (
    <section className="hero-section-podia animate-fade-in">
      <div className="hero-content-podia">
        {/* Pill Badge */}
        <div className="hero-pill-podia">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500 shrink-0" />
          <span>Inteligência Artificial Integrada à BNCC & Matrizes SESI</span>
        </div>

        {/* Título Principal Estilo Podia */}
        <h1 className="hero-title-podia">
          Crie tudo para sua aula. <br />
          <span className="hero-title-highlight">Em segundos, não horas.</span>
        </h1>

        {/* Subtítulo */}
        <p className="hero-subtitle-podia">
          Planos de aula, sequências didáticas, PEIs inclusivos, atividades adaptadas com upload, relatórios de alunos, planos de curso anuais e projetos integradores em um só lugar.
        </p>

        {/* Botão de Ação Direta */}
        <div className="hero-cta-group">
          <button className="btn-podia-hero-black" onClick={() => onSelectTab('lesson-plan')}>
            <span>Criar Plano de Aula Agora</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Grid de Cards de Recursos */}
      <div className="hero-features-grid-podia">
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

        {/* CARD 2: PLANO DE CURSO ANUAL (AZUL CLARO) */}
        <div
          className="podia-feature-card card-blue-subtle"
          onClick={() => onSelectTab('annual-plan')}
        >
          <div className="card-top">
            <span className="card-tag">Plano de Curso Anual ›</span>
            <p className="card-desc">
              Mapeie e distribua todas as 570+ habilidades e conteúdos ao longo dos 4 bimestres do ano.
            </p>
          </div>
          <div className="card-bottom">
            <div className="card-mock-ui">
              <Calendar className="w-5 h-5 mr-2 shrink-0" />
              <span>Ementa dos 4 Bimestres</span>
            </div>
          </div>
        </div>

        {/* CARD 3: PROJETO INTEGRADOR (VERDE ESCURO) */}
        <div
          className="podia-feature-card card-emerald"
          onClick={() => onSelectTab('interdisciplinary-project')}
        >
          <div className="card-top">
            <span className="card-tag">Projeto Integrador ›</span>
            <p className="card-desc">
              Conecte 2 ou mais matérias com pergunta disparadora, cronograma maker e produto final.
            </p>
          </div>
          <div className="card-bottom">
            <div className="card-mock-ui">
              <Network className="w-5 h-5 mr-2 shrink-0" />
              <span>Interdisciplinaridade</span>
            </div>
          </div>
        </div>

        {/* CARD 4: SEQUÊNCIA DIDÁTICA (ROXO PASTEL) */}
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

        {/* CARD 5: PEI INCLUSIVO (OCRE/DOURO PASTEL) */}
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

        {/* CARD 6: RELATÓRIO PEDAGÓGICO (VERDE PASTEL) */}
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
