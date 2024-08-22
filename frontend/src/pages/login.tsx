import React, { use, useContext, useEffect } from 'react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { Button, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { jAccountLogin } from '@/services/auth';
import AuthContext from '@/contexts/auth';

const LoginPage = () => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();
  const toast = useToast();

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      router.push(router.query.next as string || '/');
    }

    const { next, expired } = router.query;

    if (expired === 'true') {
      toast({
        title: t('LoginPage.toast.session-expired'),
        status: 'warning',
        duration: 5000,
        position: "top",
        isClosable: true,
      });

      router.replace({
        pathname: router.pathname, query: next ? { next } : {},
      }, undefined, { shallow: true });
    }

    else if (next && !authCtx.isLoggedIn) {
      toast({
        title: t('LoginPage.toast.need-login'),
        status: 'info',
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    }
  }, [authCtx.isLoggedIn, router, toast, t]);

  return (
    <>
      <Head>
        <title>{`${t('LoginPage.title')} - Unica`}</title>
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
