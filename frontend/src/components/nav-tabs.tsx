import React from 'react';
import { Tabs, TabList, Tab } from '@chakra-ui/react';
import { NavMenuProps as NavTabsProps } from '@/components/nav-menu';

const NavTabs: React.FC<NavTabsProps> = ({
  items,
  selectedKeys = [],
  onClick,
}) => {
  const selectedIndex = items.findIndex(item => selectedKeys.includes(item.value));

  return (
    <Tabs 
      variant='soft-rounded'
      size='sm'
      index={selectedIndex}
    >
      <TabList>
        {items.map((item, index) => (
          <Tab 
            key={item.value}
            onClick={() => onClick && onClick(item.value)}
            fontWeight={selectedIndex === index ? '600' : 'normal'}
          >
            {item.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default NavTabs;
