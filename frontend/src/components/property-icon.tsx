import React from "react";
import {
  LuText,
  LuTags,
  LuChevronDownCircle,
  LuCalendarClock,
  LuUser2
} from "react-icons/lu"
import { TbNumbers } from "react-icons/tb";
import { Icon, IconProps } from "@chakra-ui/react";

interface PropertyIconProps extends IconProps {
  type: string
}

export const PropertyIconList = {
  "text": LuText,
  "number": TbNumbers,
  "label": LuTags,
  "group": LuChevronDownCircle,
  "datetime": LuCalendarClock,
  "user": LuUser2
}

const PropertyIcon: React.FC<PropertyIconProps> = ({
  type,
  ...iconProps
}) => {
  return <Icon as={PropertyIconList[type] || null} {...iconProps}/>
}

export default PropertyIcon;