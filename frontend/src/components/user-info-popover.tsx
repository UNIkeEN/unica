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
  Icon,
  Avatar
} from '@chakra-ui/react';
import { FiLogOut } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import SelectableButton from "@/components/selectable-button";
import { Logout } from "@/services/auth";
import AuthContext from "@/contexts/auth";
import UserContext from "@/contexts/user";

const UserInfoPopover = () => {

  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const { t } = useTranslation();

  return (
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
                onClick={() => {
                  authCtx.onLogout();
                  Logout(); 
                  router.push('/login');
                }}
              >
                <HStack spacing={2}>
                  <Icon as={FiLogOut} />
                  <Text fontSize="xs">{t('MainSider.user-popover.button.logout')}</Text>
                </HStack>
              </SelectableButton>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default UserInfoPopover;