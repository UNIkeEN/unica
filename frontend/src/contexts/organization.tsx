import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { useRouter } from 'next/router';
import { 
  Organization, 
  OrganizationMember, 
  MemberRoleEnum
} from '@/models/organization';
import { 
  checkUserOrgPermission, 
  getOrganizationMembers,
  getOrganizationInvitations
} from '@/services/organization';

interface OrganizationContextType {
  updateAll: (id: number) => void;
  cleanUp: () => void;
  userRole: string;
  basicInfo: Organization;
  updateBasicInfo: (id: number) => void;
  getMemberList: (id: number, page?: number, pageSize?: number) => Promise<OrganizationMember[]>;
  getInvitationList: (id: number, page?: number, pageSize?: number) => Promise<OrganizationMember[]>;
}

const OrganizationContext = createContext<OrganizationContextType>({
  updateAll: () => {},
  cleanUp: () => {},
  userRole: '',
  basicInfo: {} as Organization | undefined,
  updateBasicInfo: () => {},
  getMemberList: () => Promise.resolve([]),
  getInvitationList: () => Promise.resolve([])
});

export const OrganizationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orgInfo, setOrgInfo] = useState(undefined);
  const [userRole, setUserRole] = useState(undefined);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const toastNoPermissionAndRedirect = (userRole: string) => {
    if (userRole === MemberRoleEnum.PENDING) {
      router.push(`/organizations/${router.query.id}/invitation/`);
    } else if (userRole === MemberRoleEnum.NO_PERMISSION) {
      toast({
        title: t('OrganizationContext.toast.error-1'),
        status: 'error'
      });
  
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    }
  };

  const updateBasicInfo = async (id: number) => {
    if (!id) return;
    console.log("updateBasicInfo ", id)
    try {
      const res = await checkUserOrgPermission(id);
      setUserRole(res.role);
      setOrgInfo(res.organization);
      if (res.role === MemberRoleEnum.PENDING) {
        router.push(`/organizations/${id}/invitation/`);
      }
    } catch (error) {
      if (error.request && error.request.status === 403) {
        toastNoPermissionAndRedirect(MemberRoleEnum.NO_PERMISSION);
      } else {
        toast({
          title: t('OrganizationContext.toast.error-2'),
          status: 'error'
        });
      }
      setUserRole(undefined);
      setOrgInfo(undefined);
      console.error('Failed to update user basic info:', error.request);
    }
  };

  const getMemberList = async (id: number, page: number = 1, pageSize: number = 20): Promise<OrganizationMember[]> => {
    try {
      const res = await getOrganizationMembers(id, page, pageSize);
      setOrgInfo((prev) => {
        if (prev) {
          return {
            ...prev,
            members: res.results as OrganizationMember[]
          };
        }
        return undefined
      });
      return res.results as OrganizationMember[];
    } catch (error) {
      if (error.request && error.request.status === 403) {
        toastNoPermissionAndRedirect(userRole);
      } else {
        toast({
          title: t('OrganizationContext.toast.error-3'),
          status: 'error'
        });
      }
      console.error('Failed to update organization members:', error);
    }
  };

  const getInvitationList = async (id: number, page: number = 1, pageSize: number = 20): Promise<OrganizationMember[]> => {
    try {
      const res = await getOrganizationInvitations(id, page, pageSize);
      return res.results as OrganizationMember[];
    } catch (error) {
      if (error.request && error.request.status === 403) {
        toastNoPermissionAndRedirect(userRole);
      } else {
        toast({
          title: t('OrganizationContext.toast.error-4'),
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
    getMemberList,
    getInvitationList
  }

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContext;
