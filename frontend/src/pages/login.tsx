import React, { use, useContext, useEffect } from 'react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { jAccountLogin } from '@/services/auth';
import AuthContext from '@/contexts/auth';

const LoginPage = () => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (authCtx.isLoggedIn) router.push(router.query.next as string || '/');
  },[]);

  return (
    <>
      <Head>
        <title>{t('LoginPage.title')}</title>
      </Head>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}>
        <Button 
          onClick={() => jAccountLogin(router.query.next as string)}
        >
          {t('LoginPage.button.jaccount')}
        </Button>
      </div>
    </>
  );
};

export default LoginPage;
