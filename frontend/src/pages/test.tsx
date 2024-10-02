import ChakraColorSelector from "@/components/common/color-selector";
import Editable from "@/components/common/editable";
import MarkdownEditor from "@/components/common/markdown-editor";
import Pagination from "@/components/common/pagination";
import TaskCard from "@/components/task-card";
import { MockTask } from "@/models/task";
import { Badge, Box, Button, VStack, useDisclosure } from "@chakra-ui/react";
import Head from 'next/head';
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import TaskDetailPanel from "@/components/task-detail-panel";

const ComponentTestPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      console.error("This page is only for development");
      router.push("/home");
    }
  }, []);

  //common/pagination
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

  const [editableText, setEditableText] = React.useState("");
  const [isTextArea, setIsTextArea] = React.useState(false);

  const breadcrumbs = [
    { text: "Item1", link: "/" },
    { text: "Item2", link: "/projects" },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <meta name="headerTitle" content="Test Page" />
        <meta name="headerBreadcrumbs" content={JSON.stringify(breadcrumbs)} />
      </Head>
      <VStack mb={10}>
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
          checkError={(value) => {
            if (value.trim() === "") {
              return 1;
            }
            if (value.length > 80) {
              return 2;
            }
            return 0;
          }}
          localeKey="Editable"
          mt={5}
        />
        <Button onClick={() => { setIsTextArea(!isTextArea) }}>{isTextArea ? "Textarea" : "Input"}</Button>
        
        {/* TaskCard */}
        <TaskCard task={MockTask} onClick={onOpen}/>

        <TaskDetailPanel
          isOpen={isOpen}
          onClose={onClose}
        />
      </VStack>
    </>
  );
};

export default ComponentTestPage;
