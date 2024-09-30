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
import { ChakraColorEnums, ColorSelectorType } from "@/models/enums";

interface ChakraColorSelectorProps extends BoxProps {
  current: string;
  onColorSelect: (color: ColorSelectorType) => void;
  size?: string;
}

const ChakraColorSelector: React.FC<ChakraColorSelectorProps> =({
  current,
  onColorSelect,
  size = "md",
  ...boxProps
}) => {

  const { t } = useTranslation();

  return (
    <Box {...boxProps}>
      <Flex>
        {
          ChakraColorEnums.map((color: ColorSelectorType, index: number) => (
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