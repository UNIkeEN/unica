import { useContext } from "react";
import { useToast } from "@/contexts/toast";
import { BeatLoader } from 'react-spinners';
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
import OrganizationContext from "@/contexts/organization";

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
  const orgCtx = useContext(OrganizationContext);
  const initialRef = useRef(null);

  const [username, setUsername] = useState("");
  const [usernameNull, setUsernameNull] = useState(false);
  const [usernameTooLong, setUsernameTooLong] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const success = await handleCreateInvitation(username.trim());
    if (success) {
      toast({
        title: t("Services.organization.createInvitation.created", { username: username.trim() }),
        status: "success",
      });
      onClose();
      onOKCallback();
      setUsername("");
      setIsLoading(false);
    }
  };

  const handleCreateInvitation = async (username: string) => {
    try {
      await createInvitation(id, username);
      return true;
    } catch (error) {
      console.error("Failed to create invitation:", error);
      setIsLoading(false);
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 409)
      ) {
        toast({
          title: t("Services.organization.createInvitation.error"),
          description: t(
            `Services.organization.createInvitation.error-${error.response.status}`
          ),
          status: "error",
        });
      }
      if (error.response && error.response.status === 403) {
        onClose();
        orgCtx.toastNoPermissionAndRedirect();
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
            <FormControl pb={5} isInvalid={usernameNull || usernameTooLong} isRequired>
              <FormLabel>{t("InviteMembersModal.modal.username")}</FormLabel>
              <Input
                placeholder={t("InviteMembersModal.modal.username")}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                onBlur={() => {
                  setUsernameNull(username.trim() === "");
                  setUsernameTooLong(username.trim().length > 150);
                }}
                onFocus={() => {
                  setUsernameNull(false);
                  setUsernameTooLong(false);
                }}
                ref={initialRef}
              />
              <FormErrorMessage>
                {usernameNull && t("InviteMembersModal.FormErrorMessage.usernameNull")}
                {usernameTooLong && t("InviteMembersModal.FormErrorMessage.usernameTooLong")}
              </FormErrorMessage>
              <FormHelperText
                wordBreak='break-all'
                overflowWrap='break-word'
                lineHeight={1.5}
              >
                {t("InviteMembersModal.modal.usernameHelper-1", {
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
                {t("InviteMembersModal.modal.usernameHelper-2")}
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isDisabled={usernameNull || usernameTooLong}
              isLoading={isLoading}
              spinner={<BeatLoader size={8} color='white' />}
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
