import { useContext } from "react";
import {
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  IconButton,
  Avatar,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import UserMenuArea from "@/components/user-menu-area";
import NavMenu from '@/components/common/nav-menu';
import SelectableButton from "@/components/common/selectable-button";
import UserContext from '@/contexts/user';
import { 
  FiHome,
  FiBook,
  FiUsers,
  FiSettings, 
  FiGithub, 
  FiHelpCircle, 
} from "react-icons/fi";


const MainSider = ({ onSwitchSider = () => {} }) => {
  
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const { t } = useTranslation();

  const topMenuItems = [
    { icon: FiHome, label: t('HomePage.header'), value: '/home' },
    { icon: FiBook, label: t('MyProjectsPage.header'), value: '/projects' },
    { icon: FiUsers, label: t('MyOrganizationsPage.header'), value: '/organizations' },
    { icon: FiSettings, label: t('SettingsPages.header'), value: '/settings' },
  ];

  return (
    <Flex direction="column" h="100%" justifyContent="space-between">
      <VStack spacing={8} align="stretch" overflowY="auto">
        
        <UserMenuArea onSwitchSider={onSwitchSider}/>
                
        {/* Top Menu */}
        <NavMenu 
          items={topMenuItems.map((item) => ({
            value: item.value,
            label: 
              <HStack spacing={2}>
                <Icon as={item.icon} />
                <Text fontSize="md">{item.label}</Text>
              </HStack>
          }))}
          onClick={(value) => {router.push(value)}}
          selectedKeys={[router.asPath]}
        />

        {/* Pinned Projects */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="sm" className="secondary-text" ml={3}>{t('MainSider.pinned.title')}</Text>
        </VStack>

        {/* Recent Projects */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="sm" className="secondary-text" ml={3}>{t('MainSider.recent.title')}</Text>
        </VStack>

        {/* Organizations */}
        {userCtx.organizations && userCtx.organizations.length>0 &&
          <VStack spacing={2} align="stretch">
            <Text fontSize="sm" className="secondary-text" ml={3}>{t('MainSider.my-organizations.title')}</Text>
            <NavMenu 
              items={userCtx.organizations.slice(0, 5).map((item) => ({
                value: `/organizations/${item.id}/overview`,
                label: 
                    <HStack spacing={2} overflow="hidden">
                      <Avatar size="2xs" name={item.display_name}/>
                      <Text fontSize="md" overflow="hidden" textOverflow="ellipsis">{item.display_name}</Text>
                    </HStack>
              }))}
              onClick={(value) => {router.push(value)}}
              selectedKeys={[router.asPath]}/>
              {
                userCtx.organizations.length>5 &&
                <SelectableButton mt={-1.5} fontSize="xs" size="sm" onClick={() => {router.push('/organizations')}}>
                  <Text />{t('MainSider.my-organizations.button.more')}<Text/>
                </SelectableButton>
              }
          </VStack>
        }

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