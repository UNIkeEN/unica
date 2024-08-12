import React from 'react';
import { VStack, HStack, Link, Text, Box, Hide, Show, } from '@chakra-ui/react';
import NextLink from 'next/link';

const MainHeader = ({ breadcrumbs, title }) => {
  return (
    <Box>
      <Hide above='md'>
        <VStack ml={6} spacing={0.5} align="flex-start">
          <HStack>
            {
              breadcrumbs && breadcrumbs.map((item: any, index: number) => (
                <>
                  <Link as={NextLink} fontSize="sm" href={item.link} color="gray.500">{item.text}</Link>
                  {index !== breadcrumbs.length - 1 && <Text fontSize="xs">/</Text>}
                </>
              ))
            }
          </HStack>
          <Text fontSize="lg">{title}</Text>
        </VStack>
      </Hide>
            
      <Show above='md'>
        <HStack ml={4} spacing={3}>
          {
            breadcrumbs && breadcrumbs.map((item: any) => (
              <>
                <Link as={NextLink} fontSize="lg" href={item.link} color="gray.500">{item.text}</Link>
                <Text fontSize="md">/</Text>
              </>
            ))
          }
          <Text fontSize="lg">{title}</Text>
        </HStack>
      </Show>
    </Box>
  );
};

export default MainHeader;
