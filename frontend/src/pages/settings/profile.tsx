import Head from "next/head";
import { useTranslation } from 'react-i18next';
import SettingsLayout from "@/layouts/settings-layout";

const ProfileSettingsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`${t('SettingsPages.profile.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('SettingsPages.header')} />
      </Head>
      <SettingsLayout>
        <div>Profile Settings</div>
      </SettingsLayout>
    </>
  );
};

export default ProfileSettingsPage;