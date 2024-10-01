export const ChakraColorEnums = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "purple",
  "pink",
] as const;

export type ColorSelectorType = (typeof ChakraColorEnums)[number];

export const PropertyEnums = [
  "text",
  "number",
  "label",
  "group",
  "datetime",
  "user"
] as const;