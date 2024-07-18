import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { localeResources } from '@/locales';
import { ToastContextProvider } from '@/contexts/toast';
import MainLayout from '@/components/main-layout';
import theme from '../theme';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {

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

  return (
    <ChakraProvider theme={theme}>
      <ToastContextProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ToastContextProvider>
    </ChakraProvider>
  );
}

export default appWithTranslation(App);
