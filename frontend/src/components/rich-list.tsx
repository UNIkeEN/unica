import React from "react";
import NextLink from 'next/link'
import { 
  Flex, 
  VStack,
  HStack, 
  Divider,
  Link, 
  Text,
  Box,
  BoxProps,
  TextProps,
  LinkProps
} from "@chakra-ui/react";

interface RichListItem {
  title: string | React.ReactNode;
  href?: string;
  subtitle?: string | React.ReactNode;
  body?: React.ReactNode;
  titleExtra?: React.ReactNode;
  lineExtra?: React.ReactNode;
}

interface RichListProps extends BoxProps {
  titleAsLink?: boolean;
  titleProps?: TextProps | LinkProps;
  items: RichListItem[];
}

const RichList: React.FC<RichListProps> = ({ 
  titleAsLink = false, 
  titleProps,
  items, 
  ...boxProps 
}) => {
  return (
    <Box {...boxProps}>
      {items && items.length > 0 && <Divider />}
      {items.map((item) => (
        <>
          <Flex px={4} py={4} justify="space-between" alignItems="center">
            <VStack spacing={2} mr={2} align="start" overflow="hidden">
              <HStack spacing={2} flexWrap="wrap">
                {titleAsLink ? (
                  <Link 
                    as={NextLink} 
                    href={item.href}
                    wordBreak="break-all"
                    {...{
                      fontSize: "md",
                      fontWeight: "semibold",
                      color: "blue.500",
                      _hover: { 
                        textDecoration: "underline",
                        color: "blue.500"
                      },
                      ...titleProps,
                    } as LinkProps}
                  >
                    {item.title}
                  </Link>
                ) : (
                  typeof item.title === "string" ? (
                  <Text 
                    wordBreak="break-all"
                    {...{
                      fontSize: "md",
                      fontWeight: "semibold",
                      color: "black",
                      ...titleProps,
                    } as TextProps}
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
    </Box>
  );
}

export default RichList;