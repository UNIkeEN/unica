import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight'
import {
  Box,
  BoxProps,
} from "@chakra-ui/react";

import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github.css';

interface MdRendererProps extends BoxProps {
  content: string;
}

const MarkdownRenderer: React.FC<MdRendererProps> = ({
  content,
  ...boxProps
}) => {

  return (
      <Box {...boxProps} style={{ wordWrap: 'break-word', overflowWrap: 'break-word'}}>
        <ReactMarkdown
            className='markdown-body'
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
            skipHtml={false}
        >
            {content}
        </ReactMarkdown>
      </Box>
  )
}

export default MarkdownRenderer;