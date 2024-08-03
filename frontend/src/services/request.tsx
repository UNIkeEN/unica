import axios from 'axios';
import { useContext, useEffect } from 'react';
import AuthContext from '@/contexts/auth';

export const request = axios.create({
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  withCredentials: true,
});

export const fetcher = (url: string) =>
  request.get(url).then((res) => res.data);

export const setupInterceptors = (
) => {
  request.interceptors.response.use(
    response => response,
    error => {
      if (error.config.url.startsWith('/api/')) {
        if (error.response && error.response.data.detail === "身份认证信息未提供。") {  // Error Detail is from Django
          window.location.href = "/oauth/session-expired";
        } else {
          return Promise.reject(error);
        }
      }
      else {
        return Promise.reject(error);
      }
    }
  );
};

export const useAxiosInterceptors = () => {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    setupInterceptors();
  }, []);
};
