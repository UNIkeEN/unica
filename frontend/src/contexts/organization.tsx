import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { useRouter } from 'next/router';
import { Organization, MemberRoleEnum } from '@/models/organization';
import { checkUserOrgPermission } from '@/services/organization';

interface OrganizationContextType {
  updateAll: (id: number) => void;
  cleanUp: () => void;
  toastNoPermissionAndRedirect: (userRole?: string) => void;
  mounted: boolean;
  userRole: string;
  basicInfo: Organization;
  updateBasicInfo: (id: number) => void;
  setUserRole: (role: string) => void;
  setBasicInfo: (org: Organization) => void;
}

const OrganizationContext = createContext<OrganizationContextType>({
  updateAll: () => {},
  cleanUp: () => {},
  toastNoPermissionAndRedirect: () => {},
  mounted: false,
  userRole: '',
  basicInfo: {} as Organization | undefined,
  updateBasicInfo: () => {},
  setUserRole: () => {},
  setBasicInfo: () => {}
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
    setUserRole: (role: string) => setUserRole(role),
    setBasicInfo: (org: Organization) => setOrgInfo(org)
  }

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContext;
