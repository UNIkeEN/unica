import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { useRouter } from 'next/router';
import { Organization, OrganizationMember } from '@/models/organization';
import { checkUserOrgPermission, getOrganizationMembers } from '@/services/organization';

interface OrganizationContextType {
  updateAll: (id: number) => void;
  cleanUp: () => void;
  userRole: string;
  basicInfo: Organization;
  updateBasicInfo: (id: number) => void;
  getMemberList: (id: number, page?: number, pageSize?: number) => Promise<OrganizationMember[]>;
}

const OrganizationContext = createContext<OrganizationContextType>({
  updateAll: () => {},
  cleanUp: () => {},
  userRole: '',
  basicInfo: {} as Organization | undefined,
  updateBasicInfo: () => {},
  getMemberList: () => Promise.resolve([]),
});

export const OrganizationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orgInfo, setOrgInfo] = useState(undefined);
  const [userRole, setUserRole] = useState(undefined);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const toastNoPermissionAndRedirect = () => {
    toast({
      title: t('OrganizationContext.toast.error-1'),
      status: 'error'
    });

    setTimeout(() => {
      router.push('/home');
    }, 2000);
  };

  const updateBasicInfo = async (id: number) => {
    if (!router.query.id) return;
    try {
      const res = await checkUserOrgPermission(id);
      setUserRole(res.role);
      setOrgInfo(res.organization);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t('OrganizationContext.toast.error-2'),
          status: 'error'
        });
      }
      setUserRole(undefined);
      setOrgInfo(undefined);
      console.error('Failed to update user basic info:', error);
    }
  };

  const getMemberList = async (id: number, page: number = 1, pageSize: number = 20): Promise<OrganizationMember[]> => {
    try {
      const res = await getOrganizationMembers(id, page, pageSize);
      return res.results as OrganizationMember[];
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t('OrganizationContext.toast.error-3'),
          status: 'error'
        });
      }
      console.error('Failed to update organization members:', error);
    }
  };

  const updateAll = (id: number) => {
    updateBasicInfo(id);
  }

  const cleanUp = () => {
    setOrgInfo(undefined);
    setUserRole(undefined);
  };

  const contextValue = {
    updateAll,
    cleanUp,
    userRole: userRole,
    basicInfo: orgInfo,
    updateBasicInfo,
    getMemberList
  }

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContext;
