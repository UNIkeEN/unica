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
  Grid,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiChevronDown, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { DiscussionTopicCategory } from "@/models/discussion";
import CategoryIcon from "@/components/category-icon";

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
            <Grid 
              templateColumns={{base: "1fr 1fr", md: "7fr 2fr"}}
              gap={4} mb={5}
              alignItems="center" 
            >
              <FormControl isInvalid={isTitleTooLong} >
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
              </FormControl>
      
              <Menu>
                <MenuButton 
                  as={Button} 
                  rightIcon={<FiChevronDown />}
                  style={{ textAlign: 'left' }}
                >
                  {newTopicCategory === 0 ? (
                    <Text style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} >{t("NewDiscussionDrawer.drawer.uncategorized")}</Text>
                  ) : (
                    <HStack spacing={2}>
                      <CategoryIcon category={categories.find((cat) => cat.id === newTopicCategory)} size="md" />
                      <Text style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{categories.find((cat) => cat.id === newTopicCategory)?.name}</Text>
                    </HStack>
                  )}
                </MenuButton>
                <MenuList>
                  <MenuOptionGroup
                    defaultValue={String(newTopicCategory)}
                    type="radio"
                    onChange={(value) => setNewTopicCategory(Number(value))}
                  >
                    <MenuItemOption value="0">
                      <Text>{t("NewDiscussionDrawer.drawer.uncategorized")}</Text>
                    </MenuItemOption>
                    {categories?.map((category) => (
                      <MenuItemOption key={category.id} value={String(category.id)}>
                        <HStack spacing={2}>
                          <CategoryIcon category={category} size="md" />
                          <Text>{category.name}</Text>
                        </HStack>
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </Grid>
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
