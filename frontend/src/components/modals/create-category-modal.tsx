import React, { use, useEffect, useRef, useState } from "react";
import { BeatLoader } from 'react-spinners';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Tag,
  Input,
  Text,
  Textarea,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ChakraColorSelector from "@/components/color-selector";
import { DiscussionTopicCategory as Category } from "@/models/discussion";
import { isOnlyEmoji } from "@/utils/string";

interface CreateCategoryModalProps extends ModalProps {
  category: Category;
  isUpdate: boolean;
  setCategory: (c: Category) => void;
  onOKCallback?: () => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  category,
  isUpdate,
  setCategory,
  onOKCallback,
  ...modalProps
}) => {
  const { t } = useTranslation();
  const initialRef = useRef(null);
  const localeKey = isUpdate ? "UpdateCategoryModal" : "CreateCategoryModal";

  //Form Check
  const [isNameNull, setIsNameNull] = useState(false);
  const [nameTooLong, setNameTooLong] = useState(false);
  const [descriptionTooLong, setDescriptionTooLong] = useState(false);
  const [isEmojiInValid, setIsEmojiInValid] = useState(false);

  return (
    <>
      <Modal
        size = "lg"
        initialFocusRef={initialRef}
        isCentered
        {...modalProps}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(`${localeKey}.modal.title`)}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={5}>
            <FormControl pb={5}>
              <FormLabel>{t(`${localeKey}.modal.preview`)}</FormLabel>
              <Flex alignItems="center" justify="center" overflow="hidden">
                <Tag size="lg" p={2.5} colorScheme={category?.color || "gray"}>
                  {category?.emoji.slice(0,2) || "💬"}
                </Tag>
                <Text fontWeight="semibold" wordBreak="break-all" ml={2}>
                  {category?.name}
                </Text>
              </Flex>
            </FormControl>
            <FormControl 
              isInvalid={isNameNull || nameTooLong} 
              pb={5} 
              isRequired
            >
              <FormLabel>{t(`${localeKey}.modal.name`)}</FormLabel>
              <Input
                ref={initialRef}
                placeholder={t(`${localeKey}.modal.name`)}
                value={category?.name}
                onChange={(e) => {
                  setCategory({...category, name: e.target.value})
                }}
                onBlur={(e) => {
                  setIsNameNull(category.name.trim() === "");
                  setNameTooLong(category.name.trim().length > 20);
                }}
                onFocus={() => {
                  setIsNameNull(false);
                  setNameTooLong(false);
                }}
              />
              <FormErrorMessage>
                {isNameNull
                  ? t(`${localeKey}.FormErrorMessage.nameRequired`)
                  : nameTooLong
                  ? t(`${localeKey}.FormErrorMessage.nameTooLong`)
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <FormControl pb={5} isInvalid={isEmojiInValid}>
              <FormLabel>{t(`${localeKey}.modal.emoji`)}</FormLabel>
              <Input
                placeholder={t(`${localeKey}.modal.emoji`)}
                value={category?.emoji}
                onChange={(e) => {
                  setCategory({...category, emoji: e.target.value})
                }}
                onBlur={(e) => {
                  setIsEmojiInValid(category.emoji!=="" && (!isOnlyEmoji(category.emoji) || category.emoji.length > 2));
                }}
                onFocus={() => {
                  setIsEmojiInValid(false);
                }}
              />
              <FormErrorMessage>
                {isEmojiInValid
                  ? t(`${localeKey}.FormErrorMessage.emojiInvalid`)
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <FormControl pb={5} isRequired>
              <FormLabel>{t(`${localeKey}.modal.color`)}</FormLabel>
              <ChakraColorSelector 
                current={category?.color || "gray"}
                onColorSelect={(color) => {
                  setCategory({...category, color: color})
                }}
              />
            </FormControl>
            <FormControl isInvalid={descriptionTooLong}>
            <FormLabel>{t(`${localeKey}.modal.description`)}</FormLabel>
              <Textarea
                placeholder={t(`${localeKey}.modal.description`)}
                value={category?.description}
                resize="none"
                onChange={(e) => {
                  setCategory({...category, description: e.target.value})
                }}
                onBlur={(e) => {
                  setDescriptionTooLong(category.description.length > 200);
                }}
                onFocus={() => {
                  setDescriptionTooLong(false);
                }}
              />
              <FormErrorMessage>
                {descriptionTooLong
                  ? t(`${localeKey}.FormErrorMessage.descriptionTooLong`)
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={onOKCallback}
              colorScheme="blue"
              mr={3}
              spinner={<BeatLoader size={8} color='white' />}
              isDisabled={isNameNull || nameTooLong || descriptionTooLong || isEmojiInValid}
            >
              {t(`${localeKey}.modal.save`)}
            </Button>
            <Button onClick={modalProps.onClose}>
              {t(`${localeKey}.modal.cancel`)}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCategoryModal;
