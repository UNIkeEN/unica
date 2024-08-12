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
  size?: string;
}

const NavMenu: React.FC<NavMenuProps> = ({
  items,
  selectedKeys = [],
  onClick,
  size = 'sm'
}) => {
  return (
    <VStack spacing={0.5} align="stretch">
      {items.map((item) => (
        <SelectableButton
          key={item.value}
          size={size}
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
