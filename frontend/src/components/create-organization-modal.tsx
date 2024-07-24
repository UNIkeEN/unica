import UserContext from "@/contexts/user";
import { createOrganization } from "@/services/organization";
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
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const CreateOrganizationModal = ({ size = "lg" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();
  const userCtx = useContext(UserContext);
  const initialRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const isNameNull = name.trim() === "";

  const handleSave = async () => {
    if (name.trim() === "") {
      toast({
        title: t("CreateOrganizationModal.toast.error"),
        description: t("CreateOrganizationModal.toast.nameRequired"),
        status: "error",
      });
    } else {
      await handleCreateOrganization(name, description);
      toast({
        title: t("CreateOrganizationModal.toast.success"),
        description: t("CreateOrganizationModal.toast.created", { name }),
        status: "success",
      });
      onClose();
      setDescription("");
      setName("");
    }
  };

  const handleCreateOrganization = async (
    name: string,
    description: string
  ) => {
    try {
      await createOrganization(name, description);
      userCtx.updateOrganizations();
    } catch (error) {
      console.error("Failed to create organization:", error);
      if (error.response.status === 400) {
        toast({
          title: t("CreateOrganizationModal.toast.error"),
          description: t("CreateOrganizationModal.toast.nameInvalid"),
          status: "error",
        });
      }
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        {t("CreateOrganizationModal.button.create")}
      </Button>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("CreateOrganizationModal.modal.title")}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={5}>
            <FormControl pb={5} isInvalid={isNameNull} isRequired>
              <FormLabel>{t("CreateOrganizationModal.modal.name")}</FormLabel>
              <Input
                placeholder={t("CreateOrganizationModal.modal.name")}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                ref={initialRef}
              />
              {isNameNull && (
                <FormErrorMessage>
                  {t("CreateOrganizationModal.toast.nameRequired")}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>
                {t("CreateOrganizationModal.modal.description")}
              </FormLabel>
              <Textarea
                placeholder={t("CreateOrganizationModal.modal.description")}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              {t("CreateOrganizationModal.modal.save")}
            </Button>
            <Button onClick={onClose}>
              {t("CreateOrganizationModal.modal.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateOrganizationModal;
