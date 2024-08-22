import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '@/contexts/auth';

const IndexPage = () => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    authCtx.onLogout();
    const timer = setTimeout(() => {
      router.push('/login?expired=true');
    }, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return null;
};

export default IndexPage;
