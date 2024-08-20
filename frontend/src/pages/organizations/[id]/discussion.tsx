import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useToast } from "@/contexts/toast";
import { 
  VStack, 
  Text, 
  Card,
  CardBody,
  Flex,
  Spacer
} from '@chakra-ui/react';
import OrganizationContext from "@/contexts/organization";
import { MemberRoleEnum } from "@/models/organization";
import { DiscussionTopic } from "@/models/discussion";
import { listTopics } from "@/services/discussion";
import EnableDiscussionConfirmModal from "@/components/modals/enable-discussion-confirm-modal";
import RichList from "@/components/rich-list";
import Pagination from "@/components/pagination";

const OrganizationDiscussionPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const [topicList, setTopicList] = useState<DiscussionTopic[]>([]);
  const [topicCount, setTopicCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // Check if discussion is enabled
  useEffect(() => {
    const id = Number(router.query.id);
    if (!orgCtx.basicInfo?.is_discussion_enabled && orgCtx.userRole !== MemberRoleEnum.OWNER) {
      router.push(`/organizations/${id}/overview/`);
    } 
    
    if (orgCtx.basicInfo?.is_discussion_enabled) {
      if (id) getTopicList(id, pageIndex, pageSize);
        else {
        setTopicList([]);
        setTopicCount(0);
      }
    }
  }, [orgCtx.basicInfo?.is_discussion_enabled, orgCtx.userRole, router.query.id, pageIndex, pageSize]);

  const getTopicList = async (id: number, page: number = 1, pageSize: number = 20) => {
    try {
      const res = await listTopics(id, page, pageSize);
      setTopicCount(res.count);
      setTopicList(res.results);
    } catch (error) {
      console.error('Failed to get topic list:', error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast ({
          title: t('Services.discussion.listTopics.error'),
          status: 'error'
        })
      }
      setTopicCount(0);
      setTopicList([]);
    }
  }

  // Not enabled, show enable modal for owners
  if (!orgCtx.basicInfo?.is_discussion_enabled) return (
    <>
      <VStack spacing={6} align="start" flexWrap="wrap">
        <Text>{t("OrganizationPages.discussion.text.notEnabled")}</Text>
        <EnableDiscussionConfirmModal />
      </VStack>
    </>
  );

  return (
    <VStack spacing={6} align="stretch">
      <Card>
        <CardBody>
          <RichList
            items={
              topicList.map((topic) => ({
                title: topic.title,
                // TODO
              }))
            }
          />
        </CardBody>
      </Card>
      {topicList && topicList.length > 0 &&
        <Flex>
          <Spacer />
          <Pagination
            total={Math.ceil(topicCount / pageSize)}
            current={pageIndex}
            onPageChange={(page)=>setPageIndex(page)}
            colorScheme="blue"
            variant="subtle"
          />
        </Flex>
      }
    </VStack>
  )

};


export default OrganizationDiscussionPage;