import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '@/contexts/auth';
import { useTranslation } from 'react-i18next';

const IndexPage = () => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    authCtx.onLogout();
    const timer = setTimeout(() => {
      router.push('/login');
    }, 100);
    return () => clearTimeout(timer);
  }, [router, authCtx]);

  return null;
};

export default IndexPage;
