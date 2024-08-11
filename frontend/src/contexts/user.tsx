import React, { createContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { UserBasicInfo } from '@/models/user';
import { Organization } from '@/models/organization';
import { getUserBasicInfo } from '@/services/user';
import { getUserOrganizations } from '@/services/organization';


interface UserContextType {
  updateAll: () => void;
  cleanUp: () => void;
  basicInfo: UserBasicInfo;
  updateBasicInfo: () => void;
  organizations: Organization[];
  updateOrganizations: () => void;
}

const UserContext = createContext<UserContextType>({
  updateAll: () => {},
  cleanUp: () => {},
  basicInfo: {} as UserBasicInfo | undefined,
  updateBasicInfo: () => {},
  organizations: [],
  updateOrganizations: () => {},
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState(undefined);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const toast = useToast();
  const { t } = useTranslation();

  const updateBasicInfo = useCallback(() => {
    try {
      getUserBasicInfo().then((res) => {
        setUserInfo(res);
      });
    } catch (error) {
      toast({
        title: t('Services.user.getUserBasicInfo.error'),
        status: 'error'
      })
      setUserInfo(undefined);
      console.error('Failed to update user basic info:', error);
    }    
  }, [toast, t]);

  const updateOrganizations = useCallback(async () => {
    try {
      const orgList = await getUserOrganizations();
      setOrganizations(orgList);
    } catch (error) {
      toast({
        title: t('UserContext.toast.error-2'),
        status: 'error'
      })
      setOrganizations([]);
      console.error('Failed to update user organizations:', error);
    }
  }, [toast, t]);

  const updateAll = useCallback(() => {
    updateBasicInfo();
    updateOrganizations();
  }, [updateBasicInfo, updateOrganizations]);

  const cleanUp = useCallback(() => {
    setUserInfo(undefined);
    setOrganizations([]);
  }, [toast, t]);

  const contextValue = {
    updateAll,
    cleanUp,
    basicInfo: userInfo,
    updateBasicInfo,
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
