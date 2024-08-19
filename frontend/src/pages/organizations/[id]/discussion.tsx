import { useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useToast } from "@/contexts/toast";
import { VStack, Text, Button } from '@chakra-ui/react';
import OrganizationContext from "@/contexts/organization";
import { MemberRoleEnum } from "@/models/organization";
import { enableDiscussion } from "@/services/discussion";
import EnableDiscussionConfirmModal from "@/components/modals/enable-discussion-confirm-modal";

const OrganizationDiscussionPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!orgCtx.basicInfo?.is_discussion_enabled && orgCtx.userRole !== MemberRoleEnum.OWNER) {
      router.push(`/organizations/${router.query.id}/overview/`);
    }
  }, [orgCtx.basicInfo?.is_discussion_enabled, orgCtx.userRole, router]);

  if (!orgCtx.basicInfo?.is_discussion_enabled) return (
    <>
      <VStack spacing={6} align="start" flexWrap="wrap">
        <Text>{t("OrganizationPages.discussion.text.notEnabled")}</Text>
        <EnableDiscussionConfirmModal />
      </VStack>
    </>
  );

};


export default OrganizationDiscussionPage;