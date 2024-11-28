import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { VStack, Text, Icon } from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import Head from 'next/head';

const NotFoundPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          router.push('/home'); 
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <>
      <Head>
        <title>{`${t('NotFoundPage.title')} - Unica`}</title>
      </Head>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
          width: '100%',
        }}
      >
        <VStack>
          <Icon as={FiX} w={8} h={8} color="red.500" />
          <Text>{t('NotFoundPage.text', { seconds })}</Text>
        </VStack>
      </div>
    </>
  );
};

export default NotFoundPage;