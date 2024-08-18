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
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{body}</ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>
                        {cancelText || t("common.cancel")}
                    </Button>
                    <Button colorScheme="blue" onClick={onConfirm} ml={3}>
                        {confirmText || t("common.confirm")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
export default EnableDiscussionConfirmModal;