import React from 'react';
import { VStack } from '@chakra-ui/react';
import SelectableButton from '@/components/selectable-button';

export interface MenuItem {
  label: React.ReactNode;
  value: string;
}

export interface NavMenuProps {
  items: MenuItem[];
  selectedKeys?: string[];
  onClick?: (value: string) => void;
}

const NavMenu: React.FC<NavMenuProps> = ({
  items,
  selectedKeys = [],
  onClick,
}) => {
  return (
    <VStack spacing={2} align="stretch">
      {items.map((item) => (
        <SelectableButton
          key={item.value}
          isSelected={selectedKeys.includes(item.value)}
          onClick={() => onClick && onClick(item.value)}
        >
          {item.label}
        </SelectableButton>
      ))}
    </VStack>
  );
};

export default NavMenu;
