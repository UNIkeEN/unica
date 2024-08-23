import MarkdownRenderer from "@/components/markdown-renderer";
import NewDiscussionDrawer from "@/components/new-discussion-drawer";
import RichList from "@/components/rich-list";
import { DiscussionComment, DiscussionTopic } from "@/models/discussion";
import { formatRelativeTime } from "@/utils/datetime";
import {
  Center,
  Divider,
  HStack,
  Heading,
  Hide,
  IconButton,
  Show,
  Text,
  VStack,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiMessageCircle
} from "react-icons/fi";

const DiscussionTopicPage = () => {
  const router = useRouter();
  const org_id = Number(router.query.id);
  const local_id = Number(router.query.local_id);
  const { t } = useTranslation();

  const [topic, setTopic] = useState<DiscussionTopic | null>(null);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [fullHeight, setFullHeight] = useState<boolean>(false);

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
        <VStack spacing={6} align="stretch">
          <Heading>{topic?.title}</Heading>
          {comments && comments.length > 0 && (
            <RichList
              items={comments.map((comment) => ({
                title: comment.user.display_name,
                subtitle: comment.user.email,
                titleExtra: (
                  <Text
                    fontSize="sm"
                    className="secondary-text"
                    wordBreak="break-all"
                  >
                    {t("General.updated_at", {
                      time: formatRelativeTime(comment.updated_at, t),
                    })}
                  </Text>
                ),
                body: <MarkdownRenderer content={comment.content} />,
              }))}
            />
          )}
          <AddCommentButton />
        </VStack>
        <Center height="50px">
          <Divider orientation="vertical" />
        </Center>
        <AddCommentButton />
      </HStack>

      <Show above="md">
        <NewDiscussionDrawer
          isOpen={isOpen}
          placement="bottom"
          onClose={onClose}
          blockScrollOnMount={false}
          closeOnOverlayClick={false}
          isFullHeight={fullHeight}
          pageName="DiscussionTopicPage"
          newContent={newComment}
          setNewContent={(content) => setNewComment(content)}
          setFullHeightReverse={() => setFullHeight(!fullHeight)}
          onOKCallback={handleSubmission}
          mobileSize={false}
        />
      </Show>

      <Hide above="md">
        <NewDiscussionDrawer
          isOpen={isOpen}
          placement="bottom"
          onClose={onClose}
          blockScrollOnMount={false}
          closeOnOverlayClick={false}
          isFullHeight={fullHeight}
          pageName="DiscussionTopicPage"
          newContent={newComment}
          setNewContent={(content) => setNewComment(content)}
          setFullHeightReverse={() => setFullHeight(!fullHeight)}
          onOKCallback={handleSubmission}
          mobileSize={true}
        />
      </Hide>
    </>
  );
};

export default DiscussionTopicPage;
