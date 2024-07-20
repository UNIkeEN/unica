import React from "react";
import NextLink from 'next/link'
import { 
  Flex, 
  VStack,
  HStack, 
  Divider,
  Link, 
  Text
} from "@chakra-ui/react";

interface LinkListItem {
  title: string | React.ReactNode;
  href: string;
  subtitle?: string | React.ReactNode;
  body?: React.ReactNode;
  titleExtra?: React.ReactNode;
  lineExtra?: React.ReactNode;
}

interface LinkListProps {
  items: LinkListItem[];
}

const LinkList: React.FC<LinkListProps> = ({ items }) => {
  return (
    <>
      {items.map((item) => (
        <>
          <Flex px={4} py={4} justify="space-between" alignItems="center">
            <VStack spacing={2} align="start">
              <HStack spacing={2}>
                <Link 
                  as={NextLink} 
                  fontSize="md"
                  color="blue.500"
                  fontWeight="semibold" 
                  href={item.href}
                >
                  {item.title}
                </Link>
                {item?.titleExtra}
              </HStack>
              {item.subtitle && 
                <Text fontSize="sm" className="secondary-text" mt={-1.5}>
                  {item.subtitle}
                </Text>
              }
              {item?.body}
            </VStack>
            {item?.lineExtra}
          </Flex>
          <Divider/>
          </>
      ))}
    </>
  );
}



export default LinkList;