import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Button, VStack, Badge } from "@chakra-ui/react";
import Pagination from "@/components/pagination";

const ComponentTestPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      console.error("This page is only for development");
      router.push("/home");
    }
  }, []);

  //Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPage = 10;
  const handlePageChange = (pageId: number) => {
    console.log(pageId);
    setCurrentPage(pageId);
  };

  return (
    <VStack>
      <Button variant="ghost" colorScheme="green">
        Ghost
      </Button>
      <Button variant="subtle" colorScheme="green">
        Subtle
      </Button>
      <Button variant="subtle" colorScheme="green" isDisabled>
        Subtle
      </Button>
      <Badge variant="subtle" colorScheme="green">
        Removed
      </Badge>

      {/* Pagination */}
      <Pagination
        current={currentPage}
        total={totalPage}
        onPageChange={(pageId) => handlePageChange(pageId)}
        colorScheme="green"
      />
    </VStack>
  );
};

export default ComponentTestPage;
