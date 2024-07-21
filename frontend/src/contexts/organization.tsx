import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { useRouter } from 'next/router';
import { Organization, OrganizationMember } from '@/models/organization';
import { checkUserOrgPermission, getOrganizationMembers } from '@/services/organization';

interface OrganizationContextType {
  cleanUp: () => void;
  userRole: string;
  basicInfo: Organization;
  updateBasicInfo: (orgId: number) => void;
  memberList: OrganizationMember[];
  updateMemberList: () => void;
}

const OrganizationContext = createContext<OrganizationContextType>({
  cleanUp: () => {},
  userRole: '',
  basicInfo: {} as Organization | undefined,
  updateBasicInfo: (orgId: number) => {},
  memberList: [],
  updateMemberList: () => {},
});

export const OrganizationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orgInfo, setOrgInfo] = useState(undefined);
  const [memberList, setMemberList] = useState<OrganizationMember[]>([]);
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
    }, 3000);
  };

  const updateBasicInfo = (orgId: number) => {
    try {
      checkUserOrgPermission(orgId).then((res) => {
        setUserRole(res.role);
        setOrgInfo(res.organization);
      });
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

  const updateMemberList = () => {
    try {
      getOrganizationMembers(orgInfo.id).then((res) => {
        setMemberList(res);
      });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t('OrganizationContext.toast.error-3'),
          status: 'error'
        });
      }
      setMemberList([]);
      console.error('Failed to update organization members:', error);
    }
  };

  const cleanUp = () => {
    setOrgInfo(undefined);
    setMemberList([]);
    setUserRole(undefined);
  };

  const contextValue = {
    cleanUp,
    userRole: userRole,
    basicInfo: orgInfo,
    updateBasicInfo,
    memberList: memberList,
    updateMemberList,
  }

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContext;
