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

interface RichListItem {
  title: string | React.ReactNode;
  href?: string;
  subtitle?: string | React.ReactNode;
  body?: React.ReactNode;
  titleExtra?: React.ReactNode;
  lineExtra?: React.ReactNode;
}

interface RichListProps {
  titleAsLink?: boolean;
  items: RichListItem[];
}

const RichList: React.FC<RichListProps> = ({ titleAsLink = false, items }) => {
  return (
    <>
      {items.map((item) => (
        <>
          <Flex px={4} py={4} justify="space-between" alignItems="center">
            <VStack spacing={2} mr={2} align="start" overflow="hidden">
              <HStack spacing={2} flexWrap="wrap">
                {titleAsLink ? (
                  <Link 
                    as={NextLink} 
                    fontSize="md"
                    color="blue.500"
                    fontWeight="semibold" 
                    href={item.href}
                    wordBreak="break-all"
                  >
                    {item.title}
                  </Link>
                ) : (
                  typeof item.title === "string" ? (
                  <Text 
                    fontSize="md"
                    fontWeight="semibold" 
                    wordBreak="break-all"
                  >
                    {item.title}
                  </Text>
                  ) : (item.title)
                )}
                {item?.titleExtra}
              </HStack>
              {item.subtitle && 
                <Text 
                  fontSize="sm" 
                  className="secondary-text" 
                  mt={-1}
                  wordBreak="break-all"
                >
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

export default RichList;