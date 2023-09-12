import { extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";

import { colors, fonts, fontSizes, space, styles, textStyles } from "./beta-theme";
import components from "./components";

export const theme = extendBaseTheme(chakraTheme, {
  styles,
  fonts,
  colors,
  space,
  fontSizes,
  textStyles,
  components: {
    ...chakraTheme.components,
    ...components,
  },
});
