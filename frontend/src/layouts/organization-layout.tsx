import React, { useContext, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import AuthContext from "@/contexts/auth";
import NavTabs from '@/components/nav-tabs';

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

const OrganizationLayout: React.FC<OrganizationLayoutProps> = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  const orgMenuItems = ["overview"];

  return (
    <VStack spacing={6} align="stretch">
      <NavTabs 
        items={orgMenuItems.map((item) => ({
            label: t(`OrganizationPages.${item}.title`),
            value: `/organizations/${router.query.id}/${item}`,
        }))}
        onClick={(value) => {router.push(value)}}
        selectedKeys={[router.asPath]}
        />
      {children}
    </VStack>
  );
};

export default OrganizationLayout;
