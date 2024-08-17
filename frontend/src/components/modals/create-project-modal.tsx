import { useToast } from "@/contexts/toast";
import { createProject } from "@/services/project";
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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface CreateProjectModalProps {
  isPersonal: boolean;
  organizationId?: number;
  size?: string;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isPersonal,
  organizationId,
  size = "lg",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();
  const initialRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isNameNull, setIsNameNull] = useState(false);
  const [nameTooLong, setNameTooLong] = useState(false);
  const [descriptionTooLong, setDescriptionTooLong] = useState(false);

  const handleSave = async () => {
    const success = isPersonal
      ? await handleCreateProject(name.trim(), description)
      : await handleCreateProject(
          name.trim(),
          description,
          organizationId as number
        );
    if (success) {
      toast({
        title: t("Services.projects.createProject.created", {
          name: name.trim(),
        }),
        status: "success",
      });
      onClose();
      setDescription("");
      setName("");
    }
  };

  const handleCreateProject = async (
    name: string,
    description: string,
    organizationId?: number
  ) => {
    try {
      if (isPersonal) {
        await createProject(name, description);
      } else {
        await createProject(name, description, organizationId);
      }
      return true;
    } catch (error) {
      toast({
        title: t("Services.projects.createProject.error"),
        status: "error",
      });
      console.error("Failed to create project:", error);
      return false;
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        {t("MyProjectsPage.button.create")}
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
          <ModalHeader>{t("MyProjectsPage.button.create")}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={5}>
            <FormControl
              pb={5}
              isRequired
              isInvalid={isNameNull || nameTooLong}
            >
              <FormLabel>{t("CreateProjectModal.modal.name")}</FormLabel>
              <Input
                ref={initialRef}
                placeholder={t("CreateProjectModal.modal.name")}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onBlur={(e) => {
                  setIsNameNull(name.trim() === "");
                  setNameTooLong(name.trim().length > 20);
                }}
                onFocus={() => {
                  setIsNameNull(false);
                  setNameTooLong(false);
                }}
              />
              <FormErrorMessage>
                {isNameNull
                  ? t("CreateProjectModal.FormErrorMessage.nameRequired")
                  : nameTooLong
                  ? t("CreateProjectModal.FormErrorMessage.nameTooLong")
                  : ""}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={descriptionTooLong}>
              <FormLabel>{t("CreateProjectModal.modal.description")}</FormLabel>
              <Textarea
                placeholder={t("CreateProjectModal.modal.description")}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                onBlur={(e) => {
                  setDescriptionTooLong(description.length > 200);
                }}
                onFocus={() => {
                  setDescriptionTooLong(false);
                }}
              />

              <FormErrorMessage>
                {descriptionTooLong
                  ? t("CreateProjectModal.FormErrorMessage.descriptionTooLong")
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isDisabled={isNameNull || nameTooLong || descriptionTooLong}
            >
              {t("CreateProjectModal.modal.save")}
            </Button>
            <Button onClick={onClose}>
              {t("CreateProjectModal.modal.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateProjectModal;
