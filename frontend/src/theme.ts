// theme.ts
import { Divider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
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
