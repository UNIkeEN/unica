import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiX } from "react-icons/fi";

interface EditableProps extends BoxProps {
  isTextArea: boolean;
  value: string;
  onEditSubmit: (value: string) => void;
  title?: string;
  placeholder?: string;
  isRequired?: boolean;
  maxLength?: number;
}

const Editable: React.FC<EditableProps> = ({
  isTextArea,
  value,
  onEditSubmit,
  title,
  placeholder = "",
  isRequired = false,
  maxLength = 200,
  ...boxProps
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isContentNull, setIsContentNull] = useState(false);
  const [isContentTooLong, setIsContentTooLong] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const { t } = useTranslation();

  const EditButtons = () => {
    return isEditing ? (
      <HStack ml="auto">
        <IconButton
          icon={<FiCheck />}
          size="sm"
          aria-label="submit"
          onClick={() => {
            if ((isRequired && isContentNull) || isContentTooLong) return;
            onEditSubmit(tempValue);
            setIsEditing(false);
          }}
        />
        <IconButton
          icon={<FiX />}
          size="sm"
          aria-label="cancel"
          onClick={() => {
            setTempValue(value);
            setIsEditing(false);
            setIsContentNull(false);
            setIsContentTooLong(false);
          }}
        />
      </HStack>
    ) : (
      <IconButton
        icon={<EditIcon />}
        size="sm"
        aria-label="edit"
        onClick={() => {
          setIsEditing(true);
        }}
        ml="auto"
        mb={isTextArea ? "auto" : 0}
      />
    );
  };

  return (
    <Box {...boxProps}>
      <FormControl
        pb={5}
        isInvalid={isContentTooLong || (isRequired && isContentNull)}
      >
        {title && <FormLabel>{title}</FormLabel>}
        {isTextArea ? (
          <VStack>
            <Textarea
              value={tempValue}
              placeholder={placeholder}
              isReadOnly={!isEditing}
              variant={isEditing ? "outline" : "unstyled"}
              onChange={(e) => {
                setTempValue(e.target.value);
              }}
              onBlur={() => {
                setIsContentNull(tempValue.trim() === "");
                setIsContentTooLong(tempValue.trim().length > maxLength);
              }}
              onFocus={() => {
                setIsContentNull(false);
                setIsContentTooLong(false);
              }}
            />
            {EditButtons()}
          </VStack>
        ) : (
          <HStack>
            <Input
              value={tempValue}
              placeholder={placeholder}
              isReadOnly={!isEditing}
              variant={isEditing ? "outline" : "unstyled"}
              onChange={(e) => {
                setTempValue(e.target.value);
              }}
              onBlur={() => {
                setIsContentNull(tempValue.trim() === "");
                setIsContentTooLong(tempValue.trim().length > maxLength);
              }}
              onFocus={() => {
                setIsContentNull(false);
                setIsContentTooLong(false);
              }}
            />
            {EditButtons()}
          </HStack>
        )}
        <FormErrorMessage>
          {isContentNull
            ? t("Editable.contentRequired")
            : isRequired && isContentTooLong
            ? t("Editable.contentTooLong")
            : ""}
        </FormErrorMessage>
      </FormControl>
    </Box>
  );
};

export default Editable;
