import React from 'react';
import { Tabs, TabList, Tab } from '@chakra-ui/react';
import { NavMenuProps as NavTabsProps } from '@/components/nav-menu';

const NavTabs: React.FC<NavTabsProps> = ({
  items,
  size = 'sm',
  selectedKeys = [],    // always be [router.asPath]
  onClick,
}) => {
//   const selectedIndex = items.findIndex(item => selectedKeys.includes(item.value));
  const selectedIndex = items.findIndex(item => 
    selectedKeys.some(key => key.startsWith(item.value))
  );

  return (
    <Tabs 
      variant='soft-rounded'
      size={size}
      index={selectedIndex}
    >
      <TabList 
        className="no-scrollbar"
        overflowX="auto"
        whiteSpace="nowrap"
      >
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
