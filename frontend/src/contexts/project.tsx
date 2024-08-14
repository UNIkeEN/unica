import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { useRouter } from 'next/router';
import { Project } from '@/models/project';
import { getProjectInfo } from '@/services/project';

interface OrganizationContextType {
  updateAll: (id: number) => void;
  cleanUp: () => void;
  toastNoPermissionAndRedirect: (userRole?: string) => void;
  mounted: boolean;
  basicInfo: Project;
  updateBasicInfo: (id: number) => void;
  setBasicInfo: (proj: Project) => void;
}

const ProjectContext = createContext<OrganizationContextType>({
  updateAll: () => {},
  cleanUp: () => {},
  toastNoPermissionAndRedirect: () => {},
  mounted: false,
  basicInfo: {} as Project | undefined,
  updateBasicInfo: () => {},
  setBasicInfo: () => {}
});

export const ProjectContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectInfo, setProjectInfo] = useState<Project | undefined>(undefined);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const toastNoPermissionAndRedirect = () => {
    toast({
        title: t('ProjectContext.toast.noPermission'),
        status: 'error'
    });

    setTimeout(() => {
        router.push('/home');
    }, 2000);
};

const updateBasicInfo = async (id: number) => {
  if (!id) return;
  try {
      const res = await getProjectInfo(id);
      setProjectInfo(res);
  } catch (error) {
      console.error('Failed to update project basic info:', error.request);
      if (error.request && error.request.status === 403) {
          toastNoPermissionAndRedirect();
      } else {
          toast({
              title: t('Services.projects.getProjectInfo.error'),
              status: 'error'
          });
          setTimeout(() => { router.push('/home'); }, 2000);
      }
      
      setProjectInfo(undefined);
  }
};


  const updateAll = (id: number) => {
    try{
      updateBasicInfo(id);
    } catch (error) {
      console.error('Failed to update organization:', error)
    }
  }

  const cleanUp = () => {
    setProjectInfo(undefined);
  };

  const checkMounted = () => {
    return projectInfo !== undefined;
  }

  const contextValue = {
    updateAll,
    cleanUp,
    toastNoPermissionAndRedirect,
    mounted: checkMounted(),
    basicInfo: projectInfo,
    updateBasicInfo,
    setBasicInfo: (proj: Project) => setProjectInfo(proj)
  }

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
