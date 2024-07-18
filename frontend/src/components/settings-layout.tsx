// components/SettingsLayout.tsx
import React from 'react';
import { VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import NavTabs from '@/components/nav-tabs';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const settingItems = ["profile", "appearance"];

  return (
    <VStack spacing={4} align="stretch">
      <NavTabs 
        items={settingItems.map((item) => ({
            label: t(`SettingsPage.${item}.title`),
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
