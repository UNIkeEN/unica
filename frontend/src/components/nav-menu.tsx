import React from 'react';
import { VStack, Tooltip } from '@chakra-ui/react';
import SelectableButton from '@/components/selectable-button';

export interface MenuItem {
  label: React.ReactNode;
  value: any;
  tooltip?: string;
}

export interface NavMenuProps {
  items: MenuItem[];
  selectedKeys?: any[];
  onClick?: (value: any) => void;
  size?: string;
  spacing?: number;
}

const NavMenu: React.FC<NavMenuProps> = ({
  items,
  selectedKeys = [],
  onClick,
  size = 'sm',
  spacing = 0.5
}) => {
  return (
    <VStack spacing={spacing} align="stretch">
      {items.map((item) => (
        <Tooltip label={item.tooltip} placement="right">
          <VStack align="stretch">
            <SelectableButton
              key={item.value}
              size={size}
              isSelected={selectedKeys.includes(item.value)}
              onClick={() => onClick && onClick(item.value)}
            >
              {item.label}
            </SelectableButton>
          </VStack>
        </Tooltip>
      ))}
    </VStack>
  );
};

export default NavMenu;
