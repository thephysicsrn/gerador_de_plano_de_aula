// Gerenciador de Armazenamento Local (LocalStorage) por Conta de Professor

const STORAGE_KEYS = {
  API_KEY: 'gerador_planos_deepseek_api_key',
  GEMINI_KEY: 'gerador_planos_gemini_api_key',
  SAVED_PLANS: 'gerador_planos_saved_items',
  CUSTOM_CURRICULUM: 'gerador_planos_custom_curriculum'
};

// --- API KEY DEEPSEEK ---
export const getStoredApiKey = () => {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || (import.meta.env.VITE_DEEPSEEK_API_KEY || '');
};

export const setStoredApiKey = (key) => {
  if (key) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  }
};

// --- API KEY GOOGLE GEMINI (GRATUITA) ---
export const getStoredGeminiKey = () => {
  return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || (import.meta.env.VITE_GEMINI_API_KEY || '');
};

export const setStoredGeminiKey = (key) => {
  if (key) {
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
  }
};

// --- PLANOS GUARDADOS POR CONTA DE PROFESSOR ---
export const getSavedPlans = (userId = '') => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_PLANS);
    const plans = data ? JSON.parse(data) : [];
    if (userId) {
      // Filtrar planos da conta do professor logado ou sem dono
      return plans.filter(p => !p.userId || p.userId === userId);
    }
    return plans;
  } catch (err) {
    console.error('Erro ao carregar planos salvos:', err);
    return [];
  }
};

export const savePlan = (plan, userId = '') => {
  try {
    const plans = getSavedPlans();
    const existingIndex = plans.findIndex(p => p.id === plan.id);
    
    const updatedPlan = {
      ...plan,
      userId: userId || plan.userId || '',
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      plans[existingIndex] = updatedPlan;
    } else {
      plans.unshift({
        ...updatedPlan,
        id: plan.id || 'plan_' + Date.now(),
        createdAt: new Date().toISOString()
      });
    }

    localStorage.setItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(plans));
    return updatedPlan;
  } catch (err) {
    console.error('Erro ao salvar plano:', err);
    throw new Error('Falha ao salvar no armazenamento local.');
  }
};

export const deletePlan = (planId, userId = '') => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_PLANS);
    let plans = data ? JSON.parse(data) : [];
    plans = plans.filter(p => p.id !== planId);
    localStorage.setItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(plans));
    if (userId) {
      return plans.filter(p => !p.userId || p.userId === userId);
    }
    return plans;
  } catch (err) {
    console.error('Erro ao deletar plano:', err);
    return [];
  }
};

// --- MATRIZ CURRICULAR DA ESCOLA (CUSTOM) ---
export const getCustomCurriculum = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_CURRICULUM);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const saveCustomSkill = (skill) => {
  const items = getCustomCurriculum();
  const newItem = {
    ...skill,
    id: 'custom_' + Date.now(),
    isCustom: true
  };
  items.unshift(newItem);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CURRICULUM, JSON.stringify(items));
  return items;
};

export const deleteCustomSkill = (id) => {
  const items = getCustomCurriculum().filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CURRICULUM, JSON.stringify(items));
  return items;
};
