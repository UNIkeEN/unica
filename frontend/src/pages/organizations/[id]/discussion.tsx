import { useContext, useEffect, useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!orgCtx.basicInfo?.is_discussion_enabled && orgCtx.userRole !== MemberRoleEnum.OWNER) {
      router.push(`/organizations/${router.query.id}/overview/`);
    }
  }, [orgCtx.basicInfo, orgCtx.userRole, router]);

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
    } finally {
      setIsModalOpen(false);
    }
  }
  const onOpenModal = () => setIsModalOpen(true);
  const onCloseModal = () => setIsModalOpen(false);

  if (!orgCtx.basicInfo?.is_discussion_enabled) return (
    <>
      <VStack spacing={6} align="start" flexWrap="wrap">
        <Text>{t("OrganizationPages.discussion.text.notEnabled")}</Text>
        <Button
          colorScheme="blue"
          onClick={onOpenModal}
        >
          {t("OrganizationPages.discussion.button.enable")}
        </Button>
      </VStack>

      <EnableDiscussionConfirmModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onConfirm={handleEnableDiscussion}
        title={t("OrganizationPages.discussion.modal.title")}
        body={t("OrganizationPages.discussion.modal.body")}
        confirmText={t("OrganizationPages.discussion.modal.confirm")}
        cancelText={t("OrganizationPages.discussion.modal.cancel")}
      />
    </>
  );
  return null;
}

export default OrganizationDiscussionPage;