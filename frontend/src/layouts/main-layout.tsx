import React, { useState, useEffect, useContext } from 'react';
import {
	Box,
	Flex,
	Drawer,
	DrawerBody,
	DrawerOverlay,
	DrawerContent,
	useDisclosure,
	IconButton,
  Show, 
  Hide
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import AuthContext from '@/contexts/auth';
import UserContext from '@/contexts/user';
import MainSider from '@/components/main-sider';
import MainHeader from '@/components/main-header';

const MainLayout = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerBreadcrumbs, setHeaderBreadcrumbs] = useState(null);
  const [headerExtra, setHeaderExtra] = useState(null); // TODO: get and set headerExtra from meta tag
  const [pageBgColor, setPageBgColor] = useState('white');

  const updateHeader = () => {
    const headerTitleMeta = document.querySelector('meta[name="headerTitle"]') as HTMLMetaElement;
    const headerBreadcrumbsMeta = document.querySelector('meta[name="headerBreadcrumbs"]') as HTMLMetaElement;
    if (headerTitleMeta) {
      setHeaderTitle(headerTitleMeta.content);
    } else {
      setHeaderTitle('')
    }
    if (headerBreadcrumbsMeta) {
      try {
        const breadcrumbs = JSON.parse(headerBreadcrumbsMeta.content);
        setHeaderBreadcrumbs(breadcrumbs);
      } catch (error) {
        console.error("Invalid breadcrumbs format:", error);
        setHeaderBreadcrumbs(null);
      }
    } else {
      setHeaderBreadcrumbs(null);
    }
  };

  const updateStyleMetas = () => {
    const pageBgColorMeta = document.querySelector('meta[name="pageBgColor"]') as HTMLMetaElement;
    if (pageBgColorMeta) {
      setPageBgColor(pageBgColorMeta.content);
    } else {
      setPageBgColor('white');
    }
  }

  useEffect(() => {
    updateStyleMetas();

    const observer = new MutationObserver(()=>{updateHeader(); updateStyleMetas();});
    observer.observe(document.head, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [children]);

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      userCtx.updateAll();
    }
  },[]);
  
  if (!authCtx.isLoggedIn) {return <>{children}</>;}

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Desktop Sidebar */}
      <Show above='md'>
        <Box
          display='block'
          w="2xs"
          bg="gray.50"
          p={4}
          overflowY="auto"
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
          autoFocus={false}
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
      <Flex flex="1" direction="column" borderLeftWidth="1px" overflow="hidden" bg={pageBgColor}>
        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          p={4}
          borderBottomWidth="1px"
          position="sticky"
          top="0"
          zIndex="10"
          bg="white"
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
            <MainHeader title={headerTitle} breadcrumbs={headerBreadcrumbs} />
          </Flex>
          <Box>
            {headerExtra}
          </Box>
        </Flex>

        {/* Content */}
        <Box 
          as="main" 
          p={6} 
          maxWidth="1200px" 
          mx="auto" 
          w="full"
          overflow="auto"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout;