import React, { useState } from 'react';
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
  Accessibility,
  Search,
  CheckCircle2,
  Plus
} from 'lucide-react';

export default function HeroSection({ onSelectTab }) {
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'planning' | 'inclusion' | 'reports'

  // Lista de todas as 8 ferramentas organizadas
  const tools = [
    {
      id: 'lesson-plan',
      title: 'Plano de Aula BNCC',
      category: 'planning',
      categoryLabel: 'Planejamento',
      desc: 'Elabore planos individuais com Taxonomia de Bloom, minutagem, recursos e critérios de avaliação.',
      badgeColor: 'badge-blue',
      icon: FileText,
      tag: 'BNCC & SESI'
    },
    {
      id: 'annual-plan',
      title: 'Plano de Curso Anual',
      category: 'planning',
      categoryLabel: 'Planejamento',
      desc: 'Mapeie e distribua as 570+ habilidades e conteúdos essenciais ao longo dos 4 bimestres letivos.',
      badgeColor: 'badge-indigo',
      icon: Calendar,
      tag: 'Ementa Anual'
    },
    {
      id: 'sequence',
      title: 'Sequência Didática',
      category: 'planning',
      categoryLabel: 'Planejamento',
      desc: 'Crie um plano articulado de 4 a 8 aulas encadeadas para cobrir uma unidade temática inteira.',
      badgeColor: 'badge-purple',
      icon: Layers,
      tag: '4 a 8 Aulas'
    },
    {
      id: 'interdisciplinary-project',
      title: 'Projeto Integrador',
      category: 'planning',
      categoryLabel: 'Planejamento',
      desc: 'Conecte 2 ou mais matérias com pergunta disparadora, cronograma maker e produto final.',
      badgeColor: 'badge-emerald',
      icon: Network,
      tag: 'Interdisciplinar'
    },
    {
      id: 'pei',
      title: 'PEI Inclusivo',
      category: 'inclusion',
      categoryLabel: 'Inclusão & AEE',
      desc: 'Plano de Ensino Individualizado para autismo (TEA), TDAH, deficiências e tecnologias assistivas.',
      badgeColor: 'badge-amber',
      icon: HeartHandshake,
      tag: 'Educação Inclusiva'
    },
    {
      id: 'adapted-activity',
      title: 'Atividade Adaptada',
      category: 'inclusion',
      categoryLabel: 'Inclusão & AEE',
      desc: 'Cole o texto ou faça upload de arquivos (PDF/Word) para gerar exercícios acessíveis em 2 minutos.',
      badgeColor: 'badge-rose',
      icon: Accessibility,
      tag: 'Upload PDF / Word'
    },
    {
      id: 'report',
      title: 'Parecer Descritivo',
      category: 'reports',
      categoryLabel: 'Relatórios',
      desc: 'Relatório pedagógico de acompanhamento individual do aluno e recomendações para reuniões de pais.',
      badgeColor: 'badge-teal',
      icon: UserCheck,
      tag: 'Acompanhamento'
    },
    {
      id: 'bncc',
      title: 'Explorador BNCC & SESI',
      category: 'reports',
      categoryLabel: 'Consulta',
      desc: 'Busca rápida nas 570+ habilidades oficiais da BNCC e cadastro de conteúdos específicos da escola.',
      badgeColor: 'badge-sky',
      icon: Database,
      tag: 'Matriz Curricular'
    }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(t => t.category === selectedCategory);

  return (
    <div className="dashboard-studio-container animate-fade-in">
      {/* BANNER DE BOAS-VINDAS CENTRADO E ELEGANTE */}
      <div className="dashboard-hero-banner">
        <div className="hero-pill-podia">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500 shrink-0" />
          <span>Estúdio Pedagógico com IA Integrado à BNCC & SESI</span>
        </div>

        <h1 className="dashboard-hero-title">
          O que você vamos criar hoje?
        </h1>
        <p className="dashboard-hero-subtitle">
          Selecione uma das ferramentas pedagógicas abaixo para iniciar seu documento com Inteligência Artificial.
        </p>

        {/* BARRA DE FILTROS POR CATEGORIA */}
        <div className="dashboard-filter-bar">
          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <span>Todos os Recursos ({tools.length})</span>
          </button>

          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'planning' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('planning')}
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-500 inline" />
            <span>Planejamento ({tools.filter(t => t.category === 'planning').length})</span>
          </button>

          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'inclusion' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('inclusion')}
          >
            <HeartHandshake className="w-3.5 h-3.5 mr-1.5 text-rose-500 inline" />
            <span>Inclusão & AEE ({tools.filter(t => t.category === 'inclusion').length})</span>
          </button>

          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'reports' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('reports')}
          >
            <UserCheck className="w-3.5 h-3.5 mr-1.5 text-teal-500 inline" />
            <span>Relatórios & BNCC ({tools.filter(t => t.category === 'reports').length})</span>
          </button>
        </div>
      </div>

      {/* GRID SIMÉTRICO E ORGANIZADO DE FERRAMENTAS */}
      <div className="dashboard-tools-grid">
        {filteredTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <div
              key={tool.id}
              className="studio-tool-card group"
              onClick={() => onSelectTab(tool.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectTab(tool.id);
                }
              }}
            >
              {/* Topo do Card: Ícone Colorido + Tag */}
              <div className="tool-card-header">
                <div className={`tool-icon-badge ${tool.badgeColor}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="tool-tag-pill">{tool.tag}</span>
              </div>

              {/* Corpo do Card: Título e Descrição */}
              <div className="tool-card-body">
                <h3 className="tool-card-title">{tool.title}</h3>
                <p className="tool-card-desc">{tool.desc}</p>
              </div>

              {/* Rodapé do Card: Ação Limpa com Seta */}
              <div className="tool-card-footer">
                <button
                  type="button"
                  className="tool-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTab(tool.id);
                  }}
                >
                  <span>Criar Agora</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
