import React from 'react';
import { Button, ButtonProps, useColorModeValue, useTheme } from '@chakra-ui/react';

interface SelectableButtonProps extends ButtonProps {
  isSelected?: boolean;
}

const SelectableButton: React.FC<SelectableButtonProps> = ({ isSelected = false, colorScheme = 'gray', children, ...props }) => {
  const theme = useTheme();

  const selectedBg = theme.colors["blackAlpha"][100];
  const selectedColor = theme.colors[colorScheme][900];
  const defaultColor = theme.colors[colorScheme][600];

  return (
    <Button
      variant='ghost'
      bg={isSelected ? selectedBg : 'transparent'}
      color={isSelected ? selectedColor : defaultColor}
      textAlign="left"
      justifyContent="flex-start"
      overflow="hidden"
      _hover={{
        bg: isSelected ? selectedBg : theme.colors["blackAlpha"][50],
      }}
      _active={{
        bg: theme.colors[colorScheme][200],
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SelectableButton;
