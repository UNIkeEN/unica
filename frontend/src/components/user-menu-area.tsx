import { useContext, useEffect } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Divider,
  Text,
  VStack,
  HStack,
  Flex,
  Icon,
  IconButton,
  Avatar,
  Portal,
  Show,
  Hide
} from '@chakra-ui/react';
import { FiLogOut } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import SelectableButton from "@/components/selectable-button";
import { Logout } from "@/services/auth";
import AuthContext from "@/contexts/auth";
import UserContext from "@/contexts/user";

const UserMenuArea = () => {

  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const { t } = useTranslation();

  const handleLogout = () => {
    authCtx.onLogout();
    Logout(); 
    router.push('/login');
  }

  return (
    <>
      <Show above="md">
        <Popover placement="bottom-start" closeOnBlur trigger="hover" isLazy>
          <PopoverTrigger>
            <Button 
              variant='ghost'  
              size='sm' 
              textAlign="left"
              justifyContent="flex-start"
            >
              <HStack spacing={3}>
                <Avatar size="xs"/>
                <Text fontSize="lg" fontWeight="normal">{userCtx.basicInfo?.display_name}</Text>
              </HStack>
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent width="auto">
              <PopoverBody p={2}>
                <VStack 
                  spacing={2} 
                  align="stretch"
                >
                  <Text fontSize="xs" fontWeight="normal" px={2} className="secondary-text">{userCtx.basicInfo?.email}</Text>
                  <Text fontSize="lg" fontWeight="normal" px={2} mt={-2}>{userCtx.basicInfo?.display_name}</Text>
                  <Divider/>
                    <SelectableButton
                      size="xs"
                      colorScheme="red"
                      onClick={handleLogout}
                    >
                      <HStack spacing={2}>
                        <Icon as={FiLogOut} />
                        <Text fontSize="xs">{t('MainSider.user-popover.button.logout')}</Text>
                      </HStack>
                    </SelectableButton>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Show>

      <Hide above="md">
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Button 
            variant='ghost'  
            size='sm' 
            textAlign="left"
            justifyContent="flex-start"
          >
            <HStack spacing={3}>
              <Avatar size="xs"/>
              <Text fontSize="lg" fontWeight="normal">{userCtx.basicInfo?.display_name}</Text>
            </HStack>
          </Button>
          <IconButton 
            icon={<FiLogOut/>} 
            aria-label="logout"
            variant="ghost"
            colorScheme="red"
            onClick={handleLogout}
            />
        </Flex>
      </Hide>
    </>
  )
}

export default UserMenuArea;