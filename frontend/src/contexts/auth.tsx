import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import useLocalStorage from '@/hooks/useLocalStorage';
import { UserBasicInfo } from '@/models/user';
import { getUserBasicInfo } from '@/services/user';

interface AuthContextType {
  token: string;
  isLoggedIn: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
  checkLoginAndRedirect: () => boolean;
  userInfo: UserBasicInfo,
  updateUserInfo: () => void,
}

const AuthContext = createContext<AuthContextType>({
  token: '',
  isLoggedIn: false,
  onLogin: () => {},
  onLogout: () => {},
  checkLoginAndRedirect: () => false,
  userInfo: {} as UserBasicInfo | undefined,
  updateUserInfo: () => {},
});

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useLocalStorage<string>('token', '');
  const [userInfo, setUserInfo] = useState(undefined);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const isLoggedIn = !!token;

  const loginHandler = useCallback((newToken: string) => {
    setToken(newToken);
    updateUserInfo();
  }, [setToken]);

  const logoutHandler = useCallback(() => {
    setToken('');
    setUserInfo(undefined);
    router.push('/login');
  }, [setToken, router]);

  const checkLoginAndRedirect= () => {
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

  const updateUserInfo = () => {
    try {
      getUserBasicInfo().then((res) => {
        setUserInfo(res);
      });
    } catch (error) {
      setUserInfo(undefined);
    }    
  }

  const contextValue = {
    token,
    isLoggedIn,
    onLogin: loginHandler,
    onLogout: logoutHandler,
    checkLoginAndRedirect: checkLoginAndRedirect,
    userInfo,
    updateUserInfo: updateUserInfo
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
