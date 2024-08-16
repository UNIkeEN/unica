import { useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useToast } from "@/contexts/toast";
import { VStack, Text, Button } from '@chakra-ui/react';
import OrganizationContext from "@/contexts/organization";
import { MemberRoleEnum } from "@/models/organization";
import { enableDiscussion } from "@/services/discussion";

const OrganizationDiscussionPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!orgCtx.basicInfo?.is_discussion_enabled && orgCtx.userRole !== MemberRoleEnum.OWNER) {
      router.push(`/organizations/${router.query.id}/overview/`);
    }
  }, []);

  const handleEnableDiscussion = async () => {
    try {
      await enableDiscussion(orgCtx.basicInfo.id);
      toast({
        title: t("Services.discussion.enableDiscussion.success"),
        status: "success",
      });
      orgCtx.setBasicInfo({
        ...orgCtx.basicInfo,
        is_discussion_enabled: true,
      });
    } catch (error) {
      console.error("Failed to enable discussion:", error);
      if (error.response && error.response.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      }
       else toast({
        title: t("Services.discussion.enableDiscussion.error"),
        status: "error",
      });
    }
  }

  if (!orgCtx.basicInfo?.is_discussion_enabled) return (
    <>
      <VStack spacing={6} align="start" flexWrap="wrap">
        <Text>{t("OrganizationPages.discussion.text.notEnabled")}</Text>
        <Button 
          colorScheme="blue"
          onClick={handleEnableDiscussion}
        >
          {t("OrganizationPages.discussion.button.enable")}
        </Button>
      </VStack>
    </>
  );
}

export default OrganizationDiscussionPage;