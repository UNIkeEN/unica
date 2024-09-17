import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import NextLink from 'next/link';
import { useToast } from "@/contexts/toast";
import {
  VStack,
  Text,
  Flex,
  Spacer,
  useDisclosure,
  Button,
  Grid,
  GridItem,
  Link,
  HStack,
  Box
} from "@chakra-ui/react";
import OrganizationContext from "@/contexts/organization";
import { MemberRoleEnum } from "@/models/organization";
import { DiscussionTopic, DiscussionTopicCategory } from "@/models/discussion";
import { createTopic, listTopics } from "@/services/discussion";
import { formatRelativeTime } from "@/utils/datetime";
import EnableDiscussionConfirmModal from "@/components/modals/enable-discussion-confirm-modal";
import RichList from "@/components/rich-list";
import NavMenu from "@/components/nav-menu";
import Pagination from "@/components/pagination";
import NewDiscussionDrawer from "@/components/new-discussion-drawer";
import CategoryIcon from "@/components/category-icon";

const OrganizationDiscussionPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const [categories, setCategories] = useState<DiscussionTopicCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    router.query.categoryId ? Number(router.query.categoryId) : 0
  );
  const [topicList, setTopicList] = useState<DiscussionTopic[]>([]);
  const [topicCount, setTopicCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [comment, setComment] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [newTopicCategory, setNewTopicCategory] = useState<number>(0);

  const [listHeight, setListHeight] = useState("70vh");
  const listRef = useRef(null);

  const {
    isOpen: isCreateTopicOpen,
    onOpen: onCreateTopicOpen,
    onClose: onCreateTopicClose,
  } = useDisclosure();

  // Check if discussion is enabled
  useEffect(() => {
    const id = Number(router.query.id);
    if (
      !orgCtx.basicInfo?.is_discussion_enabled &&
      orgCtx.userRole !== MemberRoleEnum.OWNER
    ) {
      router.push(`/organizations/${id}/overview/`);
    }

    if (orgCtx.basicInfo?.is_discussion_enabled) {
      if (id) handleListTopics(id, pageIndex, pageSize, selectedCategoryId);
      else {
        setTopicList([]);
        setTopicCount(0);
      }
    }
  }, [
    orgCtx.basicInfo?.is_discussion_enabled,
    orgCtx.userRole,
    router.query.id
  ]);

  useEffect(() => {
    const id = Number(router.query.id);
    const urlCatId = router.query.categoryId ? Number(router.query.categoryId) : 0;
    if (id) {
      orgCtx.handleListDiscussionCategories(1, 10, id)
        .then((res) => {
          if (urlCatId !== 0 && !res.results.some(cat => cat.id === urlCatId)) {
            const extraCategory = {
              id: urlCatId,
              name: "Loading...",
              color: "gray" as const,
            }  // TODO: get category from API
            setCategories([...res.results, extraCategory]);
          } else {
            setCategories(res.results);
          }
        })
      .catch((error) => {setCategories([]);})
    } else {
      setCategories([]);
    }
  }, [router.query.id]);

  useEffect(() => {
    const urlCatId = router.query.categoryId ? Number(router.query.categoryId) : 0;
    setSelectedCategoryId(urlCatId);
    setPageIndex(1)
    handleListTopics(Number(router.query.id), 1, pageSize, urlCatId);
  }, [router.query.categoryId]);

  useEffect(() => {
    const updateListHeight = () => {
      if (listRef.current) {
        const topOffset = listRef.current.getBoundingClientRect().top;
        const newHeight = `calc(100vh - ${topOffset}px - 24px)`;
        setListHeight(newHeight);
      }
    };
    
    setTimeout(() => {
      updateListHeight();
    }, 200);

    const resizeObserver = new ResizeObserver(() => { updateListHeight(); });
    if (listRef.current) {
      resizeObserver.observe(document.body);
    }
    return () => { resizeObserver.disconnect(); };
  }, []);

  const handleListTopics = async (
    id: number,
    page: number = 1,
    pageSize: number = 20,
    categoryId?: number
  ) => {
    try {
      const res = await listTopics(id, page, pageSize, categoryId);
      setTopicCount(res.count);
      setTopicList(res.results);
    } catch (error) {
      console.error("Failed to get topic list:", error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.listTopics.error"),
          status: "error",
        });
      }
      setTopicCount(0);
      setTopicList([]);
    }
  };

  const handleCreateTopic = async () => {
    const id = Number(router.query.id);
    try {
      const res = await createTopic(
        id,
        title,
        newTopicCategory,
        comment
      );
      if (res.local_id) {
        router.push("/organizations/" + id + "/discussion/" + res.local_id);
        toast({
          title: t("Services.discussion.createTopic.success"),
          status: "success",
        });
      }
    } catch (error) {
      console.error("Failed to create topic:", error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } 
      else if (error.request && error.request.status === 429) {
        toast({
          title: t("Services.discussion.createTopic.error-429"),
          status: "error",
        })
      }
      else if (error.request && error.request.status === 400) {
        toast({
          title: t("Services.discussion.createTopic.error-400"),
          status: "error",
        })
      }
      else {
        toast({
          title: t("Services.discussion.createTopic.error"),
          status: "error",
        });
      }
    }
  };


  // Not enabled, show enable modal for owners
  if (!orgCtx.basicInfo?.is_discussion_enabled)
    return (
      <>
        <VStack spacing={6} align="start" flexWrap="wrap">
          <Text>{t("OrganizationPages.discussion.text.notEnabled")}</Text>
          <EnableDiscussionConfirmModal />
        </VStack>
      </>
    );

  return (
    <>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <GridItem
            colSpan={{ base: 0, lg: 1 }}
            display={{ base: "none", lg: "block" }}
        >
          <VStack spacing={4} align="stretch">
            <Text ml={1} mt={2} fontWeight="semibold">{t("OrganizationPages.discussion.subtitle.categories")}</Text>
            <NavMenu
              spacing={2}
              selectedKeys={[selectedCategoryId]}
              onClick={(value) => {
                router.push({
                  pathname: router.pathname,
                  query: { ...router.query, ["categoryId"]: value }
                });
              }}
              items={[
                {
                  label: <Text>{t("OrganizationPages.discussion.button.viewAllTopics")}</Text>,
                  value: 0,
                },
                ...(categories && categories.length > 0 ? categories.map((category) => ({
                  label: (
                    <HStack spacing={2}>
                      <CategoryIcon category={category} size="md" />
                      <Text>{category.name}</Text>
                    </HStack>
                  ),
                  value: category.id,
                })) : []),
              ]}
            />
            <Link 
              as={NextLink} 
              color="blue.500" 
              fontSize="xs" 
              href={`/organizations/${router.query.id}/discussion/categories`}
            >
              {t(`OrganizationPages.discussion.button.allCategories${orgCtx.userRole === MemberRoleEnum.OWNER && "WithManage"}`)}
            </Link>
          </VStack>
        </GridItem>
        <GridItem colSpan={{ base: 5, lg: 4 }}>
          <VStack spacing={4} align="stretch">
            <Flex>
              <Text ml={1} mt={2} fontWeight="semibold">{t("OrganizationPages.discussion.subtitle.topics")}</Text>
              <Button onClick={onCreateTopicOpen} colorScheme="blue" ml="auto">
                {t("OrganizationPages.discussion.button.createTopic")}
              </Button>
            </Flex>
            
              <VStack
                align="strench"
                overflow="auto"
                height={listHeight}
                ref={listRef}
              >
                <RichList
                  titleAsLink
                  titleProps={{ color: "black" }}
                  items={topicList.map((topic) => ({
                    linePrefix: <CategoryIcon category={topic.category} withTooltip />,
                    title: topic.title,
                    href: `/organizations/${router.query.id}/discussion/${topic.local_id}`,
                    body: (
                      <Text fontSize="sm" className="secondary-text">
                        {t("General.updated_at", {
                          time: formatRelativeTime(topic.updated_at, t),
                        })}
                      </Text>
                    ),
                  }))}
                />
                {topicList && topicList.length > 0 && ( 
                  <Pagination
                    total={Math.ceil(topicCount / pageSize)}
                    current={pageIndex}
                    onPageChange={(page) => {
                      setPageIndex(page)
                      handleListTopics(Number(router.query.id), page, pageSize, selectedCategoryId)
                    }}
                    colorScheme="blue"
                    variant="subtle"
                    ml="auto"
                  /> )}
              </VStack>
          </VStack>
        </GridItem>
      </Grid>
      <NewDiscussionDrawer
        isOpen={isCreateTopicOpen}
        onClose={onCreateTopicClose}
        drawerTitle={t("OrganizationPages.discussion.button.createTopic")}
        variant="topic"
        comment={comment}
        setComment={(comment) => { setComment(comment); }}
        title={title}
        setTitle={(title) => { setTitle(title); }}
        categories={categories}
        newTopicCategory={newTopicCategory}
        setNewTopicCategory={(category) => { setNewTopicCategory(category); }}
        onOKCallback={handleCreateTopic}
      >
        <React.Fragment />
      </NewDiscussionDrawer>
    </>
  );
};

export default OrganizationDiscussionPage;
