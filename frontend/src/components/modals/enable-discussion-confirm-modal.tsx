import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useTranslation } from "react-i18next";

interface EnableDiscussionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: ReactNode;
  confirmText?: string;
  cancelText?: string;
}
const EnableDiscussionConfirmModal: React.FC<EnableDiscussionConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  confirmText,
  cancelText,
}) => {
  const { t } = useTranslation();
  return (
    <>
    
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("EnableDiscussionConfirmModal.modal.title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{t("EnableDiscussionConfirmModal.modal.body")}</ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              {t("EnableDiscussionConfirmModal.modal.cancel")}
            </Button>
            <Button colorScheme="blue" onClick={onConfirm} ml={3}>
              {t("EnableDiscussionConfirmModal.modal.confirm")}
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EnableDiscussionConfirmModal;