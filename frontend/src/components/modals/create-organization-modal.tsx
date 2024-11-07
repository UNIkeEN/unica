import { createOrganization } from "@/services/organization";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useToast } from "@/contexts/toast";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const CreateOrganizationModal = ({ size = "lg" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();
  const initialRef = useRef(null);
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isNameNull, setIsNameNull] = useState(false);
  const [nameTooLong, setNameTooLong] = useState(false);
  const [descriptionTooLong, setDescriptionTooLong] = useState(false);

  const handleSave = async () => {
    const res = await handleCreateOrganization(name.trim(), description);
    if (res) {
      toast({
        title: t("Services.organization.createOrganization.created", {
          name: name.trim(),
        }),
        status: "success",
      });
      onClose();
      setDescription("");
      setName("");
      setTimeout(() => {
        window.location.assign(`/organizations/${res.id}/overview`);
      }, 1500);
    }
  };

  const handleCreateOrganization = async (
    name: string,
    description: string
  ) => {
    try {
      return await createOrganization(name, description);
    } catch (error) {
      console.error("Failed to create organization:", error);
      if (error.response.status === 400) {
        toast({
          title: t("Services.organization.createOrganization.error"),
          description: t("Services.organization.createOrganization.invalidInput"),
          status: "error",
        });
      }
      return null;
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        {t("MyOrganizationsPage.button.create")}
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
          <ModalHeader>{t("CreateOrganizationModal.modal.title")}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={5}>
            <FormControl
              pb={5}
              isInvalid={isNameNull || nameTooLong}
              isRequired
            >
              <FormLabel>{t("CreateOrganizationModal.modal.name")}</FormLabel>
              <Input
                placeholder={t("CreateOrganizationModal.modal.name")}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onBlur={() => {
                  setIsNameNull(name.trim() === "");
                  setNameTooLong(name.trim().length > 20);
                }}
                onFocus={() => {
                  setIsNameNull(false);
                  setNameTooLong(false);
                }}
                ref={initialRef}
              />
              {isNameNull && (
                <FormErrorMessage>
                  {t("CreateOrganizationModal.FormErrorMessage.nameRequired")}
                </FormErrorMessage>
              )}
              {nameTooLong && (
                <FormErrorMessage>
                  {t("CreateOrganizationModal.FormErrorMessage.nameTooLong")}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={descriptionTooLong}>
              <FormLabel>
                {t("CreateOrganizationModal.modal.description")}
              </FormLabel>
              <Textarea
                placeholder={t("CreateOrganizationModal.modal.description")}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                onBlur={() => {
                  setDescriptionTooLong(description.length > 200);
                }}
                onFocus={() => {
                  setDescriptionTooLong(false);
                }}
              />
              {descriptionTooLong && (
                <FormErrorMessage>
                  {t("CreateOrganizationModal.FormErrorMessage.descriptionTooLong")}
                </FormErrorMessage>
              )}
              <FormHelperText></FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isDisabled={isNameNull || nameTooLong || descriptionTooLong}
            >
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