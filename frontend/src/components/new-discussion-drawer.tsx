import MarkdownEditor from "@/components/markdown-editor";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  IconButton,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiChevronDown, FiMaximize2, FiMinimize2 } from "react-icons/fi";

interface NewDiscussionDrawerProps extends DrawerProps {
  pageName: string;
  mobileSize: boolean;
  newContent: string;
  setNewContent: (content: string) => void;
  setFullHeightReverse: () => void;
  onOKCallback: () => void;
}

const NewDiscussionDrawer: React.FC<NewDiscussionDrawerProps> = ({
  pageName,
  mobileSize,
  newContent,
  setNewContent,
  setFullHeightReverse,
  onOKCallback,
  ...drawerProps
}) => {
  const { t } = useTranslation();

  return (
    <Drawer {...drawerProps}>
      <DrawerOverlay />
      <DrawerContent
        width={drawerProps.isFullHeight || mobileSize ? "100%" : "50%"}
        margin={"0 auto"}
        rounded={"lg"}
      >
        <Flex>
          <VStack>
            <DrawerHeader>{t(`${pageName}.drawer.title`)}</DrawerHeader>
          </VStack>
          <Spacer />
          <IconButton
            aria-label="Full Height"
            variant={"ghost"}
            icon={drawerProps.isFullHeight ? <FiMinimize2 /> : <FiMaximize2 />}
            onClick={setFullHeightReverse}
            size={"lg"}
          />
          <IconButton
            aria-label="Close Drawer"
            variant={"ghost"}
            size={"lg"}
            icon={<FiChevronDown />}
            onClick={drawerProps.onClose}
          />
        </Flex>
        <DrawerBody>
          <MarkdownEditor
            content={newContent}
            onContentChange={(content) => {
              setNewContent(content);
            }}
          />
        </DrawerBody>

        <DrawerFooter>
          <Button onClick={drawerProps.onClose}>
            {t(`${pageName}.drawer.cancel`)}
          </Button>
          <Button colorScheme="blue" onClick={onOKCallback} ml={3}>
            {t(`${pageName}.drawer.submit`)}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NewDiscussionDrawer;
