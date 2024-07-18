import React, { useState, useEffect, useContext } from 'react';
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
import MainSider from '@/components/main-sider';

const MainLayout = ({ children }) => {
  const authCtx = useContext(AuthContext);
  if (!authCtx.isLoggedIn) {return <>{children}</>;}

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [headerText, setHeaderText] = useState('');
  const [headerExtra, setHeaderExtra] = useState(null);

  useEffect(() => {
    const headerTextMeta = document.querySelector('meta[name="headerText"]') as HTMLMetaElement;;
    if (headerTextMeta) {
      setHeaderText(headerTextMeta.content);
    }
  }, [children]);

  return (
    <Flex h="100vh">
      {/* Desktop Sidebar */}
      <Show above='md'>
        <Box
          display={{ base: 'none', md: 'block' }}
          w="xs"
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
            <IconButton
              display={{ base: 'inline-flex', md: 'none' }}
              aria-label="Open Menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
            />
            <Text fontSize="lg" ml={4}>{headerText}</Text>
          </Flex>
          <Box>
            {headerExtra}
          </Box>
        </Flex>

        {/* Content */}
        <Box as="main" p={4}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default MainLayout;