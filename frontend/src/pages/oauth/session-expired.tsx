import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '@/contexts/auth';
import { useToast } from '@/contexts/toast';
import { useTranslation } from 'react-i18next';

const IndexPage = () => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const toast = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    authCtx.onLogout();
    setTimeout(() => {
      router.push('/login');
      toast({
        title: t('LoginPage.toast.session-expired'),
        status: 'warning',
        });
    }, 100);
  }, [router]);

  return null;
};

export default IndexPage;
