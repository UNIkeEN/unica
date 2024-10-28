import axios from 'axios';
import { useEffect } from 'react';

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
        if (error.response && error.response.data.detail === "身份认证信息未提供。" && !window.location.href.startsWith('/login')) {  // Error Detail is from Django
          if (localStorage.getItem('token'))
            window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}&expired=true`;
          else
            window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
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

  useEffect(() => {
    setupInterceptors();
  }, []);
};
