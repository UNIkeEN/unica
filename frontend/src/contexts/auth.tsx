import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import useLocalStorage from '@/hooks/useLocalStorage';
import UserContext from '@/contexts/user';
import { Token } from '@/models/token';
import { jAccountRefresh } from '@/services/auth';

interface AuthContextType {
  token: string;
  refreshToken: string;
  isLoggedIn: boolean;
  onLogin: (token: Token) => void;
  onLogout: () => void;
  checkLoginAndRedirect: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: '',
  refreshToken: '',
  isLoggedIn: false,
  onLogin: () => { },
  onLogout: () => { },
  checkLoginAndRedirect: () => false,
});

const calculateRemainDuration = (expTime: number) => {
  const currentTime = new Date().getTime()
  const formatedExp = new Date(expTime).getTime()
  const remainDuration = formatedExp - currentTime
  return remainDuration
}

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useLocalStorage<string>('token', '');
  const [refreshToken, setRefreshToken] = useLocalStorage<string>("refreshToken", "");
  const [exp, setExp] = useLocalStorage<number>("expTime", 0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(undefined);
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const isLoggedIn = (!!token) && (exp <= 0 || calculateRemainDuration(exp) > 0);

  const doRefresh = () => {
    jAccountRefresh(refreshToken)
      .then((data: Token) => {
        if (!data) return;
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setExp((new Date().getTime() + 20 * 60 * 1000));
      });
  };

  useEffect(() => {
    if (timerId == undefined) {
      var id = setInterval(() => {
        if (refreshToken == "") return;
        doRefresh();
      }, 20 * 60 * 1000); //20 * 60
      setTimerId(id);
    }
  });

  useEffect(() => {
    if (!isLoggedIn && !!refreshToken) {
      doRefresh();
    }
  });

  const loginHandler = useCallback((newToken: Token) => {
    setToken(newToken.token);
    setRefreshToken(newToken.refreshToken);
    userCtx.updateAll();
  }, [setToken]);

  const logoutHandler = useCallback(() => {
    setToken('');
    setRefreshToken('');
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
    refreshToken,
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
