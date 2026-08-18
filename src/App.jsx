import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LessonPlanForm from './components/LessonPlanForm';
import PeiForm from './components/PeiForm';
import DidacticSequenceForm from './components/DidacticSequenceForm';
import PedagogicalReportForm from './components/PedagogicalReportForm';
import AdaptedActivityForm from './components/AdaptedActivityForm';
import AnnualCoursePlanForm from './components/AnnualCoursePlanForm';
import InterdisciplinaryProjectForm from './components/InterdisciplinaryProjectForm';
import PlanViewer from './components/PlanViewer';
import BnccExplorer from './components/BnccExplorer';
import SavedPlansList from './components/SavedPlansList';
import ApiKeyModal from './components/ApiKeyModal';
import PublicLandingPage from './components/PublicLandingPage';
import Footer from './components/Footer';

import { 
  generateLessonPlanWithAI, 
  generatePeiWithAI, 
  generateDidacticSequenceWithAI,
  generatePedagogicalReportWithAI,
  generateAdaptedActivityWithAI,
  generateAnnualCoursePlanWithAI,
  generateInterdisciplinaryProjectWithAI,
  generateMockLessonPlan, 
  generateMockPei,
  generateMockDidacticSequence,
  generateMockPedagogicalReport,
  generateMockAdaptedActivity,
  generateMockAnnualCoursePlan,
  generateMockInterdisciplinaryProject
} from './services/deepseekService';
import { getStoredApiKey, getStoredGeminiKey } from './utils/storage';
import { getStoredSessionUser, logoutUser, auth, updateUserRedeEnsino } from './services/firebaseService';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(() => getStoredSessionUser());
  const [activeTab, setActiveTab] = useState('hero');
  const [darkMode, setDarkMode] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(!!(getStoredApiKey() || getStoredGeminiKey()));

  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Escutar estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const stored = getStoredSessionUser();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          redeEnsino: stored?.redeEnsino || 'REDE_SESI',
          isDemo: false
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setApiKeyConfigured(!!(getStoredApiKey() || getStoredGeminiKey()));
  }, [isApiKeyModalOpen]);

  // Alternar tema no body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setActiveTab('hero');
    setGeneratedPlan(null);
  };

  const handleToggleRedeEnsino = () => {
    const nextRede = user?.redeEnsino === 'REDE_SESI' ? 'OUTRA_REDE' : 'REDE_SESI';
    const updated = updateUserRedeEnsino(nextRede);
    setUser(updated || { ...user, redeEnsino: nextRede });
  };

  // Handler de Geração de Plano de Aula
  const handleGenerateLessonPlan = async (formData, useAi = true) => {
    setIsLoading(true);
    try {
      let result;
      if (useAi && (getStoredApiKey() || getStoredGeminiKey())) {
        result = await generateLessonPlanWithAI(formData);
      } else {
        result = generateMockLessonPlan(formData);
      }

      setGeneratedPlan({
        ...formData,
        content: result
      });
    } catch (err) {
      console.error('Erro na geração:', err);
      alert(err.message || 'Erro ao gerar o plano de aula.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler de Geração de PEI
  const handleGeneratePei = async (formData, useAi = true) => {
    setIsLoading(true);
    try {
      let result;
      if (useAi && (getStoredApiKey() || getStoredGeminiKey())) {
        result = await generatePeiWithAI(formData);
      } else {
        result = generateMockPei(formData);
      }

      setGeneratedPlan({
        ...formData,
        content: result
      });
    } catch (err) {
      console.error('Erro na geração do PEI:', err);
      alert(err.message || 'Erro ao gerar o PEI.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler de Geração de Sequência Didática
  const handleGenerateDidacticSequence = async (formData, useAi = true) => {
    setIsLoading(true);
    try {
      let result;
      if (useAi && (getStoredApiKey() || getStoredGeminiKey())) {
        result = await generateDidacticSequenceWithAI(formData);
      } else {
        result = generateMockDidacticSequence(formData);
      }

      setGeneratedPlan({
        ...formData,
        content: result
      });
    } catch (err) {
      console.error('Erro na geração da Sequência Didática:', err);
      alert(err.message || 'Erro ao gerar a Sequência Didática.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler de Geração de Relatório Pedagógico / Parecer
  const handleGeneratePedagogicalReport = async (formData, useAi = true) => {
    setIsLoading(true);
    try {
      let result;
      if (useAi && (getStoredApiKey() || getStoredGeminiKey())) {
        result = await generatePedagogicalReportWithAI(formData);
      } else {
        result = generateMockPedagogicalReport(formData);
      }

      setGeneratedPlan({
        ...formData,
        content: result
      });
    } catch (err) {
      console.error('Erro na geração do Relatório Pedagógico:', err);
      alert(err.message || 'Erro ao gerar o Relatório Pedagógico.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler de Geração de Atividade Adaptada
  const handleGenerateAdaptedActivity = async (formData, useAi = true) => {
    setIsLoading(true);
    try {
      let result;
      if (useAi && (getStoredApiKey() || getStoredGeminiKey())) {
        result = await generateAdaptedActivityWithAI(formData);
      } else {
        result = generateMockAdaptedActivity(formData);
      }

      setGeneratedPlan({
        ...formData,
        content: result
      });
    } catch (err) {
      console.error('Erro na geração da Atividade Adaptada:', err);
      alert(err.message || 'Erro ao gerar a Atividade Adaptada.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler de Geração de Plano de Curso Anual
  const handleGenerateAnnualCoursePlan = async (formData, useAi = true) => {
    setIsLoading(true);
    try {
      let result;
      if (useAi && (getStoredApiKey() || getStoredGeminiKey())) {
        result = await generateAnnualCoursePlanWithAI(formData);
      } else {
        result = generateMockAnnualCoursePlan(formData);
      }

      setGeneratedPlan({
        ...formData,
        content: result
      });
    } catch (err) {
      console.error('Erro na geração do Plano Anual:', err);
      alert(err.message || 'Erro ao gerar o Plano Anual.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler de Geração de Projeto Interdisciplinar
  const handleGenerateInterdisciplinaryProject = async (formData, useAi = true) => {
    setIsLoading(true);
    try {
      let result;
      if (useAi && (getStoredApiKey() || getStoredGeminiKey())) {
        result = await generateInterdisciplinaryProjectWithAI(formData);
      } else {
        result = generateMockInterdisciplinaryProject(formData);
      }

      setGeneratedPlan({
        ...formData,
        content: result
      });
    } catch (err) {
      console.error('Erro na geração do Projeto Integrador:', err);
      alert(err.message || 'Erro ao gerar o Projeto Integrador.');
    } finally {
      setIsLoading(false);
    }
  };

  // Selecionar plano do histórico
  const handleSelectSavedPlan = (plan) => {
    setGeneratedPlan(plan);
  };

  // Se o usuário NÃO estiver autenticado, exibe a Landing Page Pública
  if (!user) {
    return (
      <PublicLandingPage
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setActiveTab('hero');
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  // Se estiver AUTENTICADO, exibe a Aplicação Studio Completa
  return (
    <div className="app-layout">
      {/* Formas Geométricas Flutuantes Estilo Podia */}
      <div className="podia-shape podia-shape-1"></div>
      <div className="podia-shape podia-shape-2"></div>
      <div className="podia-shape podia-shape-3"></div>

      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'viewer') setGeneratedPlan(null);
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        apiKeyConfigured={apiKeyConfigured}
        user={user}
        onLogout={handleLogout}
        onToggleRedeEnsino={handleToggleRedeEnsino}
      />

      <main className="main-content">
        {/* Se houver um plano gerado / visualização ativa */}
        {generatedPlan ? (
          <PlanViewer
            plan={generatedPlan}
            onBack={() => setGeneratedPlan(null)}
            onSaveSuccess={() => {}}
            user={user}
          />
        ) : (
          <>
            {activeTab === 'hero' && (
              <HeroSection onSelectTab={(tab) => {
                setGeneratedPlan(null);
                setActiveTab(tab);
              }} />
            )}

            {activeTab === 'lesson-plan' && (
              <LessonPlanForm
                onGenerate={handleGenerateLessonPlan}
                isLoading={isLoading}
                apiKeyConfigured={apiKeyConfigured}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                user={user}
              />
            )}

            {activeTab === 'annual-plan' && (
              <AnnualCoursePlanForm
                onGenerate={handleGenerateAnnualCoursePlan}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'interdisciplinary-project' && (
              <InterdisciplinaryProjectForm
                onGenerate={handleGenerateInterdisciplinaryProject}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'sequence' && (
              <DidacticSequenceForm
                onGenerate={handleGenerateDidacticSequence}
                isLoading={isLoading}
                user={user}
              />
            )}

            {activeTab === 'pei' && (
              <PeiForm
                onGenerate={handleGeneratePei}
                isLoading={isLoading}
                apiKeyConfigured={apiKeyConfigured}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                user={user}
              />
            )}

            {activeTab === 'adapted-activity' && (
              <AdaptedActivityForm
                onGenerate={handleGenerateAdaptedActivity}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'report' && (
              <PedagogicalReportForm
                onGenerate={handleGeneratePedagogicalReport}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'bncc' && (
              <BnccExplorer user={user} />
            )}

            {activeTab === 'history' && (
              <SavedPlansList
                onSelectPlan={handleSelectSavedPlan}
                user={user}
              />
            )}
          </>
        )}
      </main>

      {/* Modal da Chave de API DeepSeek */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={() => setApiKeyConfigured(!!(getStoredApiKey() || getStoredGeminiKey()))}
      />

      {/* Rodapé Oficial Edu.Plan */}
      <Footer />
    </div>
  );
}
