import React, { useContext, useEffect } from "react";
import { 
  Grid, 
  GridItem, 
  VStack, 
  Icon, 
  HStack,
  Text
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { LuUser2, LuPalette } from "react-icons/lu";
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

  const settingsDomainList = [
    {key: "profile", icon: LuUser2},
    {key: "appearance", icon: LuPalette}
  ];

  return (
    <Grid mt={2} templateColumns="2fr 7fr" gap={6} minW="md">
      <GridItem>
        <VStack align="stretch">
          <NavMenu
            spacing={2}
            selectedKeys={[router.asPath]}
            onClick={(value) => {
              router.push(value);
            }}
            items={settingsDomainList.map((item) => ({
              label: 
              <HStack spacing={2} overflow="hidden">
                <Icon as={item.icon}/>
                <Text fontSize="md">{t(`SettingsPages.${item.key}.title`)}</Text>
              </HStack>,
              value: `/settings/${item.key}`,
            }))}
          />
        </VStack>
      </GridItem>
      <GridItem>{children}</GridItem>
    </Grid>
  );
};

export default SettingsLayout;
