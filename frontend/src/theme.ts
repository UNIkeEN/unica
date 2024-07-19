// theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
      },
    },
  },
});

export default theme;
