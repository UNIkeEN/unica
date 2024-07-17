import Head from "next/head";
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('HomePage.title')}</title>
        <meta name="headerText" content={t('HomePage.header')} />
      </Head>
      {/* {t('HomePage.header')} */}
    </>
  );
};

export default HomePage;
