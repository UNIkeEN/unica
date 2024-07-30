import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '@/contexts/auth';
import { useToast } from '@/contexts/toast';
import { useRouter } from 'next/router';

export const request = axios.create({
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  withCredentials: true,
});

export const fetcher = (url: string) =>
  request.get(url).then((res) => res.data);

export const setupInterceptors = (
  logout: () => void, 
  redirect: () => void,
  toast: (options: any) => void, 
  t: (key: string) => string
) => {
  request.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        toast({
          title: t('LoginPage.toast.session-expired'),
          status: 'warning',
        });
        logout();
        console.log('logout')
        setTimeout(() => {
          redirect();
          console.log('redirect')
        }, 2000);
      }
      else {
        console.log(error);
        return Promise.reject(error);
      }
    }
  );
};

export const useAxiosInterceptors = () => {
  const authCtx = useContext(AuthContext);
  const toast = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    setupInterceptors(
      authCtx.onLogout,
      authCtx.checkLoginAndRedirect,
      toast,
      t
    );
  }, [toast, t]);
};
