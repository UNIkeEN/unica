import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import useLocalStorage from '@/hooks/useLocalStorage';

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
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const isLoggedIn = !!token;

  const loginHandler = useCallback((newToken: string) => {
    setToken(newToken);
  }, [setToken]);

  const logoutHandler = useCallback(() => {
    setToken('');
    router.push('/login');
  }, [setToken, router]);

  const checkLoginAndRedirect= () => {
    if (!isLoggedIn) {
      toast({
        title: t('LoginPage.toast.need_login'),
        status: 'warning',
        duration: 3000,
        position: 'top',
        variant: 'top-accent',
        isClosable: true,
      })
      const currentPath = router.asPath;
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      return false;
    }
    return true;
  }

  const contextValue = useMemo(() => ({
    token,
    isLoggedIn,
    onLogin: loginHandler,
    onLogout: logoutHandler,
    checkLoginAndRedirect: checkLoginAndRedirect,
  }), [token, isLoggedIn, loginHandler, logoutHandler, checkLoginAndRedirect]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
