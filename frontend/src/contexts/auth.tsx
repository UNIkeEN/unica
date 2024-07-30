import React, { createContext, useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
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
  onLogin: () => {},
  onLogout: () => {},
  checkLoginAndRedirect: () => false,
});

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useLocalStorage<string>('token', '');
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const isLoggedIn = !!token;

  const loginHandler = useCallback((newToken: string) => {
    setToken(newToken);
    userCtx.updateAll();
  }, [setToken]);

  const logoutHandler = useCallback(() => {
    setToken('');
    userCtx.cleanUp();
    router.push('/login');
  }, [setToken, router]);

  const checkLoginAndRedirect = () => {
    if (!isLoggedIn) {
      toast({
        title: t('LoginPage.toast.need-login'),
        status: 'warning'
      })
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
