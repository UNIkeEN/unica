import { useToast } from "@/contexts/toast";
import { createInvitation } from "@/services/organization";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCopy } from "react-icons/fi";
import copy from 'copy-to-clipboard';

interface InviteMembersModalProps {
  id: number;
  size?: string;
  onOKCallback?: () => void;
}

const InviteMembersModal: React.FC<InviteMembersModalProps> = ({
  id,
  size = "lg",
  onOKCallback,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();
  const initialRef = useRef(null);

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleSave = async () => {
    const success = await handleCreateInvitation(email.trim());
    if (success) {
      toast({
        title: t("InviteMembersModal.toast.created", { email: email.trim() }),
        status: "success",
      });
      onClose();
      onOKCallback();
      setEmail("");
    }
  };

  const handleCreateInvitation = async (email: string) => {
    try {
      await createInvitation(id, email);
      return true;
    } catch (error) {
      console.error("Failed to create invitation:", error);
      if (
        error.response &&
        (error.response.status === 403 ||
          error.response.status === 404 ||
          error.response.status === 409)
      ) {
        toast({
          title: t("InviteMembersModal.toast.error"),
          description: t(
            `InviteMembersModal.toast.error-${error.response.status}`
          ),
          status: "error",
        });
      }
      if (error.response && error.response.status === 403) {
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      return false;
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        {t("OrganizationPages.members.button.invite")}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("InviteMembersModal.modal.title")}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={5}>
            <FormControl pb={5} isInvalid={!isEmailValid} isRequired>
              <FormLabel>{t("InviteMembersModal.modal.email")}</FormLabel>
              <Input
                placeholder={t("InviteMembersModal.modal.email")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onBlur={() =>
                  setIsEmailValid(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      email.trim()
                    )
                  )
                }
                onFocus={() => setIsEmailValid(true)}
                ref={initialRef}
              />
              {!isEmailValid && (
                <FormErrorMessage>
                  {t("InviteMembersModal.toast.emailInvalid")}
                </FormErrorMessage>
              )}
              <FormHelperText
                wordBreak='break-all'
                overflowWrap='break-word'
                lineHeight={1.5}
              >
                {t("InviteMembersModal.modal.emailHelper-1", {
                  base_uri: window.location.origin,
                  id: id,
                })}
                <IconButton
                  variant="ghost"
                  colorScheme="gray"
                  size="xs"
                  aria-label="copy"
                  icon={<FiCopy />}
                  mt={-0.5}
                  onClick={() => {
                    initialRef.current.blur();
                    copy(`${window.location.origin}/organizations/${id}/invitation`);
                    toast({
                      title: t("InviteMembersModal.toast.copied"),
                      status: "info",
                    });
                  }}
                />
                {t("InviteMembersModal.modal.emailHelper-2")}
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isDisabled={!isEmailValid}
            >
              {t("InviteMembersModal.modal.save")}
            </Button>
            <Button onClick={onClose}>
              {t("InviteMembersModal.modal.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InviteMembersModal;
