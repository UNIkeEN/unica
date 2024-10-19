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
import { useRouter } from "next/router";

interface CreateProjectModalProps {
  isPersonal?: boolean;
  organizationId?: number;
  size?: string;
  // onOKCallback?: () => void;
}

// `onOKCallback` used to refresh project list, but we use `router.push` to get into the new project board directly, no need to refresh project list

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isPersonal = false,
  organizationId,
  size = "lg",
  // onOKCallback = () => {},
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const initialRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isNameNull, setIsNameNull] = useState(false);
  const [nameTooLong, setNameTooLong] = useState(false);
  const [descriptionTooLong, setDescriptionTooLong] = useState(false);

  const handleSave = async () => {
    const res = isPersonal
      ? await handleCreateProject(name.trim(), description)
      : await handleCreateProject(
          name.trim(),
          description,
          organizationId as number
        );
    if (res) {
      toast({
        title: t("Services.projects.createProject.created", {
          name: name.trim(),
        }),
        status: "success",
      });
      // onOKCallback();
      setDescription("");
      setName("");
      onClose();
      router.push("/projects/" + res.id + "/tasks");
    }
  };

  const handleCreateProject = async (
    name: string,
    description: string,
    organizationId?: number
  ) => {
    try {
      if (isPersonal) {
        return await createProject(name, description);
      } else {
        return await createProject(name, description, organizationId);
      }
    } catch (error) {
      toast({
        title: t("Services.projects.createProject.error"),
        status: "error",
      });
      return null;
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
          <ModalHeader>{t("CreateProjectModal.modal.title")}</ModalHeader>
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
