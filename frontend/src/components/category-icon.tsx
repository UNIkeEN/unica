import {
  Box,
  BoxProps,
  Tag,
  Tooltip
} from '@chakra-ui/react';
import { DiscussionTopicCategory as Category } from '@/models/discussion';
import { useTranslation } from 'next-i18next';

interface CategoryIconProps extends BoxProps {
  category: Category;
  withTooltip?: boolean;
  size?: "md" | "lg"
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category,
  withTooltip = false,
  size = "lg",
  ...boxProps 
}) => {
  const { t } = useTranslation();
  return (
    <Box {...boxProps}>
      <Tooltip 
        isDisabled={!withTooltip}
        label={category.name || t('CategoryIcon.uncategorized')}
      >
        <Tag 
          size={size} 
          p={size === "lg" ? 2.5 : 1.5} 
          colorScheme={category.color || "gray"}
          color={category.name? "black" : "transparent"}
        >
          {category.emoji || "💬"}
        </Tag>
      </Tooltip>
    </Box>
  );
};

export default CategoryIcon;
