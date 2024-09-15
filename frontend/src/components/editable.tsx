import {
  Flex,
  VStack,
  IconButton,
  ButtonGroup,
  Input,
  Textarea,
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
  Box,
  BoxProps
} from '@chakra-ui/react';
import React from 'react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import SettingsOption from "@/components/settings-option";

interface EditableTextProps extends BoxProps {
  value: string;
  isTextarea?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ value, isTextarea = false, ...boxProps }) => {
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup size="sm">
        <IconButton aria-label="提交" icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton aria-label="取消" icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <IconButton aria-label="编辑" size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
    );
  }

  return (
    <Editable defaultValue={String(value)} isPreviewFocusable={false} {...boxProps}>
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Box flex="1">
          <EditablePreview />
          {isTextarea ? <Textarea as={EditableInput} size="sm" /> : <Input as={EditableInput} size="sm" />}
        </Box>
        <EditableControls />
      </Flex>
    </Editable>
  );
};

interface PersonalInfoSettingsProps extends BoxProps {
  userName: string;
  userBio: string;
}

const PersonalInfoSettings: React.FC<PersonalInfoSettingsProps> = ({ userName, userBio, ...boxProps }) => {
  return (
    <VStack spacing={4} {...boxProps}>
      <Box
        width="100%"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        p={4}
      >
        <SettingsOption title="userName" description="Edit your name">
          <EditableText value={userName} />
        </SettingsOption>
      </Box>
      <Box
        width="100%"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        p={4}
      >
        <SettingsOption title="Profile Settings" description="Enter your profile">
          <EditableText value={userBio} isTextarea />
        </SettingsOption>
      </Box>
    </VStack>
  );
};

export default PersonalInfoSettings;
