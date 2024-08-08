import { 
  Box,
  BoxProps,
  Flex,
  Spacer,
  IconButton,
  Tooltip
} from "@chakra-ui/react";
import { FaRegCircle, FaCircleCheck } from "react-icons/fa6";
import { useTranslation } from "next-i18next";

interface ChakraColorSelectorProps extends BoxProps {
  current: string;
  onColorSelect: (color: string) => void;
  size?: string;
}

const ChakraColorSelector: React.FC<ChakraColorSelectorProps> =({
  current,
  onColorSelect,
  size = "md",
  ...boxProps
}) => {

  const { t } = useTranslation();
  const ChakraColorEnums = ["gray", "red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink"];
  
  return (
    <Box {...boxProps}>
      <Flex>
        {
          ChakraColorEnums.map((color: string, index: number) => (
            <>
              <Tooltip label={t(`Enums.chakra-colors.${color}`)}>
                <IconButton
                  key={color}
                  size={size}
                  variant={current === color ? "solid" : "subtle"}
                  colorScheme={color}
                  aria-label={color}
                  icon={current === color ? <FaCircleCheck color="white"/> : <FaRegCircle/>}
                  onClick={() => onColorSelect(color)}
                  sx={
                    current === color && color === 'gray'
                      ? {
                          bg: 'gray.600',
                          _hover: { bg: 'gray.700' },
                          _active: { bg: 'gray.800' },
                        }
                      : {}
                  }
                />
              </Tooltip>
              {index < ChakraColorEnums.length - 1 && <Spacer />}
            </>
          ))
        }
      </Flex>
    </Box>
  )
}

export default ChakraColorSelector;