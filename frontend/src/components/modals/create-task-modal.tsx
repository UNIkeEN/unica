import { useToast } from "@/contexts/toast";
import React, { useState, useRef, useContext } from "react";
import { createTask } from "@/services/task";
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
  useDisclosure
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import TaskContext from "@/contexts/task";
import { EditableTask } from "@/models/task";

interface CreateTaskModalProps {
  proj_id: number;
  size?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  proj_id,
  size = "lg",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const { handleCreateTask } = useContext(TaskContext);
  const initialRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTitleNull, setIsTitleNull] = useState(false);
  const [titleTooLong, setTitleTooLong] = useState(false);
  const [descriptionTooLong, setDescriptionTooLong] = useState(false);

  const handleSave = async () => {
    const task: Partial<EditableTask> = {
      title: title.trim(),
      description,
    };

    await handleCreateTask(task);

    toast({
      title: t("Services.task.createTask.created", { title: task.title }),
      status: "success",
    });

    setTitle("");
    setDescription("");
    onClose();
    router.push(`/projects/${proj_id}/tasks`);
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        {t("MyTasksPage.button.create")}
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
          <ModalHeader>
            {t("MyTasksPage.button.create")}
            </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={5}>
            <FormControl pb={5} isRequired isInvalid={isTitleNull || titleTooLong}>
              <FormLabel>{t("CreateTaskModal.modal.title")}</FormLabel>
              <Input
                ref={initialRef}
                placeholder={t("CreateTaskModal.modal.title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  setIsTitleNull(title.trim() === "");
                  setTitleTooLong(title.trim().length > 20);
                }}
                onFocus={() => {
                  setIsTitleNull(false);
                  setTitleTooLong(false);
                }}
              />
              <FormErrorMessage>
                {isTitleNull
                  ? t("CreateTaskModal.FormErrorMessage.titleRequired")
                  : titleTooLong
                    ? t("CreateTaskModal.FormErrorMessage.titleTooLong")
                    : ""}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={descriptionTooLong}>
              <FormLabel>{t("CreateTaskModal.modal.description")}</FormLabel>
              <Textarea
                placeholder={t("CreateTaskModal.modal.description")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setDescriptionTooLong(description.length > 200)}
                onFocus={() => setDescriptionTooLong(false)}
              />
              <FormErrorMessage>
                {descriptionTooLong
                  ? t("CreateTaskModal.FormErrorMessage.descriptionTooLong")
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isDisabled={isTitleNull || titleTooLong || descriptionTooLong}
            >
              {t("CreateTaskModal.modal.save")}
            </Button>
            <Button
              onClick={onClose}
            >{t("CreateTaskModal.modal.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
