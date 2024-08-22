import React, { createContext, useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import useLocalStorage from '@/hooks/useLocalStorage';
import UserContext from '@/contexts/user';

interface AuthContextType {
  token: string;
  isLoggedIn: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
  checkLoginAndRedirect: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: '',
  isLoggedIn: false,
  onLogin: () => { },
  onLogout: () => { },
  checkLoginAndRedirect: () => false,
});

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useLocalStorage<string>('token', '');
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const { t } = useTranslation();

  const isLoggedIn = !!token;

  const loginHandler = useCallback((newToken: string) => {
    setToken(newToken);
    userCtx.updateAll();
  }, [setToken, userCtx]);

  const logoutHandler = useCallback(() => {
    setToken('');
    userCtx.cleanUp();
    router.push('/login');
  }, [userCtx, setToken, router]);

  const checkLoginAndRedirect = () => {
    if (!isLoggedIn) {
      const currentPath = router.asPath;
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      return false;
    }
    return true;
  }

  const contextValue = {
    token,
    isLoggedIn,
    onLogin: loginHandler,
    onLogout: logoutHandler,
    checkLoginAndRedirect: checkLoginAndRedirect,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
