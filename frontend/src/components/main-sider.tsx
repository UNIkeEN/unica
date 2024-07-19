import { useContext, useEffect } from "react";
import {
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import UserInfoPopover from "@/components/user-info-popover";
import NavMenu from '@/components/nav-menu';
import AuthContext from "@/contexts/auth";
import { 
  FiHome,
  FiBook,
  FiUsers,
  FiSettings, 
  FiGithub, 
  FiHelpCircle, 
} from "react-icons/fi";

const MainSider = () => {
  
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (authCtx.userInfo === undefined) {
      authCtx.updateUserInfo();
    }
  },[]);

  const topMenuItems = [
    { icon: FiHome, label: t('HomePage.header'), value: '/home' },
    { icon: FiBook, label: t('MyProjectsPage.header'), value: '/projects' },
    { icon: FiUsers, label: t('MyOrganizationsPage.header'), value: '/organizations' },
    { icon: FiSettings, label: t('SettingsPage.header'), value: '/settings' },
  ];

  return (
    <Flex direction="column" h="100%" justifyContent="space-between">
      <VStack spacing={8} align="stretch">
        <UserInfoPopover />

        <NavMenu 
          items={topMenuItems.map((item) => ({
            value: item.value,
            label: 
                <HStack spacing={2}>
                  <Icon as={item.icon} />
                  <Text 
                    fontSize="md"
                  >{item.label}</Text>
                </HStack>
          }))}
          onClick={(value) => {router.push(value)}}
          selectedKeys={[router.asPath]}/>
      </VStack>
      
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        <Text 
          fontSize="md" 
          bgGradient='linear(to-l, #C080E0, #7FACD9)'
          bgClip='text'
        >
          UNICA
        </Text>
        <HStack spacing={2}>
          <IconButton
            as="a"
            target="_blank"
            href="https://github.com/UNIkeEN/unica/wiki"
            variant='ghost'
            aria-label='Help'
            icon={<FiHelpCircle />}
          />
          <IconButton
            as="a"
            target="_blank"
            href="https://github.com/UNIkeEN/unica"
            variant='ghost'
            aria-label='Github'
            icon={<FiGithub />}
          />
        </HStack>
      </Flex>
    </Flex>
  );
};

export default MainSider;