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
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Hide,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaReply } from "react-icons/fa";
import { LuArrowUpToLine } from "react-icons/lu";
import { FiShare2 } from "react-icons/fi";
import { BeatLoader } from 'react-spinners';
import InfiniteScroll from "react-infinite-scroller";
import NewDiscussionDrawer from "@/components/new-discussion-drawer";
import CommentList from "@/components/comment-list";
import CategoryIcon from "@/components/category-icon";
import OrganizationContext from "@/contexts/organization";
import { useToast } from "@/contexts/toast";
import { DiscussionComment, DiscussionTopic } from "@/models/discussion";
import {
  getTopicInfo,
  deleteTopic,
  createComment,
  listComments,
  deleteComment,
  editComment
} from "@/services/discussion";
import { shareContent } from "@/utils/share";
import { formatRelativeTime } from "@/utils/datetime";

const DiscussionTopicPage = () => {
  const router = useRouter();
  const org_id = Number(router.query.id);
  const topic_local_id = Number(router.query.local_id);
  const { t } = useTranslation();
  const orgCtx = useContext(OrganizationContext);
  const toast = useToast();

  const [topic, setTopic] = useState<DiscussionTopic | null>(null);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [newCommentLocalId, setNewCommentLocalId] = useState<number | null>(null);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreReverse, setHasMoreReverse] = useState<boolean>(true);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scrollReverse, setScrollReverse] = useState<boolean>(false);

  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const [mainAreaHeight, setMainAreaHeight] = useState("80vh");
  const titleRef = useRef(null);
  const mainAreaBoxRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTitleVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (titleRef.current) { observer.observe(titleRef.current); }
    return () => {
      if (titleRef.current) { observer.unobserve(titleRef.current); }
    };
  }, []);

  useEffect(() => {
    const updateMainAreaHeight = () => {
      if (mainAreaBoxRef.current) {
        const topOffset = mainAreaBoxRef.current.getBoundingClientRect().top;
        const newHeight = `calc(100vh - ${topOffset}px - 24px)`; // 24px for py={6} as parent Flex in MainLayout
        setMainAreaHeight(newHeight);
      }
    };
    updateMainAreaHeight(); // Initial height

    const resizeObserver = new ResizeObserver(() => { updateMainAreaHeight(); });
    if (mainAreaBoxRef.current) {
      resizeObserver.observe(document.body);
    }
    return () => { resizeObserver.disconnect(); }
  }, []);

  const breadcrumbs = [
    {
      text: orgCtx.basicInfo?.display_name,
      link: `/organizations/${org_id}/discussion/`,
    },
  ];

  useEffect(() => {
    if (topic) {
      const metaTitle = isTitleVisible
        ? orgCtx.basicInfo?.display_name
        : topic.title;
      const metaBreadcrumbs = isTitleVisible
        ? JSON.stringify("")
        : JSON.stringify(breadcrumbs);
      document
        .querySelector('meta[name="headerTitle"]')
        .setAttribute("content", metaTitle);
      document
        .querySelector('meta[name="headerBreadcrumbs"]')
        .setAttribute("content", metaBreadcrumbs);
    }
  }, [isTitleVisible, topic]);

  useEffect(() => {
    handleGetTopicInfo();
    initializeComments();
  }, []);

  const initializeComments = async () => {
    setIsLoading(true);
    const res = await handleListComments(1, pageSize);
    setComments(res.results);
    setIsLoading(false);
  };

  const handleUserScroll = () => {
    setIsUserScrolling(true);
  };

  useEffect(() => {
    const container = mainAreaBoxRef.current;
    if (container) {
      container.addEventListener('scroll', handleUserScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleUserScroll);
      }
    };
  }, [mainAreaBoxRef]);

  useEffect(() => {
    if (!scrollReverse || !hasMoreReverse) return;
    const container = mainAreaBoxRef.current;
    if (container && container.scrollHeight <= container.clientHeight) {
      loadMoreCommentsReverse();
    } else if (!isUserScrolling) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
    setIsUserScrolling(false);
  }, [comments]);

  const handleGetTopicInfo = async () => {
    try {
      const res = await getTopicInfo(org_id, topic_local_id);
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
      setTimeout(() => {
        router.push(`/organizations/${org_id}/discussion/`);
      }, 1500);
    }
  };

  const handleListComments = async (page: number = 1, pageSize: number = 20) => {
    try {
      const res = await listComments(org_id, page, pageSize, topic_local_id);
      setCommentsCount(res.count);
      if (res.count <= page * pageSize) setHasMore(false);
      if (page === 1) setHasMoreReverse(false);
      return res;
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
      return {};
    }
  };

  const loadMoreComments = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const res = await handleListComments(page + 1, pageSize);
    setComments([...comments, ...res.results]);
    setPage(page + 1);
    setIsLoading(false);
  };

  const loadMoreCommentsReverse = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const res = await handleListComments(page - 1, pageSize);
    setComments([...res.results, ...comments]);
    setPage(page - 1);
    setIsLoading(false);
  }

  const handleSubmission = async () => {
    try {
      const res = await createComment(org_id, topic_local_id, newComment);
      if (res.local_id) {
        setNewCommentLocalId(res.local_id);
        setTimeout(() => {
          setNewCommentLocalId(null);
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else if (error.request && error.request.status === 429) {
        toast({
          title: t("Services.discussion.createComment.error-429"),
          status: "error",
        });
      } else if (error.request && error.request.status === 400) {
        toast({
          title: t("Services.discussion.createComment.error-400"),
          status: "error",
        });
      } else {
        toast({
          title: t("Services.discussion.createComment.error"),
          status: "error",
        });
      }
      return;
    }
    toast({
      title: t("Services.discussion.createComment.success"),
      status: "success",
    });
    setNewComment("");
    onClose();

    await handleListComments(1, pageSize); // Refresh commentCount
    const lastPage = Math.ceil((commentsCount + 1) / pageSize);
    setPage(lastPage);
    setHasMoreReverse(lastPage > 1);
    setScrollReverse(true);
    const res = await handleListComments(lastPage, pageSize);
    setComments(res.results);
    setTimeout(() => {
      mainAreaBoxRef.current.scrollTop = mainAreaBoxRef.current.scrollHeight;
    }, 100);
  };

  const handleDeleteTopic = async () => {
    try {
      await deleteTopic(org_id, topic_local_id);
    } catch (error) {
      console.error("Failed to delete topic:", error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.deleteTopic.error"),
          status: "error",
        });
      }
      return;
    }
    toast({
      title: t("Services.discussion.deleteTopic.success"),
      status: "success",
    });
    setTimeout(() => {
      router.push(`/organizations/${org_id}/discussion/`);
    }, 1500);
  };

  const handleDeleteComment = async (comment: DiscussionComment) => {
    try {
      await deleteComment(org_id, topic_local_id, comment.local_id);
      toast({
        title: t("Services.discussion.deleteComment.success"),
        status: "success",
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.deleteComment.error"),
          status: "error",
        });
      }
      return;
    }
    setComments(
      comments.map((c) =>
        c.local_id === comment.local_id
          ? {
            ...c,
            deleted : true
          } : c
      )
    );
    setCommentsCount(commentsCount - 1);
  };

  const handleEditComment = async (
    comment: DiscussionComment,
    newContent: string
  ) => {
    if (newContent === comment.content) return;
    try {
      await editComment(org_id, topic_local_id, comment.local_id, newContent);
      toast({
        title: t("Services.discussion.editComment.success"),
        status: "success",
      });
    } catch (error) {
      console.error("Failed to edit comment:", error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.editComment.error"),
          status: "error",
        });
      }
      return;
    }
    setComments(
      comments.map((c) =>
        c.local_id === comment.local_id
          ? {
            ...c,
            content: newContent,
            edited: true
          } : c
      )
    );
  };

  return (
    <>
      <Head>
        <meta name="headerTitle" content={orgCtx.basicInfo?.display_name} />
        <meta name="headerBreadcrumbs" content="" />
      </Head>
      <Box
        overflow='auto'
        height={mainAreaHeight}
        id='mainAreaBox'
        ref={mainAreaBoxRef}
      >
        <Grid templateColumns="repeat(4, 1fr)" gap={16}>
          <GridItem colSpan={{ base: 4, md: 3 }}>
            <VStack spacing={6} align="stretch">
              <Skeleton isLoaded={topic !== null}>
                <Heading
                  as="h3" size="lg"
                  wordBreak="break-all"
                  ref={titleRef}
                  px={1}
                >
                  {topic?.title}
                  <Text
                    as="span"
                    fontWeight="normal"
                    color="gray.400"
                    ml={2}
                  >{`#${topic?.local_id}`}</Text>
                </Heading>
                <Hide above="md">
                  <Flex mt={2} ml={1} alignItems="center">
                    {topic && topic.category && topic.category.id && 
                      <HStack spacing={2} mr={6}>
                        <CategoryIcon size="md" category={topic.category}/>
                        <Text fontSize="sm" color="gray.600">{topic.category.name}</Text>
                      </HStack>
                    }
                    <Text fontSize="sm" color="gray.600">
                      {t("DiscussionTopicPage.text.activity", {count: commentsCount})}
                      {formatRelativeTime(topic?.updated_at, t)}
                    </Text>
                  </Flex>
                </Hide>
              </Skeleton>
              {comments && comments.length > 0 ? (
                <InfiniteScroll
                  loadMore={scrollReverse ? loadMoreCommentsReverse : loadMoreComments}
                  hasMore={scrollReverse ? hasMoreReverse : hasMore}
                  isReverse={scrollReverse}
                  useWindow={false}
                  initialLoad={false}
                  getScrollParent={() => document.getElementById('mainAreaBox')}
                  loader={
                    <HStack justifyContent='center' mt='5'>
                      <BeatLoader size={8} color='gray' />
                    </HStack>
                  }>
                  <CommentList
                    items={comments}
                    onCommentDelete={handleDeleteComment}
                    onCommentEdit={handleEditComment}
                    onTopicDelete={handleDeleteTopic}
                    topic_op={topic?.user}
                    newCommentLocalId={newCommentLocalId}
                  />
                </InfiniteScroll>
              ) : (
                <Flex justify="space-between" alignItems="flex-start">
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    ml={{ base: "2", md: "4" }}
                    noOfLines={4}
                    spacing="4"
                    skeletonHeight="4"
                    flex="1"
                  />
                </Flex>
              )}
              <HStack spacing={2}>
                <Button
                  colorScheme="blue"
                  leftIcon={<FaReply />}
                  onClick={() => {
                    onOpen();
                  }}
                >
                  {t("DiscussionTopicPage.button.reply")}
                </Button>
                <Button
                  leftIcon={<FiShare2 />}
                  onClick={() => {
                    shareContent(
                      topic.title,
                      `Discussion on ${orgCtx.basicInfo?.display_name} #${topic.local_id}`,
                      window.location.href,
                      toast, t
                    )
                  }}
                >
                  {t("DiscussionTopicPage.button.share")}
                </Button>
              </HStack>
            </VStack>
          </GridItem>
          <GridItem
            colSpan={{ base: 0, md: 1 }}
            display={{ base: "none", md: "block" }}
          >
            <Box position="sticky" top="0">
              <VStack spacing={6} alignItems="start">
                {topic && topic.category && topic.category.id && 
                  <Box>
                    <Text mb={2} className="secondary-text">
                      {t("DiscussionTopicPage.sider.category")}
                    </Text>
                    <HStack spacing={2}>
                      <CategoryIcon category={topic.category}/>
                      <Text color="gray.600">{topic.category.name}</Text>
                    </HStack>
                  </Box>
                }
                <Box>
                  <Text mb={2} className="secondary-text">
                    {t("DiscussionTopicPage.sider.activity")}
                  </Text>
                  <Text color="gray.600">
                    {t("DiscussionTopicPage.text.activity", {count: commentsCount})}
                    {formatRelativeTime(topic?.updated_at, t)}
                  </Text>
                </Box>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Add Comment"
                    icon={<FaReply />}
                    onClick={() => {
                      onOpen();
                    }}
                  />
                  <IconButton
                    aria-label="Scroll to Top"
                    icon={<LuArrowUpToLine />}
                    onClick={async () => {
                      if (scrollReverse) {
                        setPage(1);
                        setScrollReverse(false);
                        setHasMore(true);
                        const res = await handleListComments(1, pageSize);
                        setComments(res.results);
                      }
                      titleRef.current.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                </HStack>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Box>

      <NewDiscussionDrawer
        isOpen={isOpen}
        onClose={onClose}
        drawerTitle={t("DiscussionTopicPage.drawer.reply")}
        variant="comment"
        comment={newComment}
        setComment={(comment) => setNewComment(comment)}
        onOKCallback={handleSubmission}
      >
        <React.Fragment />
      </NewDiscussionDrawer>
    </>
  );
};

export default DiscussionTopicPage;
