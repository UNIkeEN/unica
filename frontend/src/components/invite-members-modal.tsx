import { createInvitation } from "@/services/organization";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { useToast } from "@/contexts/toast";
import { useTranslation } from "react-i18next";

interface InviteMembersModalProps {
  id: number;
  size?: string;
}

const InviteMembersModal: React.FC<InviteMembersModalProps> = ({
  id,
  size = "lg",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();
  const initialRef = useRef(null);

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleSave = async () => {
    if (!isEmailValid) {
      toast({
        title: t("InviteMembersModal.toast.error"),
        description: t("InviteMembersModal.toast.emailInvalid"),
        status: "error",
      });
    } else {
      const success = await handleCreateOrganization(email.trim());
      if (success) {
        toast({
          title: t("InviteMembersModal.toast.created", { email: email.trim() }),
          status: "success",
        });
        onClose();
        setEmail("");
      }
    }
  };

  const handleCreateOrganization = async (email: string) => {
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
      if (
        error.response &&
        error.response.status !== 404 &&
        error.response.status !== 409
      ) {
        setTimeout(() => {
          onClose();
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
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
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
