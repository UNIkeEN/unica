import Link from "next/link";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  VStack,
  Icon,
  HStack
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import NavMenu from '@/components/nav-menu';
import { FiHome, FiSettings } from "react-icons/fi";

const MainSider = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const topMenuItems = [
    { icon: FiHome, label: t('HomePage.header'), value: '/home' },
    { icon: FiSettings, label: t('SettingsPage.header'), value: '/settings' },
  ];

  return (
    <VStack spacing={8} align="stretch">
      <Popover placement="bottom-start" closeOnBlur>
        <PopoverTrigger>
          <Button 
            variant='ghost' 
            mt={-2} 
            size='sm' 
            textAlign="left"
            justifyContent="flex-start">
            <Text fontSize="lg" fontWeight="normal">User Placeholder</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent width="auto">
          <PopoverBody>Popover</PopoverBody>
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
  );
};

export default MainSider;