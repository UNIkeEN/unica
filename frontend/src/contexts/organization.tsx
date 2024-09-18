import React, { createContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { useRouter } from 'next/router';
import { Organization, MemberRoleEnum } from '@/models/organization';
import { DiscussionTopicCategory } from '@/models/discussion';
import { checkUserOrgPermission } from '@/services/organization';
import { getProjects } from '@/services/project';
import { listCategories } from '@/services/discussion';

interface OrganizationContextType {
  updateAll: (id: number) => void;
  cleanUp: () => void;
  toastNoPermissionAndRedirect: (userRole?: string) => void;
  mounted: boolean;
  // Basic Global State of Organization, 
  userRole: string;
  basicInfo: Organization;
  updateBasicInfo: (id: number) => void;
  setUserRole: (role: string) => void;
  setBasicInfo: (org: Organization) => void;
  // Shared Global State and Update Handlers (shared by different components and pages)
  handleGetProjects: (page: number, pageSize: number, org_id: number) => Promise<any>;
  handleListDiscussionCategories: (page: number, pageSize: number, org_id: number) => Promise<any>;
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
  setBasicInfo: () => {},
  handleGetProjects: (page: number, pageSize: number, org_id: number) => null,
  handleListDiscussionCategories: (page: number, pageSize: number, org_id: number) => null
});

export const OrganizationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const [mounted, setMounted] = useState(false);
  const [orgInfo, setOrgInfo] = useState<Organization | undefined>(undefined);
  const [userRole, setUserRole] = useState(undefined);
  const [discussionCategories, setDiscussionCategories] = useState<DiscussionTopicCategory[]>([]);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const toastNoPermissionAndRedirect = (role: string = userRole) => {
    if (role === MemberRoleEnum.PENDING) {
      router.push(`/organizations/${router.query.id}/invitation/`);
    } else if (role !== undefined) {
      // Call to here when backend return 403, user has no membership in this organization or enough permission(e.g. the Owner)
      toast({
        title: t('OrganizationContext.toast.noPermission'),
        status: 'error'
      });
      setTimeout(() => {
        if (role === MemberRoleEnum.NO_PERMISSION) window.location.assign('/home'); // use location.assign instead router.push to reload main layout
        else window.location.reload();
      }, 2000);
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
      console.error('Failed to update user basic info:', error.request);
      if (error.request && error.request.status === 403) {
        toastNoPermissionAndRedirect(MemberRoleEnum.NO_PERMISSION);
      } else {
        toast({
          title: t('Services.organization.checkUserOrgPermission.error'),
          status: 'error'
        });
        setTimeout(() => { router.push('/home'); }, 2000);
      }
      setUserRole(undefined);
      setOrgInfo(undefined);
    }
  };

  const handleGetProjects = async (page: number, pageSize: number, org_id: number) => {
    if (!org_id) return null;
    try {
      const projectList = await getProjects(page, pageSize, org_id);
      setOrgInfo({ ...orgInfo, project_count: projectList.count });
      return projectList.results;
    } catch (error) {
      if (error.request && error.request.status === 403) {
        toastNoPermissionAndRedirect(MemberRoleEnum.NO_PERMISSION);
      } else toast({
        title: t('Services.projects.getProjects.error'),
        status: 'error'
      })
      console.error('Failed to update organization projects:', error);
      throw error;
    }
  };

  const handleListDiscussionCategories = async (page: number, pageSize: number, org_id: number) => {
    if (!org_id || (orgInfo && !orgInfo.is_discussion_enabled)) return null;
    try {
      const res = await listCategories(org_id, page, pageSize);
      return res;
    } catch (error) {
      if (error.request && error.request.status === 403) {
        toastNoPermissionAndRedirect(MemberRoleEnum.NO_PERMISSION);
      } else toast({
        title: t('Services.projects.listCategories.error'),
        status: 'error'
      })
    }
  }

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
    setBasicInfo: (org: Organization) => setOrgInfo(org),
    handleGetProjects,
    handleListDiscussionCategories,
  };

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContext;
