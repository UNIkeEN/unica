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
  getOrganizationMembers
} from '@/services/organization';

interface OrganizationContextType {
  updateAll: (id: number) => void;
  cleanUp: () => void;
  toastNoPermissionAndRedirect: (userRole?: string) => void;
  mounted: boolean;
  userRole: string;
  basicInfo: Organization;
  updateBasicInfo: (id: number) => void;
  getMemberList: (id: number, page?: number, pageSize?: number) => Promise<OrganizationMember[]>;
}

const OrganizationContext = createContext<OrganizationContextType>({
  updateAll: () => {},
  cleanUp: () => {},
  toastNoPermissionAndRedirect: () => {},
  mounted: false,
  userRole: '',
  basicInfo: {} as Organization | undefined,
  updateBasicInfo: () => {},
  getMemberList: () => Promise.resolve([])
});

export const OrganizationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const [mounted, setMounted] = useState(false);
  const [orgInfo, setOrgInfo] = useState(undefined);
  const [userRole, setUserRole] = useState(undefined);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const toastNoPermissionAndRedirect = (role: string = userRole) => {
    if (role === MemberRoleEnum.PENDING) {
      router.push(`/organizations/${router.query.id}/invitation/`);
    } else if (role === MemberRoleEnum.NO_PERMISSION || MemberRoleEnum.MEMBER) {
      // Call to here when backend return 403, user has no membership in this organization or enough permission(e.g. the Owner)
      toast({
        title: t('OrganizationContext.toast.error-1'),
        status: 'error'
      });
      if (role === MemberRoleEnum.NO_PERMISSION) {
        setTimeout(() => {
          router.push('/home');
        }, 2000);
      } else {
        let id = Number(router.query.id);
        updateBasicInfo(id); // Update user role
        router.push(`/organizations/${id}/overview/`);
      }
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
        // setMounted(true);
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
            member_count: res.count
          };
        }
        return undefined
      });
      return res.results as OrganizationMember[];
    } catch (error) {
      if (error.request && error.request.status === 403) {
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
    try{
      updateBasicInfo(id);
    } catch (error) {
      console.error('Failed to update organization:', error)
    }
  }

  const cleanUp = () => {
    setOrgInfo(undefined);
    setUserRole(undefined);
  };

  const checkMounted = () => {
    return orgInfo !== undefined && userRole !== undefined;
  }

  const contextValue = {
    updateAll,
    cleanUp,
    toastNoPermissionAndRedirect,
    mounted: checkMounted(),
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
