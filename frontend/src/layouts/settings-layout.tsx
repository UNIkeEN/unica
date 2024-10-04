import { useContext, useEffect } from "react";
import React from "react";
import { Grid, GridItem, VStack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import AuthContext from "@/contexts/auth";
import NavMenu from "@/components/common/nav-menu";

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
    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
      <GridItem colSpan={2}>
        <VStack mt={8} align="stretch">
          <NavMenu
            spacing={2}
            selectedKeys={[router.asPath]}
            onClick={(value) => {
              router.push(value);
            }}
            items={settingItems.map((item) => ({
              label: t(`SettingsPages.${item}.title`),
              value: `/settings/${item}`,
            }))}
          />
        </VStack>
      </GridItem>
      <GridItem colSpan={9}>{children}</GridItem>
    </Grid>
  );
};

export default SettingsLayout;
