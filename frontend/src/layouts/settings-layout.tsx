import { useContext, useEffect } from "react";
import React from 'react';
import { VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import AuthContext from "@/contexts/auth";
import NavTabs from '@/components/common/nav-tabs';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  const settingItems = ["profile", "appearance"];

  return (
    <VStack spacing={6} align="stretch">
      <NavTabs 
        items={settingItems.map((item) => ({
            label: t(`SettingsPages.${item}.title`),
            value: `/settings/${item}`,
        }))}
        onClick={(value) => {router.push(value)}}
        selectedKeys={[router.asPath]}
        />
      {children}
    </VStack>
  );
};

export default SettingsLayout;
