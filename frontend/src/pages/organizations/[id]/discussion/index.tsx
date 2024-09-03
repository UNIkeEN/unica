import React, { useContext, useEffect, useState } from "react";
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [topicList, setTopicList] = useState<DiscussionTopic[]>([]);
  const [topicCount, setTopicCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [comment, setComment] = useState<string>("");
  const [title, setTitle] = useState<string>("");

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
      if (id) handleListTopics(id, pageIndex, pageSize);
      else {
        setTopicList([]);
        setTopicCount(0);
      }
    }
  }, [
    orgCtx.basicInfo?.is_discussion_enabled,
    orgCtx.userRole,
    router.query.id,
    pageIndex,
    pageSize,
  ]);

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) {
      orgCtx.handleListDiscussionCategories(id)
      .then((res) => {setCategories(res);})
      .catch((error) => {setCategories([]);})
    } else {
      setCategories([]);
    }
  }, [router.query.id]);

  const handleListTopics = async (
    id: number,
    page: number = 1,
    pageSize: number = 20
  ) => {
    try {
      const res = await listTopics(id, page, pageSize);
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
        0, // category_id, default to 0
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
      } else {
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
              items={[
                {
                  label: <Text>{t("OrganizationPages.discussion.button.viewAllTopics")}</Text>,
                  value: 0,
                  onClick: {}
                },
                ...(categories && categories.length > 0 ? categories.slice(0, 10).map((category) => ({
                  label: (
                    <HStack spacing={2}>
                      <CategoryIcon category={category} size="md" />
                      <Text>{category.name}</Text>
                    </HStack>
                  ),
                  value: category.id,
                  onClick: {}
                })) : [])
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
            {topicList && topicList.length > 0 && (
              <>
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
                <Flex>
                  <Spacer />
                  <Pagination
                    total={Math.ceil(topicCount / pageSize)}
                    current={pageIndex}
                    onPageChange={(page) => setPageIndex(page)}
                    colorScheme="blue"
                    variant="subtle"
                  />
                </Flex>
              </>
            )}
          </VStack>
        </GridItem>
      </Grid>
      <NewDiscussionDrawer
        isOpen={isCreateTopicOpen}
        onClose={onCreateTopicClose}
        drawerTitle={t("OrganizationPages.discussion.button.createTopic")}
        variant="topic"
        comment={comment}
        setComment={(comment) => {setComment(comment);}}
        title={title}
        setTitle={(title) => {setTitle(title);}}
        onOKCallback={handleCreateTopic}
      >
        <React.Fragment />
      </NewDiscussionDrawer>
    </>
  );
};

export default OrganizationDiscussionPage;
