import { Flex, VStack, HStack, Text, BoxProps } from "@chakra-ui/react";
import React from "react";

interface SettingsOptionProps extends BoxProps {
  title: string;
  description: string;
  titleExtra?: string;
  children: React.ReactNode;
}

const SettingsOption: React.FC<SettingsOptionProps> = ({
  title,
  description,
  titleExtra,
  children,
  ...boxProps
}) => {
  return (
      <Flex justify="space-between" alignItems="self-start" {...boxProps}>
        <VStack spacing={1} mr={2} alignItems="start" overflow="hidden">
          <HStack spacing={2} flexWrap="wrap">
            <Text fontSize="md" className="subtitle-bold">
              {title}
            </Text>
            {titleExtra}
          </HStack>
          <Text fontSize="sm" color="gray.500">{description}</Text>
        </VStack>
        {children}
      </Flex>
  );
};

export default SettingsOption;
