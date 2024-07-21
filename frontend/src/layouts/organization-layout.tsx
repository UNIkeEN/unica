import React, { use, useContext, useEffect } from 'react';
import { VStack, Text, HStack, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import { FiHome, FiBook, FiUser } from 'react-icons/fi';
import AuthContext from "@/contexts/auth";
import OrganizationContext, { OrganizationContextProvider } from '@/contexts/organization';
import NavTabs from '@/components/nav-tabs';
import Head from 'next/head';

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

const OrganizationLayout: React.FC<OrganizationLayoutProps> = ({ children }) => {
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
    if (id) {
      orgCtx.updateAll(id);
    } else {
      orgCtx.cleanUp();
    }
  }, [router.query.id]);

  const orgMenuItems = [
    { icon: FiHome, label: 'overview' },
    { icon: FiBook, label: 'projects' },
    { icon: FiUser, label: 'members' },
  ];

  return (
    <>
      <Head>
        <title>{orgCtx.basicInfo?.display_name}</title>
        <meta name="headerTitle" content={orgCtx.basicInfo?.display_name} />
      </Head>
      <VStack spacing={6} align="stretch">
        <NavTabs
          items={orgMenuItems.map((item) => ({
            label:
              <HStack spacing={2}>
                <Icon as={item.icon} />
                <Text>{t(`OrganizationPages.${item.label}.title`)}</Text>
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
