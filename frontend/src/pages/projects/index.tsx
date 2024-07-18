import { useContext, useEffect } from "react";
import Head from "next/head";
import { useTranslation } from 'react-i18next';
import AuthContext from "@/contexts/auth";

const MyProjectsPage = () => {
  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, []);

  return (
    <>
      <Head>
        <title>{`${t('MyProjectsPage.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('MyProjectsPage.header')} />
      </Head>
    </>
  );
};

export default MyProjectsPage;