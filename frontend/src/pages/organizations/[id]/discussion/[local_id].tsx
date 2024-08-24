import MarkdownRenderer from "@/components/markdown-renderer";
import NewDiscussionDrawer from "@/components/new-discussion-drawer";
import CommentList from "@/components/comment-list";
import OrganizationContext from "@/contexts/organization";
import { useToast } from "@/contexts/toast";
import { DiscussionComment, DiscussionTopic } from "@/models/discussion";
import { getTopicInfo, createComment, listComments } from "@/services/discussion";
import { formatRelativeTime } from "@/utils/datetime";
import {
  Grid,
  GridItem,
  Heading,
  IconButton,
  Button,
  Text,
  VStack,
  Box,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from 'next/head';
import { useContext, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaReply } from "react-icons/fa";
import { LuArrowUpToLine } from "react-icons/lu";
import { FiShare2 } from "react-icons/fi";

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
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const titleRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTitleVisible(entry.isIntersecting);
      },{ threshold: 0.1 }
    );
    if (titleRef.current) {observer.observe(titleRef.current);}
    return () => {if (titleRef.current) {observer.unobserve(titleRef.current);}};
  }, []);

  const breadcrumbs = [{ 
    text: orgCtx.basicInfo?.display_name, 
    link: `/organizations/${router.query.id}/discussion/` 
  }];

  useEffect(() => {
    if (topic) {
      const metaTitle = isTitleVisible ? orgCtx.basicInfo?.display_name : topic.title;
      const metaBreadcrumbs = isTitleVisible
        ? JSON.stringify("")
        : JSON.stringify(breadcrumbs);
      document.querySelector('meta[name="headerTitle"]').setAttribute("content", metaTitle);
      document.querySelector('meta[name="headerBreadcrumbs"]').setAttribute("content", metaBreadcrumbs);
    }
  }, [isTitleVisible, topic]);

  useEffect(() => {
    getTopic();
    getCommentsList(page, pageSize);
  }, [page, pageSize]);

  const getTopic = async () => {
    try {
      const res = await getTopicInfo(org_id, local_id);
      setTopic(res);
    } catch (error) {
      console.error("Failed to get topic info:", error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.getTopicInfo.error"),
          status: "error",
        });
      }
      setTopic(null);
    }
  };

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

  return (
    <>
      <Head>
        <meta name="headerTitle" content={orgCtx.basicInfo?.display_name} />
        <meta name="headerBreadcrumbs" content="" />
      </Head>
      <Grid templateColumns='repeat(4, 1fr)' gap={16}>
        <GridItem colSpan={{ base: 4, md: 3 }}>
          <VStack spacing={6} align="stretch">
            <Heading as='h3' size='lg' wordBreak="break-all" ref={titleRef}>
              {topic?.title}<Text as='span' fontWeight="normal" color="gray.400" ml={2}>{`#${topic?.local_id}`}</Text>
            </Heading>
            {comments && comments.length > 0 && (
              <CommentList items={comments} />
            )}
            <HStack spacing={2}>
              <Button 
                colorScheme="blue" 
                leftIcon={<FaReply />}
                onClick={() => { onOpen(); }}
              >
                {t("DiscussionTopicPage.button.reply")}
              </Button>
              <Button 
                leftIcon={<FiShare2 />}
                onClick={() => {}} // TODO: share
              >
                {t("DiscussionTopicPage.button.share")}
              </Button>
            </HStack>
          </VStack>
        </GridItem>
        <GridItem colSpan={{ base: 0, md: 1 }} display={{ base: 'none', md: 'block' }}>
          <Box position="sticky" top="2">
            <HStack spacing={2}>
              <IconButton
                aria-label="Add Comment"
                icon={<FaReply />}
                onClick={() => { onOpen(); }}
              />
              <IconButton
                aria-label="Scroll to Top"
                icon={<LuArrowUpToLine />}
                onClick={() => { titleRef.current.scrollIntoView({ behavior: "smooth" }); }}
              />
            </HStack>
          </Box>
        </GridItem>
      </Grid>

      <NewDiscussionDrawer
        isOpen={isOpen}
        onClose={onClose}
        pageName="DiscussionTopicPage"
        content={newComment}
        setContent={(content) => setNewComment(content)}
        onOKCallback={handleSubmission}
        children={<></>}
      />
    </>
  );
};

export default DiscussionTopicPage;
