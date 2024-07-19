import React, { createContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { getUserOrganizations } from '@/services/organization';
import { Organization } from '@/models/organization';

interface UserContextType {
  organizations: Organization[];
  updateUserOrganizations: () => void;
  // TODO: move user info and update function from AuthContext to here
  // TODO: add initial function to call update functions above
  cleanUp: () => void;
}

const UserContext = createContext<UserContextType>({
  organizations: [],
  updateUserOrganizations: () => {},
  cleanUp: () => {},
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const toast = useToast();
  const { t } = useTranslation();

  const cleanUp = useCallback(() => {
    setOrganizations([]);
  }, []);

  const updateUserOrganizations = useCallback(async () => {
    try {
      const orgList = await getUserOrganizations();
      setOrganizations(orgList);
    } catch (error) {
      toast({
        title: t('UserContext.toast.error-1'),
        status: 'error'
      })
      setOrganizations([]);
      console.error('Failed to update user organizations:', error);
    }
  }, []);

  const contextValue = {
    organizations,
    updateUserOrganizations,
    cleanUp
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
