import React, { useState, useRef, useContext } from "react";
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
import { LuPlus } from "react-icons/lu";
import TaskContext from "@/contexts/task";

interface CreateTaskModalProps {
  size?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  size = "lg",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const taskCtx = useContext(TaskContext);
  const initialRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTitleNull, setIsTitleNull] = useState(false);
  const [titleTooLong, setTitleTooLong] = useState(false);

  const handleSave = async () => {
    const res = taskCtx.handleCreateTask({title: title.trim(), description});
    if (res) {
      onClose();
      setTitle("");
      setDescription("");
    }
  };

  return (
    <>
      <Button leftIcon={<LuPlus />} onClick={onOpen} colorScheme="blue" size="sm">
        {t("ProjectPages.tasks.button.create")}
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
            {t("CreateTaskModal.modal.title")}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={5}>
            <FormControl pb={5} isRequired isInvalid={isTitleNull || titleTooLong}>
              <FormLabel>{t("CreateTaskModal.modal.taskTitle")}</FormLabel>
              <Input
                ref={initialRef}
                placeholder={t("CreateTaskModal.modal.taskTitle")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  setIsTitleNull(title.trim() === "");
                  setTitleTooLong(title.trim().length > 100);
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

            <FormControl>
              <FormLabel>{t("CreateTaskModal.modal.description")}</FormLabel>
              <Textarea
                placeholder={t("CreateTaskModal.modal.description")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isDisabled={isTitleNull || titleTooLong}
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
