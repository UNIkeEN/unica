import { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { localeResources } from '@/locales';
import { ToastContextProvider } from '@/contexts/toast';
import { AuthContextProvider } from '@/contexts/auth';
import { UserContextProvider } from '@/contexts/user';
import MainLayout from '@/layouts/main-layout';
import theme from '../theme';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  i18n
    .use(initReactI18next)
    .init({
      resources: localeResources,
      lng: 'zh_Hans', 
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
  });

  if (!mounted) return <></>;

  return (
    <ChakraProvider theme={theme}>
      <ToastContextProvider>
        <UserContextProvider>
          <AuthContextProvider>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </AuthContextProvider>
        </UserContextProvider>   
      </ToastContextProvider>
    </ChakraProvider>
  );
}

export default appWithTranslation(App);
