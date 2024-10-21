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
    if (seconds > 1) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        router.push('/home');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [seconds, router]);

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
          <Icon as={FiX} w={8} h={8} color='red.500' />
          <Text>
            {t('NotFoundPage.text', { seconds: seconds })}
          </Text>
        </VStack>
      </div>
    </>
  );
};

export default NotFoundPage;
