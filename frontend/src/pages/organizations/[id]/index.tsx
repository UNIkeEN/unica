import { useEffect } from 'react';
import { useRouter } from 'next/router';

const OrganizationDefaultPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      router.push(`/organizations/${id}/overview/`);
    }
  }, [router]);

  return null;
};

export default OrganizationDefaultPage;