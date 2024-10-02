import React, { createContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { UserProfile } from '@/models/user';
import { Organization } from '@/models/organization';
import { getUserProfile } from '@/services/user';
import { listUserOrganizations } from '@/services/organization';
import { Project } from '@/models/project';
import { listProjects } from '@/services/project';


interface UserContextType {
  updateAll: () => void;
  cleanUp: () => void;
  profile: UserProfile | undefined;
  updateProfile: () => void;
  organizations: Organization[];
  updateOrganizations: () => void;
  handleListProjects: (page: number, pageSize: number) => Promise<any>;
}

const UserContext = createContext<UserContextType>({
  updateAll: () => {},
  cleanUp: () => {},
  profile: {} as UserProfile | undefined,
  updateProfile: () => {},
  organizations: [],
  updateOrganizations: () => {},
  handleListProjects: (page: number, pageSize: number) => null,
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState(undefined);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
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
      const orgList = await listUserOrganizations();
      setOrganizations(orgList);
    } catch (error) {
      toast({
        title: t('Services.organization.listUserOrganizations.error'),
        status: 'error'
      })
      setOrganizations([]);
      console.error('Failed to update user organizations:', error);
    }
  }, [toast, t]);

  const handleListProjects = useCallback(async (page: number, pageSize: number) => {
    try {
      const projectList = await listProjects(page, pageSize);
      return projectList;
    } catch (error) {
      toast({
        title: t('Services.projects.listProjects.error'),
        status: 'error'
      })
      console.error('Failed to list user projects:', error);
      throw error;
    }
  }, [toast, t]);

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
    handleListProjects,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
