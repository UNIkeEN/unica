import React, { createContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { UserProfile } from '@/models/user';
import { getUserProfile } from '@/services/user';
import { listUserOrganizations } from '@/services/organization';
import { listProjects } from '@/services/project';


interface UserContextType {
  updateAll: () => void;
  cleanUp: () => void;
  profile: UserProfile | undefined;
  updateProfile: () => void;
  handleListOrganizations: (page: number, page_size: number, order_by: string) => Promise<any>;
  handleListProjects: (page: number, pageSize: number) => Promise<any>;
}

const UserContext = createContext<UserContextType>({
  updateAll: () => {},
  cleanUp: () => {},
  profile: {} as UserProfile | undefined,
  updateProfile: () => {},
  handleListOrganizations: () => null,
  handleListProjects: () => null,
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState(undefined);
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

  const handleListOrganizations = useCallback(async (page: number, page_size: number, order_by: string = '-updated_at') => {
    try {
      const orgList = await listUserOrganizations({page, page_size, order_by});
      return orgList;
    } catch (error) {
      toast({
        title: t('Services.organization.listUserOrganizations.error'),
        status: 'error'
      })
      console.error('Failed to update user organizations:', error);
      throw error;
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
  }, [updateProfile]);

  const cleanUp = useCallback(() => {
    setProfile(undefined);
  }, []);

  const contextValue = {
    updateAll,
    cleanUp,
    profile: profile,
    updateProfile,
    handleListOrganizations,
    handleListProjects,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
