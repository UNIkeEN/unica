import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useToast } from "@/contexts/toast";
import { enableDiscussion } from '@/services/discussion';
import { useContext } from "react";
import OrganizationContext from '@/contexts/organization';

const EnableDiscussionConfirmModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();
  const orgCtx = useContext(OrganizationContext);

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
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Failed to enable discussion:", error);
      if (error.response && error.response.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.discussion.enableDiscussion.error"),
          status: "error",
        });
      }
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        {t("OrganizationPages.discussion.button.enable")}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("EnableDiscussionConfirmModal.modal.title")}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>{t("EnableDiscussionConfirmModal.modal.body")}</ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} >
              {t("EnableDiscussionConfirmModal.modal.cancel")}
            </Button>
            <Button colorScheme="blue" onClick={handleEnableDiscussion}>
              {t("EnableDiscussionConfirmModal.modal.confirm")}
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
};

export default EnableDiscussionConfirmModal;
