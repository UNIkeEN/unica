import {
  Box,
  BoxProps,
  Button,
  Stack,
  Tooltip
} from "@chakra-ui/react";

interface SegmentedControlProps extends BoxProps {
  size?: "xs" | "sm" | "md" | "lg";
  colorScheme?: string;
  items: {
    label: string,
    value: (string | React.ReactNode),
    tooltip?: string
  }[];
  selected: string;
  onSelectItem: (label: string) => void;
  direction?: "row" | "column"; 
  withTooltip?: boolean;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  size = "md",
  colorScheme = "gray",
  items,
  selected,
  onSelectItem,
  direction = "row",
  withTooltip = false,
  ...boxProps
}) => {

  const sp = { xs: 1, sm: 1, md: 1, lg: 2 }[size];

  return (
    <Box
      bgColor={`${colorScheme}.100`}
      p={sp}
      borderRadius="md"
      display="inline-block"
      {...boxProps}
    >
      <Stack direction={direction} spacing={sp}>
        {items.map((item) => {
          const isSelected = selected === item.label;

          const button = (
            <Button
              key={item.label}
              size={size}
              colorScheme={colorScheme}
              variant={isSelected ? "outline" : "subtle"}
              bgColor={isSelected ? "white" : `${colorScheme}.100`}
              _hover={isSelected ? { bgColor: "white" } : { bg: `${colorScheme}.200` }}
              _active={isSelected ? { bgColor: "white" } : { bg: `${colorScheme}.300` }}
              onClick={() => onSelectItem(item.label)}
            >
              {item.value}
            </Button>
          );

          return (
            <Tooltip
              key={item.label}
              label={item.tooltip || item.label}
              isDisabled={withTooltip || !item.tooltip}
            >
              {button}
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};

export default SegmentedControl;