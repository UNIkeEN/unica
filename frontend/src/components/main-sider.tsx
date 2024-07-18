import { use, useContext, useEffect } from "react";
import Link from "next/link";
import {
  Button,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Divider,
  Text,
  VStack,
  HStack,
  Icon,
  IconButton,
  Avatar
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import NavMenu from '@/components/nav-menu';
import SelectableButton from "@/components/selectable-button";
import { Logout } from "@/services/auth";
import AuthContext from "@/contexts/auth";
import { 
  FiHome, 
  FiSettings, 
  FiGithub, 
  FiHelpCircle, 
  FiLogOut 
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
    { icon: FiSettings, label: t('SettingsPage.header'), value: '/settings' },
  ];

  return (
    <Flex direction="column" h="100%" justifyContent="space-between">
      <VStack spacing={8} align="stretch">
        <Popover placement="bottom-start" closeOnBlur>
          <PopoverTrigger>
            <Button 
              variant='ghost'  
              size='sm' 
              textAlign="left"
              justifyContent="flex-start"
            >
              <HStack spacing={3}>
                <Avatar size="xs"/>
                <Text fontSize="lg" fontWeight="normal">{authCtx.userInfo?.name}</Text>
              </HStack>
            </Button>
          </PopoverTrigger>
          <PopoverContent width="auto">
            <PopoverBody p={2}>
              <VStack 
                spacing={2} 
                align="stretch"
              >
                <Text fontSize="xs" fontWeight="normal" pl={2} pr={2} color="gray.500">{authCtx.userInfo?.email}</Text>
                <Text fontSize="lg" fontWeight="normal" pl={2} pr={2} mt={-2}>{authCtx.userInfo?.name}</Text>
                <Divider/>
                  <SelectableButton
                    size="xs"
                    colorScheme="red"
                    onClick={() => {Logout(); authCtx.onLogout();}}
                  >
                    <HStack spacing={2}>
                      <Icon as={FiLogOut} />
                      <Text fontSize="xs">{t('MainSider.user_popover.button.logout')}</Text>
                    </HStack>
                  </SelectableButton>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <NavMenu 
          items={topMenuItems.map((item) => ({
            value: item.value,
            label: 
              <Link href={item.value}>
                <HStack spacing={2}>
                  <Icon as={item.icon} />
                  <Text 
                    fontSize="md"
                    // fontWeight={router.asPath === item.value ? 'bold' : 'normal'}
                  >{item.label}</Text>
                </HStack>
              </Link>,
          }))}
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
            href="/help"
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