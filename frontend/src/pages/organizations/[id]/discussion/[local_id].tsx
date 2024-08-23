import MarkdownRenderer from "@/components/markdown-renderer";
import NewDiscussionDrawer from "@/components/new-discussion-drawer";
import RichList from "@/components/rich-list";
import OrganizationContext from "@/contexts/organization";
import { useToast } from "@/contexts/toast";
import { DiscussionComment, DiscussionTopic } from "@/models/discussion";
import { createComment, listComments } from "@/services/discussion";
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
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMessageCircle } from "react-icons/fi";

const DiscussionTopicPage = () => {
  const router = useRouter();
  const org_id = Number(router.query.id);
  const local_id = Number(router.query.local_id);
  const { t } = useTranslation();
  const orgCtx = useContext(OrganizationContext);
  const toast = useToast();

  const [topic, setTopic] = useState<DiscussionTopic | null>(null);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [fullHeight, setFullHeight] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [commentCount, setCommentCount] = useState<number>(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    //TODO: get topic from backend
    setTopic({
      id: 1,
      local_id: local_id,
      title: "Test Topic",
      created_at: "2021-10-01T00:00:00",
      updated_at: "2021-10-01T00:00:00",
    });
    getCommentsList(page, pageSize);
  }, [page, pageSize]);

  const getCommentsList = async (page: number = 1, pageSize: number = 20) => {
    try {
      const res = await listComments(org_id, page, pageSize, local_id);
      console.warn(res);
      setComments(res.results);
      setCommentCount(res.count);
    } catch (error) {
      console.error("Failed to get comment list:", error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.listComments.error"),
          status: "error",
        });
      }
      setComments([]);
      setCommentCount(0);
    }
  };

  const handleSubmission = async () => {
    const success = await handleAddComment();
    if (success) {
      toast({
        title: t("Services.discussion.createComment.success"),
        status: "success",
      });
      setNewComment("");
      onClose();
    }
  };

  const handleAddComment = async () => {
    try {
      await createComment(org_id, local_id, newComment);
      getCommentsList(page, pageSize);
      return true;
    } catch (error) {
      console.error("Failed to create topic:", error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.createComment.error"),
          status: "error",
        });
      }
      return false;
    }
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
