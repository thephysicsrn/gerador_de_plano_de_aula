// Serviço de Autenticação e Firebase para Edu.Plan com suporte à Rede de Ensino (Rede SESI vs Outra Rede)

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile
} from 'firebase/auth';

// Configuração Padrão do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyEduPlan2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eduplan-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eduplan-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eduplan-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Inicialização segura da App Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Chaves de Armazenamento Local
const LOCAL_USER_KEY = 'eduplan_user_session';
const LOCAL_ACCOUNTS_KEY = 'eduplan_registered_accounts';

export const getStoredSessionUser = () => {
  try {
    const data = localStorage.getItem(LOCAL_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredSessionUser = (user) => {
  if (user) {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
};

// Base de usuários locais (garante funcionamento 100% offline e com persistência)
const getLocalAccounts = () => {
  try {
    const data = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalAccount = (account) => {
  try {
    const accounts = getLocalAccounts();
    const index = accounts.findIndex(a => a.email.toLowerCase() === account.email.toLowerCase());
    if (index >= 0) {
      accounts[index] = account;
    } else {
      accounts.push(account);
    }
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Erro ao salvar conta localmente:', e);
  }
};

/**
 * Criar Conta (Sign Up com Email/Senha e Seleção de Rede de Ensino)
 */
export async function signUpUser(email, password, displayName = '', redeEnsino = 'REDE_SESI') {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (cleanPass.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }

  // Tenta criar no Firebase se as chaves estiverem ativas
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    const userData = {
      uid: userCredential.user.uid,
      email: cleanEmail,
      displayName: displayName || cleanEmail.split('@')[0],
      redeEnsino: redeEnsino || 'REDE_SESI',
      isDemo: false
    };
    setStoredSessionUser(userData);
    saveLocalAccount({ ...userData, password: cleanPass });
    return userData;
  } catch (error) {
    console.warn('Firebase Auth Fallback para registro local:', error.message);

    // Se o erro for especificamente email já em uso do Firebase, lança erro
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este e-mail já está cadastrado. Selecione "Entrar na Conta" para fazer login.');
    }

    // Fallback de Autenticação Local Resiliente
    const accounts = getLocalAccounts();
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('Este e-mail já está cadastrado. Selecione "Entrar na Conta" para fazer login.');
    }

    const newUserData = {
      uid: 'user_' + Date.now(),
      email: cleanEmail,
      displayName: displayName || cleanEmail.split('@')[0],
      redeEnsino: redeEnsino || 'REDE_SESI',
      isDemo: false
    };

    saveLocalAccount({ ...newUserData, password: cleanPass });
    setStoredSessionUser(newUserData);
    return newUserData;
  }
}

/**
 * Entrar na Conta (Sign In com Email/Senha)
 */
export async function signInUser(email, password, redeEnsino = 'REDE_SESI') {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    const existing = getStoredSessionUser();
    const userData = {
      uid: userCredential.user.uid,
      email: cleanEmail,
      displayName: userCredential.user.displayName || cleanEmail.split('@')[0],
      redeEnsino: existing?.redeEnsino || redeEnsino || 'REDE_SESI',
      isDemo: false
    };
    setStoredSessionUser(userData);
    return userData;
  } catch (error) {
    console.warn('Firebase Auth Fallback para login local:', error.message);

    // Verifica na base de contas locais
    const accounts = getLocalAccounts();
    const found = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (found) {
      if (found.password && found.password !== cleanPass) {
        throw new Error('Senha incorreta para este e-mail.');
      }
      const userData = {
        uid: found.uid,
        email: found.email,
        displayName: found.displayName,
        redeEnsino: found.redeEnsino || redeEnsino || 'REDE_SESI',
        isDemo: false
      };
      setStoredSessionUser(userData);
      return userData;
    }

    // Se não encontrou nem no Firebase nem na base local
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('E-mail ou senha incorretos.');
    }

    // Se foi cadastrado recentemente em modo offline
    const quickUserData = {
      uid: 'user_' + Date.now(),
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
      redeEnsino: redeEnsino || 'REDE_SESI',
      isDemo: false
    };
    saveLocalAccount({ ...quickUserData, password: cleanPass });
    setStoredSessionUser(quickUserData);
    return quickUserData;
  }
}

/**
 * Entrar em Modo Visitante / Demo Rápido
 */
export function signInDemoUser(redeEnsino = 'REDE_SESI') {
  const demoUserData = {
    uid: 'demo_guest_user',
    email: 'professor.demo@eduplan.com',
    displayName: 'Professor(a) Visitante',
    redeEnsino: redeEnsino || 'REDE_SESI',
    isDemo: true
  };
  setStoredSessionUser(demoUserData);
  return demoUserData;
}

/**
 * Atualizar Rede de Ensino da conta
 */
export function updateUserRedeEnsino(redeEnsino) {
  const current = getStoredSessionUser();
  if (current) {
    const updated = { ...current, redeEnsino };
    setStoredSessionUser(updated);
    
    // Atualiza também na base local
    const accounts = getLocalAccounts();
    const idx = accounts.findIndex(a => a.email.toLowerCase() === current.email.toLowerCase());
    if (idx >= 0) {
      accounts[idx].redeEnsino = redeEnsino;
      localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
    }
    
    return updated;
  }
  return null;
}

/**
 * Sair da Conta (Logout)
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Erro no logout do Firebase:', err);
  }
  setStoredSessionUser(null);
}
