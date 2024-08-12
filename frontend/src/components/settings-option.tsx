import { Flex, VStack, Text } from "@chakra-ui/react";
import React from "react";

interface SettingsOptionProps {
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
}) => {
  return (
    <Flex px={6} py={2} justify="space-between" alignItems="center">
      <VStack spacing={0.5} alignItems="start">
        <Text fontSize="lg">
          {title}
        </Text>
        <Text fontSize="sm" color="gray.500">{description}</Text>
      </VStack>
      {children}
    </Flex>
  );
};

export default SettingsOption;
