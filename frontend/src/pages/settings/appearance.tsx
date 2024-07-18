import { useContext, useEffect } from "react";
import Head from "next/head";
import { useTranslation } from 'react-i18next';
import AuthContext from "@/contexts/auth";
import SettingsLayout from "@/components/settings-layout";

const AppearanceSettingsPage = () => {
  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, []);

  return (
    <>
      <Head>
        <title>{`${t('SettingsPage.appearance.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('SettingsPage.header')} />
      </Head>
      <SettingsLayout>
        <div>Appearance Settings</div>
      </SettingsLayout>
    </>
  );
};

export default AppearanceSettingsPage;