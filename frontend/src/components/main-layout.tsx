import React, { useState, useEffect } from 'react';
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
  Text
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import MainSider from '@/components/main-sider';

const MainLayout = ({ children }) => {
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
      <Box
        display={{ base: 'none', md: 'block' }}
        w="xs"
        bg="gray.100"
        p={4}
      >
        <MainSider />
      </Box>

      {/* Mobile Sidebar Drawer */}
      <Drawer 
        placement="left" 
        onClose={onClose} 
        isOpen={isOpen} 
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody bg="gray.100">
            <MainSider />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content Area */}
      <Box flex="1">
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