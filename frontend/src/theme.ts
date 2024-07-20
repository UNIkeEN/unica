// theme.ts
import { background, extendTheme } from '@chakra-ui/react';

const subtleButtonVariant = (props) => ({
  bg: `${props.colorScheme}.100`,
  color: `${props.colorScheme}.700`,
  _hover: {
    bg: `${props.colorScheme}.200`,
  },
  _active: {
    bg: `${props.colorScheme}.300`,
  },
  _focus: {
    boxShadow: 'none',
  },
  _disabled: {
    bg: `${props.colorScheme}.100`,
    color: `${props.colorScheme}.500`,
    cursor: 'not-allowed',
    opacity: 0.6,
    _hover: {
      bg: `${props.colorScheme}.100 !important`,
    },
    _active: {
      bg: `${props.colorScheme}.100 !important`,
    },
  },
});

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
      },
      variants: {
        subtle: subtleButtonVariant,
      },
    },
    Divider: {
      baseStyle: {
        borderColor: "gray.300",
      },
    },
  },
});

export default theme;
