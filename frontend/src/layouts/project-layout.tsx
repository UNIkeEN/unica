import React, { useContext, useEffect } from 'react';
import { VStack, Text, HStack, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import { FiTrello, FiBookOpen, FiSettings } from 'react-icons/fi';
import ProjectContext, { ProjectContextProvider } from '@/contexts/project';
import NavTabs from '@/components/nav-tabs';
import Head from 'next/head';

export const ProjectLayoutTab = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const projMenuItems = [
    { icon: FiTrello, label: 'board' },
    { icon: FiBookOpen, label: 'wiki' },
    { icon: FiSettings, label: 'settings' },
  ];

  return (
    <NavTabs
      items={projMenuItems
        .map((item) => ({
          label:
            <HStack spacing={2}>
              <Icon as={item.icon} />
              <Text>{t(`ProjectPages.${item.label}.title`)}</Text>
            </HStack>
          ,
          value: `/projects/${router.query.id}/${item.label}`,
      }))}
      onClick={(value) => { router.push(value) }}
      selectedKeys={[router.asPath]}
    />
  )
}

const ProjectLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProjectContextProvider>
      <ProjectLayoutContent>{children}</ProjectLayoutContent>
    </ProjectContextProvider>
  );
};

const ProjectLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const projCtx = useContext(ProjectContext);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) projCtx.updateAll(id);
    else projCtx.cleanUp();
  }, [router.query.id]);

  if (!projCtx.mounted) return (
    <>
      <Head>
        <title>{`${t('General.loading')} - Unica`}</title>
        <meta name="headerTitle" content={t(`General.loading`)}/>
      </Head>
    </>
  );

  return (
    <>
      <Head>
        <title>{projCtx.basicInfo?.display_name}</title>
        <meta name="headerTitle" content={projCtx.basicInfo?.display_name} />
        {projCtx.basicInfo.owner && // owner has value when owner_type is organization
          <meta name="headerBreadcrumbs" content={
            JSON.stringify([
              { text: projCtx.basicInfo.owner.display_name, link: `/organizations/${projCtx.basicInfo.owner.id}/overview` },
            ])} 
          />
        }
      </Head>
      <VStack spacing={6} align="stretch">
        {children}
      </VStack>
    </>
  );
};

export default ProjectLayout;
