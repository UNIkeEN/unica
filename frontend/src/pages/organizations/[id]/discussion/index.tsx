import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useToast } from "@/contexts/toast";
import {
  VStack,
  Text,
  Flex,
  Spacer,
  useDisclosure,
  Button
} from "@chakra-ui/react";
import OrganizationContext from "@/contexts/organization";
import { MemberRoleEnum } from "@/models/organization";
import { DiscussionTopic } from "@/models/discussion";
import { createTopic, listTopics, deleteTopic } from "@/services/discussion";
import EnableDiscussionConfirmModal from "@/components/modals/enable-discussion-confirm-modal";
import RichList from "@/components/rich-list";
import Pagination from "@/components/pagination";
import { formatRelativeTime } from "@/utils/datetime";
import NewDiscussionDrawer from "@/components/new-discussion-drawer";
import UserContext from "@/contexts/user";

const OrganizationDiscussionPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

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
      if (id) getTopicList(id, pageIndex, pageSize);
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

  const getTopicList = async (
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

  const handleSubmission = async () => {
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
    <VStack spacing={6} align="stretch">
      <Button onClick={onCreateTopicOpen} colorScheme="blue" ml="auto">
        {t("OrganizationPages.discussion.button.createTopic")}
      </Button>
      {topicList && topicList.length > 0 && (
        <>
          <RichList
            titleAsLink
            titleProps={{ color: "black" }}
            items={topicList.map((topic) => ({
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
      <NewDiscussionDrawer
        isOpen={isCreateTopicOpen}
        onClose={onCreateTopicClose}
        drawerTitle={t("OrganizationPages.discussion.button.createTopic")}
        variant="topic"
        comment={comment}
        setComment={(comment) => {setComment(comment);}}
        title={title}
        setTitle={(title) => {setTitle(title);}}
        onOKCallback={handleSubmission}
      >
        <React.Fragment />
      </NewDiscussionDrawer>
    </VStack>
  );
};

export default OrganizationDiscussionPage;
