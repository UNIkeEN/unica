import { Button, HStack } from "@chakra-ui/react";
import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";

export interface PaginationProps {
  current: number;
  total: number;
  onChange: (pageId: number) => void;
  pageNumVariant?: string;
  pageNumColorScheme?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  onChange,
  pageNumVariant = "subtle",
  pageNumColorScheme = "gray",
}) => {
  const getPages = () => {
    const pages = [];
    const maxVisible = 7;

    if (total < maxVisible) for (let i = 1; i <= total; i++) pages.push(i);
    else {
      const startPage = Math.max(2, current - 2);
      const endPage = Math.min(total - 1, current + 2);

      pages.push(1);

      if (startPage > 2) {
        pages.push("...");
        if (endPage < total - 1) {
          for (let i = startPage; i <= endPage; i++) pages.push(i);
          pages.push("...");
        } else {
          for (let i = total - maxVisible + 2; i < total; i++) pages.push(i);
        }
      } else {
        for (let i = 2; i < maxVisible; i++) pages.push(i);
        pages.push("...");
      }

      pages.push(total);
    }
    return pages;
  };

  return (
    <HStack>
      <Button
        variant="ghost"
        colorScheme="gray"
        isDisabled={current === 1}
        onClick={() => onChange(current - 1)}
        fontSize={20}
      >
        <FiChevronLeft />
      </Button>

      {getPages().map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            variant={current === page ? pageNumVariant : "ghost"}
            colorScheme={current === page ? pageNumColorScheme : "gray"}
            isDisabled={current === page}
            onClick={() => onChange(page)}
          >
            {page}
          </Button>
        ) : (
          <FiMoreHorizontal key={index} size={20} />
        )
      )}

      <Button
        variant="ghost"
        colorScheme="gray"
        isDisabled={current === total}
        onClick={() => onChange(current + 1)}
        fontSize={20}
      >
        <FiChevronRight />
      </Button>
    </HStack>
  );
};

export default Pagination;
