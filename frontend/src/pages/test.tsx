import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import { Button, VStack, Badge, Box, Divider } from "@chakra-ui/react";
import Pagination from "@/components/pagination";
import ChakraColorSelector from "@/components/color-selector";
import MarkdownEditor from "@/components/markdown-editor";
import InfiniteScroll from 'react-infinite-scroller';
import Editable from "@/components/editable";

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

  // Color Selector
  const [selectedColor, setSelectedColor] = React.useState("gray");
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  }

  // Markdown Editor
  const exampleMarkdown = `\`\`\`js
import React from 'react'
import ReactDOM from 'react-dom'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

const markdown = \`
# Your markdown here
\`

ReactDOM.render(
  <Markdown rehypePlugins={[rehypeHighlight]}>{markdown}</Markdown>,
  document.querySelector('#content')
)
  \`\`\``

  const [markdown, setMarkdown] = React.useState(exampleMarkdown);

  const [items, setItems] = React.useState<number[]>(Array.from({ length: 20 }, (_, i) => i + 1));
  const loadMore = () => {
    console.log("Load more");
    const lastItem = items[items.length - 1];
    const newItems = Array.from({ length: 20 }, (_, i) => lastItem + i + 1);
    setItems([...items, ...newItems]);
  };

  const [itemsButtom, setItemsButtom] = React.useState<number[]>(Array.from({ length: 20 }, (_, i) => i + 1));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadMoreButtom = () => {
    console.log("Load more buttom");
    const firstItem = itemsButtom[0];
    const newItems = Array.from({ length: 20 }, (_, i) => firstItem - 20 + i );
    setItemsButtom([...newItems, ...itemsButtom]);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  const [editableText, setEditableText] = React.useState("Editable Text");
  const [isTextArea, setIsTextArea] = React.useState(false);

  const breadcrumbs = [
    { text: "Item1", link: "/" },
    { text: "Item2", link: "/projects" },
  ];

  return (
    <>
      <Head>
        <meta name="headerTitle" content="Test Page" />
        <meta name="headerBreadcrumbs" content={JSON.stringify(breadcrumbs)} />
      </Head>
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

        <ChakraColorSelector
          current={selectedColor}
          onColorSelect={(color) => handleColorChange(color)}
          size="md"
          w="60%"
        />

        {/* Markdown */}
        <MarkdownEditor
          content={markdown}
          onContentChange={(content) => setMarkdown(content)}
          w="60%"
        />

        {/* Infinite Scroll */}
        <Box height="300px" overflow="auto" mb="8">
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={true}
            loader={<div className="loader" key={0}>Loading ...</div>}
            threshold={50}
            useWindow={false}
          >
            {items.map(item => (
              <Box p={4} borderWidth="1px" borderRadius="md">
                {item}
              </Box>
            ))}
          </InfiniteScroll>
        </Box>

        {/* Infinite Scroll Reverse */}
        <Divider />
        <Box height="300px" overflow="auto" mt="8" ref={scrollContainerRef}>
          <InfiniteScroll
            loadMore={loadMoreButtom}
            hasMore={true}
            loader={<div className="loader" key={0}>Loading ...</div>}
            threshold={50}
            useWindow={false}
            isReverse
            initialLoad={false}
          >
            {itemsButtom.map(item => (
              <Box p={4} borderWidth="1px" borderRadius="md">
                {'buttom' + item}
              </Box>
            ))}
          </InfiniteScroll>
        </Box>
          
        {/* Editable */}
        <Editable
          isTextArea={isTextArea}
          value={editableText}
          placeholder="Placeholder"
          onEditSubmit={(value) => setEditableText(value)}
          isRequired
          maxLength={80}
          title="hello"
          mt={5}
        />
        <Button onClick={()=>{setIsTextArea(!isTextArea)}}>switch</Button>

      </VStack>
    </>
  );
};

export default ComponentTestPage;
