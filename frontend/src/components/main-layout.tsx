import React, { useState, useEffect, useContext, use } from 'react';
import {
	Box,
	Flex,
	Drawer,
	DrawerBody,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useDisclosure,
	IconButton,
  Text,
  Show, 
  Hide
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import AuthContext from '@/contexts/auth';
import UserContext from '@/contexts/user';
import MainSider from '@/components/main-sider';

const MainLayout = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerExtra, setHeaderExtra] = useState(null);

  useEffect(() => {
    const headerTitleMeta = document.querySelector('meta[name="headerTitle"]') as HTMLMetaElement;;
    if (headerTitleMeta) {
      setHeaderTitle(headerTitleMeta.content);
    }
  }, [children]);

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      if (authCtx.userInfo === undefined) {
        authCtx.updateUserInfo();
      }
      userCtx.updateUserOrganizations();
    }
  },[]);
  
  if (!authCtx.isLoggedIn) {return <>{children}</>;}

  return (
    <Flex h="100vh">
      {/* Desktop Sidebar */}
      <Show above='md'>
        <Box
          display={{ base: 'none', md: 'block' }}
          w="2xs"
          bg="gray.50"
          p={4}
        >
          <MainSider />
        </Box>
      </Show>

      {/* Mobile Sidebar Drawer */}
      <Hide above='md'>
        <Drawer
          placement="left" 
          onClose={onClose} 
          isOpen={isOpen} 
          size="xs"
        >
          <DrawerOverlay />
          <DrawerContent>
            {/* <DrawerCloseButton /> */}
            <DrawerBody bg="gray.50" pt={4}>
              <MainSider />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Hide>

      {/* Main Content Area */}
      <Box flex="1" borderLeftWidth="1px">
        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          p={4}
          borderBottomWidth="1px"
        >
          <Flex align="center">
            <Hide above='md'>
              <IconButton
                display={{ base: 'inline-flex', md: 'none' }}
                aria-label="Open Menu"
                icon={<HamburgerIcon />}
                onClick={onOpen}
              />
            </Hide>
            <Text fontSize="lg" ml={2}>{headerTitle}</Text>
          </Flex>
          <Box>
            {headerExtra}
          </Box>
        </Flex>

        {/* Content */}
        <Box as="main" p={6} maxWidth="1200px" mx="auto" w="full">
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default MainLayout;