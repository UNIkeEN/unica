import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProjectDefaultPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      router.push(`/projects/${id}/board/`);
    }
  }, [router]);

  return null;
};

export default ProjectDefaultPage;