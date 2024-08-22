import React, { useState, useRef, useEffect } from 'react';
import { 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  Button,
  IconButton,
  Box,
  BoxProps,
  Textarea,
  VStack,
  HStack,
  Divider
} from '@chakra-ui/react';
import MarkdownRenderer from '@/components/markdown-renderer';
import { useTranslation } from 'next-i18next';
import { FaMarkdown } from "react-icons/fa";
import { FiBold, FiItalic, FiCode, FiList } from 'react-icons/fi';
import { LuTextQuote, LuListChecks } from "react-icons/lu";

interface MarkdownEditorProps extends BoxProps {
  content: string;
  onContentChange: (content: string) => void;
  size?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  content, 
  onContentChange, 
  size = "md",
  ...boxProps 
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [panelHeight, setPanelHeight] = useState('0px');
  const vstackRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Update height when the component mounts
    const vstack = vstackRef.current;
    if (vstack) {
      setPanelHeight(`${vstack.clientHeight}px`);
    }
  }, [content]);

  const handleTabSwitch = (index: number) => {
    const vstack = vstackRef.current;
    if (vstack) {
      const height = vstack.clientHeight;
      if (height > 0) {  
        setPanelHeight(`${height - 8}px`);  // -8px corresponds to vstack's mb={-2}
      }
    }
    setSelectedTab(index);
  };

  const handleTextFormatting = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
  
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const symbolLength = symbol.length;

    let newText = '';
    let newSelectionStart = start;
    let newSelectionEnd = end;

    if (selectedText.startsWith(symbol) && selectedText.endsWith(symbol)) {
      newText = content.substring(0, start) + selectedText.slice(symbolLength, -symbolLength) + content.substring(end);
      newSelectionEnd = end - (symbolLength * 2);
    } else if (selectedText === '') {
        if (start >= symbolLength && content.substring(start - symbolLength, start + symbolLength) === symbol + symbol) {
          newText = content.substring(0, start - symbolLength) + content.substring(start + symbolLength);
          newSelectionEnd = newSelectionStart = start - symbolLength;
        } else if (start >= 1 && content.substring(start - 1, start + symbolLength * 2 - 1) === symbol + symbol) {
          newText = content.substring(0, start - 1) + content.substring(start + symbolLength * 2 - 1);
          newSelectionEnd = newSelectionStart = start - 1;
        } else if (start >= symbolLength * 2 - 1 && content.substring(start - symbolLength * 2 + 1, start + 1) === symbol + symbol) {
          newText = content.substring(0, start - symbolLength * 2 + 1) + content.substring(start + 1);
          newSelectionEnd = newSelectionStart = start - symbolLength * 2 + 1;
        } else {
          newText = content.substring(0, start) + `${symbol}${symbol}` + content.substring(end);
          newSelectionEnd = newSelectionStart = start + symbolLength;
        }
    } else if (selectedText !== '' && content.substring(start - symbolLength, end + symbolLength) === `${symbol}${selectedText}${symbol}`) {
      newText = content.substring(0, start - symbolLength) + selectedText + content.substring(end + symbolLength);
      newSelectionStart = start - symbolLength;
      newSelectionEnd = end - symbolLength;
    } else {
      newText = content.substring(0, start) + `${symbol}${selectedText}${symbol}` + content.substring(end);
      newSelectionStart = start + symbolLength;
      newSelectionEnd = end + symbolLength;
    }

    // set content, set focus and cursor back
    onContentChange(newText);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = newSelectionStart;
      textarea.selectionEnd = newSelectionEnd;
    });
  };

  const handleListOperation = (prefix: string, checkOtherLists: boolean = true) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
  
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const lines = selectedText.split('\n');
  
    const allStartWithPrefix = lines.every(line => line.startsWith(prefix));
    const allStartWithOtherLists = checkOtherLists && lines.every(line => line.startsWith('- [ ] ') || line.startsWith('- [x] ') || line.startsWith('* ') || line.startsWith('1. '));
  
    let newText: string;
  
    if (allStartWithPrefix) {
      newText = lines.map(line => line.slice(prefix.length)).join('\n');
    } else if (allStartWithOtherLists) {
      newText = lines.map(line => line.replace(/^- \[ \] |^- \[x\] |\* |^\d+\. /, prefix)).join('\n');
    } else {
      newText = lines.map(line => prefix + line).join('\n');
    }
  
    onContentChange(content.substring(0, start) + newText + content.substring(end));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + newText.length;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
  
    if (e.key === 'Enter') {
      const start = textarea.selectionStart;
      const lines = content.substring(0, start).split('\n');
      const lastLine = lines[lines.length - 1];
  
      let newLinePrefix = '';
      const unorderedListMatch = lastLine.match(/^(\s*)\* /);
      const orderedListMatch = lastLine.match(/^(\s*)(\d+)\. /);
      const taskListMatch = lastLine.match(/^(\s*)- \[(x| )\] /);
  
      if (unorderedListMatch) {
        newLinePrefix = unorderedListMatch[1] + '* ';
      } else if (orderedListMatch) {
        const number = parseInt(orderedListMatch[2], 10) + 1;
        newLinePrefix = orderedListMatch[1] + number + '. ';
      } else if (taskListMatch) {
        newLinePrefix = taskListMatch[1] + '- [ ] ';
      }
  
      if (newLinePrefix) {
        e.preventDefault();
        const newText = content.substring(0, start) + '\n' + newLinePrefix + content.substring(start);
        onContentChange(newText);
        requestAnimationFrame(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + newLinePrefix.length + 1;
        });
      }
    }
  
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        handleTextFormatting("**");
      } else if (e.key === 'i') {
        e.preventDefault();
        handleTextFormatting("_");
      }
    }
  };
  

  const ToolBar = () => {
    const btnList = [
      {
        label: "bold",
        icon: <FiBold />,
        onClick: () => handleTextFormatting("**"),
      },
      {
        label: "italic",
        icon: <FiItalic />,
        onClick: () => handleTextFormatting("~"),
      },
      {
        label: "quote",
        icon: <LuTextQuote />,
        onClick: () => handleListOperation("> ", false),
      },
      {
        label: "code",
        icon: <FiCode />,
        onClick: () => handleTextFormatting("`"),
      },
      { label: "divider" },
      {
        label: "unordered-list",
        icon: <FiList/>,
        onClick: () => handleListOperation("* "),
      },
      {
        label: "task-list",
        icon: <LuListChecks />,
        onClick: () => handleListOperation("- [ ] "),
      }
    ];

    return (
      <HStack ml="auto" mr={2} spacing={0}>
        {btnList.map((btn) => (
          btn.label === "divider" ? <Divider orientation='vertical' mx={1}/> :
          <IconButton
            aria-label={btn.label}
            icon={btn.icon}
            variant="ghost"
            colorScheme="gray"
            size="sm"
            onClick={btn.onClick}
          />
        ))}
      </HStack>
    );
  };
  
  return (
    <Box 
      border="1px solid"
      borderColor="gray.200"
      borderRadius={size}
      {...boxProps}
    >
      <Tabs 
        variant="enclosed"
        size={size}
        onChange={(index) => handleTabSwitch(index)}
      >
        <TabList m="-1px">
          <Tab>{t("MarkdownEditor.tab.edit")}</Tab>
          <Tab>{t("MarkdownEditor.tab.preview")}</Tab>
          <ToolBar/>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack
              ref={vstackRef}
              align="start"
              flexWrap="wrap"
              mb={-2}
            >
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                minHeight={'200px'}
                resize="vertical"
                overflow="auto"
                onKeyDown={handleKeyDown}
              />
              <Button 
                variant="ghost" 
                colorScheme="gray"
                size="sm"
                leftIcon={<FaMarkdown />}
                onClick={() => {
                  window.open('https://www.markdownguide.org/', '_blank');
                }}
              >
                {t("MarkdownEditor.button.support-markdown")}
              </Button>
            </VStack>
          </TabPanel>
          <TabPanel>
            <MarkdownRenderer 
              height={panelHeight}
              overflow="auto"
              content={content}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MarkdownEditor;