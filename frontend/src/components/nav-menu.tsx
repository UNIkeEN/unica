import React from 'react';
import { VStack } from '@chakra-ui/react';
import SelectableButton from '@/components/selectable-button';

interface MenuItem {
  label: React.ReactNode;
  value: string;
}

interface NavMenuProps {
  items: MenuItem[];
  selectedKeys?: string[];
  onClick?: (value: string) => void;
  selectedColor?: string;
}

const NavMenu: React.FC<NavMenuProps> = ({
  items,
  selectedKeys = [],
  onClick,
  selectedColor = 'black',
}) => {
  return (
    <VStack spacing={2} align="stretch">
      {items.map((item) => (
        <SelectableButton
          key={item.value}
          isSelected={selectedKeys.includes(item.value)}
          selectedColor={selectedColor}
          onClick={() => onClick && onClick(item.value)}
        >
          {item.label}
        </SelectableButton>
      ))}
    </VStack>
  );
};

export default NavMenu;
