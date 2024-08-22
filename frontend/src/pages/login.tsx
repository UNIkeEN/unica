import React, { useContext, useEffect } from 'react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { jAccountLogin } from '@/services/auth';
import AuthContext from '@/contexts/auth';
import { useToast } from '@/contexts/toast';

const LoginPage = () => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();
  const toast = useToast();

  useEffect(() => {
    const { next, expired } = router.query;

    if (authCtx.isLoggedIn) {
      router.push(next as string || '/');
    }

    if (expired === 'true') {
      toast({
        title: t('LoginPage.toast.session-expired'),
        status: 'warning',
      });
      let url = new URL(window.location.href);
      url.searchParams.delete('expired');
      window.history.replaceState(null, null, url.toString());
    } else if (next && !authCtx.isLoggedIn) {
      toast({
        title: t('LoginPage.toast.need-login'),
        status: 'warning',
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
