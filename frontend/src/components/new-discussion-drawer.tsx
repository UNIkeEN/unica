import { useState } from "react";
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
  Input,
  Spacer,
  useBreakpointValue,
  FormControl,
  FormErrorMessage,
  Select
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiChevronDown, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { DiscussionTopicCategory } from "@/models/discussion";

interface NewDiscussionDrawerProps extends DrawerProps {
  drawerTitle: string;
  variant: "topic" | "comment"
  comment: string;
  setComment: (comment: string) => void;
  onOKCallback: () => void;
  categories?: DiscussionTopicCategory[];
  newTopicCategory?: number;
  setNewTopicCategory?: (categoryId: number) => void;
  title?: string;
  setTitle?: (title: string) => void;
}

const NewDiscussionDrawer: React.FC<NewDiscussionDrawerProps> = ({
  drawerTitle,
  variant,
  comment,
  setComment,
  onOKCallback,
  categories,
  newTopicCategory,
  setNewTopicCategory,
  title,
  setTitle,
  ...drawerProps
}) => {
  const [fullHeight, setFullHeight] = useState<boolean>(false);
  const [isTitleTooLong, setIsTitleTooLong] = useState<boolean>(false);
  const _width = useBreakpointValue({ base: "100%", md: "60%" });
  const { t } = useTranslation();

  return (
    <Drawer
      placement="bottom"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
      isFullHeight={fullHeight}
      {...drawerProps}
    >
      <DrawerOverlay />
      <DrawerContent
        width={fullHeight ? "100%" : _width}
        margin={"0 auto"}
        rounded={"lg"}
      >
        <Flex>
          <DrawerHeader flex="1">{drawerTitle}</DrawerHeader>
          <Spacer />
          <IconButton
            aria-label="Full Height"
            variant="ghost"
            icon={fullHeight ? <FiMinimize2 /> : <FiMaximize2 />}
            onClick={() => setFullHeight((current) => !current)}
            size="lg"
          />
          <IconButton
            aria-label="Close Drawer"
            variant="ghost"
            size="lg"
            icon={<FiChevronDown />}
            onClick={drawerProps.onClose}
          />
        </Flex>
        <DrawerBody>
          {variant === "topic" && (
            <FormControl isInvalid={isTitleTooLong} mb={5}>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsTitleTooLong(e.target.value.length > 40);
                }}
                placeholder={t("NewDiscussionDrawer.drawer.setTitle")}
              />
              <FormErrorMessage>
                {isTitleTooLong
                  ? t("NewDiscussionDrawer.FormErrorMessage.titleTooLong")
                  : ""}
              </FormErrorMessage>
              <Select
                placeholder={t("NewDiscussionDrawer.drawer.setCategory")}
                onChange={(event) => {
                  setNewTopicCategory(parseInt(event.target.value));
                }}
                mt={5}
              >
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category?.emoji.slice(0, 2) || "💬"}
                    {category?.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
          <MarkdownEditor
            content={comment}
            resize="none"
            h="100%"
            onContentChange={(comment) => {
              setComment(comment);
            }}
          />
        </DrawerBody>

        <DrawerFooter>
          <Button onClick={drawerProps.onClose}>
            {t("NewDiscussionDrawer.drawer.cancel")}
          </Button>
          <Button
            colorScheme="blue"
            onClick={onOKCallback}
            ml={3}
            isDisabled={
              (variant === "topic" &&
                (title.trim() === "" || isTitleTooLong)) ||
              comment.trim() === ""
            }
          >
            {t("NewDiscussionDrawer.drawer.submit")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NewDiscussionDrawer;
