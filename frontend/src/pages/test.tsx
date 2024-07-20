import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, VStack, Badge } from '@chakra-ui/react';

const ComponentTestPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      console.error('This page is only for development');
      router.push('/home');
    }
  },[]);

  return (
    <VStack>
        <Button variant="ghost" colorScheme='green'>Ghost</Button>
        <Button variant="subtle" colorScheme='green'>Subtle</Button>
        <Button variant="subtle" colorScheme='green' isDisabled>Subtle</Button>
        <Badge variant='subtle' colorScheme='green'>
            Removed
        </Badge>
    </VStack>
  );
};

export default ComponentTestPage;