import { useContext, useEffect } from "react";
import Head from "next/head";
import { useTranslation } from 'react-i18next';
import AuthContext from "@/contexts/auth";

const HomePage = () => {
  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  return (
    <>
      <Head>
        <title>{`${t('HomePage.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('HomePage.header')} />
      </Head>
    </>
  );
};

export default HomePage;
