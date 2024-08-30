import React from "react";
import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { FiInbox } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface EmptyProps {
  colorScheme?: string;
  size?: "sm" | "md" | "lg" | number;
  description?: string;
  children?: React.ReactNode;
}

const iconSizeMap: Record<"sm" | "md" | "lg", string> = {
  sm: "1.5em",
  md: "2.5em",
  lg: "4em",
};

const Empty: React.FC<EmptyProps> = ({
  colorScheme = "gray",
  size = "md",
  description,
  children

}) => {
  const { t } = useTranslation();
  const iconSize = typeof size === "number" ? `${size}px` : iconSizeMap[size] || "2.5em";
  const textSize = typeof size === "number" ? "md" : size;
  const isLargeSize = typeof size === "number" ? size > 40 : size === "lg";

  return (
    <Box textAlign="center" color={`${colorScheme}.500`} p={4} borderWidth="1px" borderRadius="md">
      {isLargeSize ? (
        <VStack spacing={4}>
          <HStack spacing={2} justifyContent="center" alignItems="center">
            <FiInbox size={iconSize} />
            <Text fontSize={textSize} color={`${colorScheme}.500`}>
              {description ? description : t("Empty.nodata")}
            </Text>
          </HStack>
          {children}
        </VStack>
      ) : (
        <HStack spacing={4} justifyContent="center" alignItems="center">
          <FiInbox size={iconSize} />
          <Text fontSize={textSize} color={`${colorScheme}.500`}>
            {description ? description : t("Empty.nodata")}
          </Text>
          {children}
        </HStack>
      )}
    </Box>
  );
};

export default Empty;
