import React from "react";
import { Box, Text, VStack, HStack, Heading } from "@chakra-ui/react";
import { FiInbox } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface EmptyProps {
  colorScheme?: string;
  size?: "sm" | "md" | "lg" | number;
  description?: string;
  children?: React.ReactNode;
}

const iconSizeMap: Record<"sm" | "md" | "lg", string> = {
  sm: "2em",
  md: "3em",
  lg: "5em",
};

const Empty: React.FC<EmptyProps> = ({
  colorScheme = "gray",
  size = "md",
  description = "Empty.nodata",
  children
  
}) => {
  const iconSize = typeof size === "number" ? `${size}px` : iconSizeMap[size] || "3em";
  const textSize = typeof size === "number" ? "md" : size;
  const isLargeSize = typeof size === "number" ? size > 40 : size === "lg";
  const { t } = useTranslation();

  return (
    <Box textAlign="center" color={`${colorScheme}.500`} p={4} borderWidth="1px" borderRadius="md">
      {isLargeSize ? (
        <VStack spacing={4}>
          <HStack spacing={2} justifyContent="center" alignItems="center">
            <FiInbox size={iconSize} />
            <Text fontSize={textSize} color={`${colorScheme}.500`}>
              {t(description)}
            </Text>
          </HStack>
          {children}
        </VStack>
      ) : (
        <HStack spacing={4} justifyContent="center" alignItems="center">
          <FiInbox size={iconSize} />
          <Text fontSize={textSize} color={`${colorScheme}.500`}>
            {t(description)}
          </Text>
          {children}
        </HStack>
      )}
    </Box>
  );
};

const EmptyComponent = () => {

  const colorScheme = "blue";
  const size: "md" = "md";
  const description = 'Empty.nodata';
  const children = <Text>{/*children Text*/}</Text>;

  return (
    <Box p={8}>
      <Heading mb={4}>Empty title</Heading>
      <Empty
        colorScheme={colorScheme}
        size={size}
        description={description}
        children={children}
      />
    </Box>
  );
};

export default EmptyComponent;
