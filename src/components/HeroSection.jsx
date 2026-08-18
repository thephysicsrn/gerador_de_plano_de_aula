import React from 'react';
import { 
  Sparkles, 
  FileText, 
  HeartHandshake, 
  ArrowRight, 
  Layers, 
  UserCheck, 
  Calendar, 
  Network, 
  Database, 
  Accessibility 
} from 'lucide-react';

export default function HeroSection({ onSelectTab }) {
  return (
    <section className="hero-section-podia animate-fade-in">
      {/* CABEÇALHO DO DASHBOARD */}
      <div className="hero-content-podia">
        <div className="hero-pill-podia">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500 shrink-0" />
          <span>Inteligência Artificial Integrada à BNCC & Matrizes SESI</span>
        </div>

        <h1 className="hero-title-podia">
          Estúdio Pedagógico Inteligente. <br />
          <span className="hero-title-highlight">O que você deseja criar hoje?</span>
        </h1>

        <p className="hero-subtitle-podia">
          Escolha uma ferramenta abaixo para gerar planos de aula, sequências didáticas, PEIs inclusivos, atividades adaptadas ou pareceres em segundos.
        </p>
      </div>

      {/* SEÇÃO 1: PLANEJAMENTO & METODOLOGIAS */}
      <div className="dashboard-category-block">
        <div className="category-header-podia">
          <FileText className="w-5 h-5 text-blue-500 mr-2 shrink-0" />
          <h2 className="category-title-podia">Planejamento de Ensino & Metodologias</h2>
        </div>

        <div className="hero-features-grid-podia">
          {/* CARD 1: PLANO DE AULA */}
          <div
            className="podia-feature-card card-blue"
            onClick={() => onSelectTab('lesson-plan')}
          >
            <div className="card-top">
              <span className="card-tag">Plano de Aula BNCC ›</span>
              <p className="card-desc">
                Objetivos na Taxonomia de Bloom, minutagem passo a passo, recursos e avaliação.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <FileText className="w-5 h-5 mr-2 shrink-0 text-blue-700 dark:text-blue-300" />
                <span>Educação Básica & Ensino Médio</span>
              </div>
            </div>
          </div>

          {/* CARD 2: PLANO ANUAL */}
          <div
            className="podia-feature-card card-blue-subtle"
            onClick={() => onSelectTab('annual-plan')}
          >
            <div className="card-top">
              <span className="card-tag">Plano de Curso Anual ›</span>
              <p className="card-desc">
                Mapeamento e ementa curricular distribuídos ao longo dos 4 bimestres do ano.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <Calendar className="w-5 h-5 mr-2 shrink-0 text-indigo-700 dark:text-indigo-300" />
                <span>Ementa dos 4 Bimestres</span>
              </div>
            </div>
          </div>

          {/* CARD 3: SEQUÊNCIA DIDÁTICA */}
          <div
            className="podia-feature-card card-purple"
            onClick={() => onSelectTab('sequence')}
          >
            <div className="card-top">
              <span className="card-tag">Sequência Didática ›</span>
              <p className="card-desc">
                Planejamento articulado de 4 a 8 aulas encadeadas para cobrir uma unidade inteira.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <Layers className="w-5 h-5 mr-2 shrink-0 text-purple-700 dark:text-purple-300" />
                <span>Sequência de 4 a 8 Aulas</span>
              </div>
            </div>
          </div>

          {/* CARD 4: PROJETO INTEGRADOR */}
          <div
            className="podia-feature-card card-emerald"
            onClick={() => onSelectTab('interdisciplinary-project')}
          >
            <div className="card-top">
              <span className="card-tag">Projeto Integrador ›</span>
              <p className="card-desc">
                Articulação de 2 ou mais disciplinas com pergunta disparadora e produto final maker.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <Network className="w-5 h-5 mr-2 shrink-0 text-emerald-700 dark:text-emerald-300" />
                <span>Interdisciplinaridade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: EDUCAÇÃO INCLUSIVA & AEE */}
      <div className="dashboard-category-block mt-8">
        <div className="category-header-podia">
          <HeartHandshake className="w-5 h-5 text-rose-500 mr-2 shrink-0" />
          <h2 className="category-title-podia">Educação Inclusiva & Atendimento Especializado (AEE)</h2>
        </div>

        <div className="hero-features-grid-podia grid-cols-2">
          {/* CARD PEI INCLUSIVO */}
          <div
            className="podia-feature-card card-ochre"
            onClick={() => onSelectTab('pei')}
          >
            <div className="card-top">
              <span className="card-tag">PEI Inclusivo ›</span>
              <p className="card-desc">
                Plano Individualizado para Autismo (TEA), TDAH, deficiências e recursos do AEE.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <HeartHandshake className="w-5 h-5 mr-2 shrink-0 text-amber-800 dark:text-amber-200" />
                <span>Plano Individualizado (PEI)</span>
              </div>
            </div>
          </div>

          {/* CARD ATIVIDADE ADAPTADA */}
          <div
            className="podia-feature-card card-rose"
            onClick={() => onSelectTab('adapted-activity')}
          >
            <div className="card-top">
              <span className="card-tag">Atividade Adaptada com Upload ›</span>
              <p className="card-desc">
                Cole o texto ou envie arquivos (PDF/Word) para gerar versões acessíveis em 2 minutos.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <Accessibility className="w-5 h-5 mr-2 shrink-0 text-rose-800 dark:text-rose-200" />
                <span>Adaptação por PDF / TXT / Word</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: AVALIAÇÃO & BASE CURRICULAR */}
      <div className="dashboard-category-block mt-8">
        <div className="category-header-podia">
          <UserCheck className="w-5 h-5 text-teal-500 mr-2 shrink-0" />
          <h2 className="category-title-podia">Relatórios, Pareceres & Matrizes Curriculares</h2>
        </div>

        <div className="hero-features-grid-podia grid-cols-2">
          {/* CARD PARECER DESCRITIVO */}
          <div
            className="podia-feature-card card-teal"
            onClick={() => onSelectTab('report')}
          >
            <div className="card-top">
              <span className="card-tag">Parecer Descritivo do Aluno ›</span>
              <p className="card-desc">
                Relatórios de acompanhamento individual, aspectos socioemocionais e reuniões de pais.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <UserCheck className="w-5 h-5 mr-2 shrink-0 text-teal-800 dark:text-teal-200" />
                <span>Relatório Pedagógico</span>
              </div>
            </div>
          </div>

          {/* CARD BASE BNCC */}
          <div
            className="podia-feature-card card-blue-subtle"
            onClick={() => onSelectTab('bncc')}
          >
            <div className="card-top">
              <span className="card-tag">Explorador BNCC & Matriz SESI ›</span>
              <p className="card-desc">
                Busca rápida de 570+ habilidades e cadastro de conteúdos específicos da sua escola.
              </p>
            </div>
            <div className="card-bottom">
              <div className="card-mock-ui">
                <Database className="w-5 h-5 mr-2 shrink-0 text-indigo-700 dark:text-indigo-300" />
                <span>Base BNCC & Redes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
