import React from 'react';
import { Button, ButtonProps, useColorModeValue, useTheme } from '@chakra-ui/react';

interface SelectableButtonProps extends ButtonProps {
  isSelected?: boolean;
}

const SelectableButton: React.FC<SelectableButtonProps> = ({ isSelected = false, colorScheme = 'gray', children, ...props }) => {
  const theme = useTheme();

  const selectedBg = theme.colors[colorScheme][200];
  const selectedColor = theme.colors[colorScheme][900];
  const defaultColor = theme.colors[colorScheme][600];

  return (
    <Button
      variant='ghost'
      size='sm'
      bg={isSelected ? selectedBg : 'transparent'}
      color={isSelected ? selectedColor : defaultColor}
      fontWeight="normal"
      textAlign="left"
      justifyContent="flex-start"
      _hover={{
        bg: isSelected ? selectedBg : theme.colors[colorScheme][100],
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
