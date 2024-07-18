import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SettingsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/settings/profile');
  }, [router]);

  return null;
};

export default SettingsPage;