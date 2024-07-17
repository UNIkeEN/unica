import Head from "next/head";
import { Button } from "@chakra-ui/react";
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
      <Button>Test</Button>
    </>
  );
};

export default HomePage;
