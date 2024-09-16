import {
  Flex,
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

export default EditableText;
