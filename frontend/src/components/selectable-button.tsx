import React from 'react';
import { Button, ButtonProps, Text, useColorModeValue } from '@chakra-ui/react';

interface SelectableButtonProps extends ButtonProps {
    isSelected?: boolean;
    selectedColor?: string;
  }
  
const SelectableButton: React.FC<SelectableButtonProps> = ({ isSelected, selectedColor = 'gray.800', children, ...props }) => {
  const selectedBg = useColorModeValue('gray.200', 'gray.700');

  return (
    <Button
      variant='ghost'
      size='sm'
      bg={isSelected ? selectedBg : 'transparent'}
      color={isSelected ? selectedColor : 'inherit'}
      fontWeight="normal"
      textAlign="left"
      justifyContent="flex-start"
      {...props}
    >
      {children}
    </Button>
  );
};

export default SelectableButton;
