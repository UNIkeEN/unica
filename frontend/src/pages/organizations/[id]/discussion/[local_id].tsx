import MarkdownEditor from "@/components/markdown-editor";
import MarkdownRenderer from "@/components/markdown-renderer";
import RichList from "@/components/rich-list";
import { DiscussionComment, DiscussionTopic } from "@/models/discussion";
import { formatRelativeTime } from "@/utils/datetime";
import {
  Button,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Heading,
  IconButton,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMaximize2, FiMinimize2, FiMessageCircle } from "react-icons/fi";

const DiscussionTopicPage = () => {
  const router = useRouter();
  const org_id = Number(router.query.id);
  const local_id = Number(router.query.local_id);
  const { t } = useTranslation();

  const [topic, setTopic] = useState<DiscussionTopic | null>(null);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [fullheight, setFullheight] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (local_id) {
      // Fetch topic and comments
      setTopic({
        id: 1,
        local_id: local_id,
        title: "Test Topic",
        created_at: "2021-10-01T00:00:00",
        updated_at: "2021-10-01T00:00:00",
      });
      setComments([
        {
          id: 1,
          user: {
            id: 1,
            display_name: "Test User1",
            biography: "Test User1 Bio",
            email: "1@test.com",
          },
          local_id: local_id,
          content: "Test Comment",
          created_at: "2021-10-01T00:00:00",
          updated_at: "2024-08-21T00:00:00",
        },
        {
          id: 2,
          user: {
            id: 2,
            display_name: "Test User2",
            biography: "Test User2 Bio",
            email: "2@test.com",
          },
          local_id: local_id,
          content: "Test Comment 2",
          created_at: "2021-10-01T00:00:00",
          updated_at: "2023-08-01T00:00:00",
        },
      ]);
    }
  }, [local_id]);

  const handleSubmission = () => {
    console.log("Submitting comment", newComment);
    setNewComment("");
    onClose();
  };

  const AddCommentButton = () => {
    return (
      <IconButton
        aria-label="Add Comment"
        variant={"subtle"}
        icon={<FiMessageCircle />}
        onClick={() => {
          onOpen();
        }}
      />
    );
  };

  return (
    <>
      <HStack>
        <VStack>
          <Heading>{topic?.title}</Heading>
          <VStack>
            {comments && comments.length > 0 && (
              <RichList
                items={comments.map((comment) => ({
                  title: comment.user.display_name,
                  subtitle: t("General.updated_at", {
                    time: formatRelativeTime(comment.updated_at, t),
                  }),
                  body: <MarkdownRenderer content={comment.content} />,
                }))}
              />
            )}
          </VStack>
          <AddCommentButton />
        </VStack>
        <Center height="50px">
          <Divider orientation="vertical" />
        </Center>
        <AddCommentButton />
      </HStack>

      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isFullHeight={fullheight}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Comment</DrawerHeader>
          <IconButton
            aria-label="Full Height"
            variant={"subtle"}
            icon={fullheight ? <FiMinimize2 /> : <FiMaximize2 />}
            onClick={() => {
              setFullheight(!fullheight);
            }}
          />
          <DrawerBody>
            <MarkdownEditor
              content={newComment}
              onContentChange={(content) => {
                setNewComment(content);
              }}
            />
          </DrawerBody>

          <DrawerFooter>
            <Button onClick={onClose}>
              {t("ChangeMemberRoleModal.modal.cancel")}
            </Button>
            <Button colorScheme="blue" onClick={handleSubmission} ml={3}>
              {t("ChangeMemberRoleModal.modal.change_role")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DiscussionTopicPage;
