import { 
  Box,
  BoxProps,
  Button, 
  HStack,
  IconButton
} from "@chakra-ui/react";
import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";

interface PaginationProps extends BoxProps {
  current: number;
  total: number;
  pageBuffer?: number;
  onPageChange: (page: number) => void;
  colorScheme?: string;
  size?: string;
  spacing?: number;
  variant?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageBuffer = 2,
  onPageChange,
  colorScheme = "gray",
  size = "md",
  spacing = 1,
  variant = "subtle",
  ...boxProps
}) => {
  
  const renderPageButton = (page: number) => {
    const isCurrent: boolean = (current === page);
    return (
      <Button
        key={page}
        size={size}
        variant={isCurrent ? variant : "ghost"}
        colorScheme={isCurrent ? colorScheme : "gray"}
        pointerEvents={isCurrent ? "none" : "auto"}
        onClick={() => onPageChange(page)}
      >
        {page}
      </Button>
    );
  };

  const renderEllipsis = (key: string) => (
    <IconButton
      size={size}
      key={key}
      variant="ghost"
      colorScheme="gray"
      aria-label="ellipsis"
      icon={<FiMoreHorizontal/>}
    />
  );

  const renderPages = () => {
    const pages: React.ReactNode[] = [];

    if (total <= 2 * pageBuffer + 3) {
      for (let i = 1; i <= total; i++) {
        pages.push(renderPageButton(i));
      }
    } else {
      const start = Math.max(2, current - pageBuffer) - Math.max(0, 2 - total + current);
      const end = Math.min(total - 1, current + pageBuffer) + Math.max(0, 3 - current);
      pages.push(renderPageButton(1));
      if (start > 2) {
        pages.push(renderEllipsis("start-ellipsis"));
      }
      for (let i = start; i <= end; i++) {
        pages.push(renderPageButton(i));
      }
      if (end < total - 1) {
        pages.push(renderEllipsis("end-ellipsis"));
      }
      pages.push(renderPageButton(total));
    }
    return pages;
  };

  return (
    <Box {...boxProps}>
      <HStack spacing={spacing}>
        <IconButton
          size={size}
          variant="ghost"
          colorScheme="gray"
          aria-label="Previous"
          isDisabled={current === 1}
          onClick={() => onPageChange(current - 1)}
          icon={<FiChevronLeft />}
        />

        {renderPages()}

        <IconButton
          size={size}
          variant="ghost"
          colorScheme="gray"
          aria-label="Next"
          isDisabled={current === total}
          onClick={() => onPageChange(current + 1)}
          icon={<FiChevronRight />}
        />
      </HStack>
    </Box>
  );
};

export default Pagination;
