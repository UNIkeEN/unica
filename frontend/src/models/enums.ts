export const ChakraColorEnums = ["gray", "red", "orange", "yellow", "green", "teal", "blue", "purple", "pink"] as const;

export type ColorSelectorType = typeof ChakraColorEnums[number];