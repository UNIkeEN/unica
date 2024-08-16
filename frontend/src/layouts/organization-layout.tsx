import React, { useContext, useEffect } from 'react';
import { VStack, Text, HStack, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import { FiHome, FiBook, FiUser, FiMessageSquare, FiSettings } from 'react-icons/fi';
import { MemberRoleEnum } from "@/models/organization";
import OrganizationContext, { OrganizationContextProvider } from '@/contexts/organization';
import NavTabs from '@/components/nav-tabs';
import Head from 'next/head';

const OrganizationLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <OrganizationContextProvider>
      <OrgLayoutContent>{children}</OrgLayoutContent>
    </OrganizationContextProvider>
  );
};

const OrgLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) orgCtx.updateAll(id);
    else orgCtx.cleanUp();
  }, [router.query.id]);

  // TODO: whether to updateBasicInfo depend on children here:
  // if enable, user's role will be updated immediately when switching tabs in the same organization, but increase the times of api call.
  // if disable, user's role will be updated only when organization-id (in router) is changed.

  // useEffect(() => {
  //   const id = Number(router.query.id);
  //   if (id) orgCtx.updateBasicInfo(id);
  // }, [children]); 

  const orgMenuItems = [
    { icon: FiHome, label: 'overview', owner_only: false },
    { icon: FiBook, label: 'projects', owner_only: false },
    { icon: FiUser, label: 'members', owner_only: false },
    { icon: FiMessageSquare, label: 'discussion', owner_only: !(orgCtx.basicInfo?.is_discussion_enabled)},
    { icon: FiSettings, label: 'settings', owner_only: true },
  ];

  if (!orgCtx.mounted) return (
    <>
      <Head>
        <title>{`${t('General.loading')} - Unica`}</title>
        <meta name="headerTitle" content={t(`General.loading`)}/>
      </Head>
    </>
  );

  if (router.pathname === '/organizations/[id]/invitation') return (
    <>
      <Head>
        <title>{orgCtx.basicInfo?.display_name}</title>
        <meta name="headerTitle" content={orgCtx.basicInfo?.display_name} />
      </Head>
      {children}
    </>
  )

  return (
    <>
      <Head>
        <title>{orgCtx.basicInfo?.display_name}</title>
        <meta name="headerTitle" content={orgCtx.basicInfo?.display_name} />
      </Head>
      <VStack spacing={6} align="stretch">
        <NavTabs
          items={orgMenuItems
            .filter(item => !item.owner_only || (item.owner_only && orgCtx.userRole === MemberRoleEnum.OWNER))
            .map((item) => ({
              label:
                <HStack spacing={2}>
                  <Icon as={item.icon} />
                  <Text>{t(`OrganizationPages.${item.label}.title`)}</Text>
                  {item.label === 'projects' && 
                    <Text className='secondary-text' ml={-1.5}>
                      ({orgCtx.basicInfo?.project_count})
                    </Text>
                  }
                  {item.label === 'members' && 
                    <Text className='secondary-text' ml={-1.5}>
                      ({orgCtx.basicInfo?.member_count})
                    </Text>
                  }
                </HStack>
              ,
              value: `/organizations/${router.query.id}/${item.label}`,
          }))}
          onClick={(value) => { router.push(value) }}
          selectedKeys={[router.asPath]}
        />
        {children}
      </VStack>
    </>
  );
};

export default OrganizationLayout;
