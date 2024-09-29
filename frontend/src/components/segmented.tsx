import { Box, Button, HStack, BoxProps } from "@chakra-ui/react";

interface SegmentedControlProps extends BoxProps {
  size?: "xs" | "sm" | "md" | "lg";
  colorScheme?: string;
  items: {label: string, value:(string | React.ReactNode)}[];
  selected: string;
  onSelectItem: (label: string) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  size = "md",
  colorScheme = "gray",
  items,
  selected,
  onSelectItem,
  ...boxProps
}) => {

  const sp = {xs: 1, sm: 1, md: 1, lg: 2}[size];

  return (
    <Box
      bgColor={`${colorScheme}.${colorScheme == 'gray' ? '100' : '500'}`}
      p={sp}
      borderRadius="md"
      display="inline-block"
      {...boxProps}
    >
      <HStack spacing={sp}>
        {items.map((item) => {
          const isSelected = selected === item.label;
          if (isSelected) { return (
            <Button
                key={item.label}
                size={size}
                colorScheme={colorScheme}
                variant="outline"
                bgColor="white"
                _hover={{ bgColor: "white" }}
                _active={{ bgColor: "white" }}
                onClick={() => onSelectItem(item.label)}
              >
                {item.value}
              </Button>
          )} else return (
            <Button
                key={item.label}
                size={size}
                colorScheme={colorScheme}
                variant="solid"
                onClick={() => onSelectItem(item.label)}
              >
                {item.value}
              </Button>
          )
        })}
      </HStack>
    </Box>
  );
};

export default SegmentedControl;
