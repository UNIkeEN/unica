import React, { createContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { UserProfile } from '@/models/user';
import { Organization } from '@/models/organization';
import { getUserProfile } from '@/services/user';
import { getUserOrganizations } from '@/services/organization';
import { Project } from '@/models/project';
import { getProjects } from '@/services/project';


interface UserContextType {
  updateAll: () => void;
  cleanUp: () => void;
  profile: UserProfile | undefined;
  updateProfile: () => void;
  organizations: Organization[];
  updateOrganizations: () => void;
  projects: Project[];
  updateProjects: (page: number, pageSize: number) => void;
  projectCount: number;
}

const UserContext = createContext<UserContextType>({
  updateAll: () => {},
  cleanUp: () => {},
  profile: {} as UserProfile | undefined,
  updateProfile: () => {},
  organizations: [],
  updateOrganizations: () => {},
  projects: [],
  updateProjects: (page: number, pageSize: number) => {},
  projectCount: 0
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState(undefined);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectCount, setProjectCount] = useState<number>(0);
  const toast = useToast();
  const { t } = useTranslation();

  const updateProfile = useCallback(() => {
    try {
      getUserProfile().then((res) => {
        setProfile(res);
      });
    } catch (error) {
      toast({
        title: t('Services.user.getUserProfile.error'),
        status: 'error'
      })
      setProfile(undefined);
      console.error('Failed to update user profile:', error);
    }    
  }, [toast, t]);

  const updateOrganizations = useCallback(async () => {
    try {
      const orgList = await getUserOrganizations();
      setOrganizations(orgList);
    } catch (error) {
      toast({
        title: t('Services.organization.getUserOrganizations.error'),
        status: 'error'
      })
      setOrganizations([]);
      console.error('Failed to update user organizations:', error);
    }
  }, [toast, t]);

  const updateProjects = useCallback(async (page: number, pageSize: number) => {
    try {
      const projectList = await getProjects(page, pageSize);
      setProjects(projectList.results);
      setProjectCount(projectList.count);
    } catch (error) {
      toast({
        title: t('Services.projects.getProjects.error'),
        status: 'error'
      })
      setProjects([]);
      setProjectCount(0);
      console.error('Failed to update user projects:', error);
    }
  }, []);

  const updateAll = useCallback(() => {
    updateProfile();
    updateOrganizations();
  }, [updateProfile, updateOrganizations]);

  const cleanUp = useCallback(() => {
    setProfile(undefined);
    setOrganizations([]);
  }, [toast, t]);

  const contextValue = {
    updateAll,
    cleanUp,
    profile: profile,
    updateProfile,
    organizations: organizations,
    updateOrganizations,
    projects: projects,
    updateProjects,
    projectCount: projectCount
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
