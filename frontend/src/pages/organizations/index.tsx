import { useContext, useEffect } from "react";
import Head from "next/head";
import { useTranslation } from 'react-i18next';
import AuthContext from "@/contexts/auth";

const MyOrganizationsPage = () => {
  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  return (
    <>
      <Head>
        <title>{`${t('MyOrganizationsPage.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('MyOrganizationsPage.header')} />
      </Head>
    </>
  );
};

export default MyOrganizationsPage;