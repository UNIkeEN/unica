import {
  Flex,
  Text,
  VStack,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import NavMenu from '@/components/common/nav-menu';
import SelectableButton from "@/components/common/selectable-button";
import { 
  FiHome,
  FiBook,
  FiUsers,
  FiSettings, 
  FiGithub, 
  FiHelpCircle,
  FiClock,
  FiBookmark,
  FiChevronsRight
} from "react-icons/fi";


const MainSiderSmall = ({ onSwitchSider }) => {
  
  const router = useRouter();
  const { t } = useTranslation();

  const topMenuItems = [
    { icon: FiHome, label: t('HomePage.header'), value: '/home' },
    { icon: FiBook, label: t('MyProjectsPage.header'), value: '/projects' },
    { icon: FiUsers, label: t('MyOrganizationsPage.header'), value: '/organizations' },
    { icon: FiSettings, label: t('SettingsPages.header'), value: '/settings' },
  ];

  return (
    <Flex direction="column" h="100%" justifyContent="space-between">
      <VStack spacing={2} overflowY="auto">
        <SelectableButton size="sm" colorScheme="gray" onClick={onSwitchSider}>
          <FiChevronsRight/>
        </SelectableButton>
        {/* Top Menu */}
        <NavMenu 
          items={topMenuItems.map((item) => ({
            value: item.value,
            label: <Icon as={item.icon} />,
            tooltip: item.label
          }))}
          onClick={(value) => {router.push(value)}}
          selectedKeys={[router.asPath]}
        />
        <Divider/>
        <VStack spacing={0.5}>
          {/* Pinned Projects */}
          <SelectableButton size="sm">
            <FiBookmark />
          </SelectableButton>
          {/* Recent Projects */}
          <SelectableButton size="sm">
            <FiClock />
          </SelectableButton>
        </VStack>
      </VStack>

      <VStack spacing={2}>
        <a target="_blank" href="https://github.com/UNIkeEN/unica/wiki">
          <SelectableButton size="sm">
            <FiHelpCircle />
          </SelectableButton>
        </a>
        <a target="_blank" href="https://github.com/UNIkeEN/unica">
          <SelectableButton size="sm">
            <FiGithub />
          </SelectableButton>
        </a>
        <Text 
          fontSize="sm"
          bgGradient='linear(to-l, #C080E0, #7FACD9)'
          bgClip='text'
        >
          UNICA
        </Text>
      </VStack>
    </Flex>
  );
};

export default MainSiderSmall;