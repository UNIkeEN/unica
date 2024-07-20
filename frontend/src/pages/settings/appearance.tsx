
import Head from "next/head";
import { useTranslation } from 'react-i18next';
import SettingsLayout from "@/layouts/settings-layout";

const AppearanceSettingsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`${t('SettingsPages.appearance.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('SettingsPages.header')} />
      </Head>
      <SettingsLayout>
        <div>Appearance Settings</div>
      </SettingsLayout>
    </>
  );
};

export default AppearanceSettingsPage;