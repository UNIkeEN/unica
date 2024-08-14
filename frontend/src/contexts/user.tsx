import React, { createContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { UserProfile } from '@/models/user';
import { Organization } from '@/models/organization';
import { getUserProfile } from '@/services/user';
import { getUserOrganizations } from '@/services/organization';


interface UserContextType {
  updateAll: () => void;
  cleanUp: () => void;
  profile: UserProfile | undefined;
  updateProfile: () => void;
  organizations: Organization[];
  updateOrganizations: () => void;
}

const UserContext = createContext<UserContextType>({
  updateAll: () => {},
  cleanUp: () => {},
  profile: {} as UserProfile | undefined,
  updateProfile: () => {},
  organizations: [],
  updateOrganizations: () => {},
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
    updateOrganizations
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
