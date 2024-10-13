import {
  Box,
  BoxProps,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Input,
  Textarea,
  Text,
  Container,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiX, FiEdit } from "react-icons/fi";

interface EditableProps extends BoxProps {
  isTextArea: boolean;
  value: string;
  onEditSubmit: (value: string) => void;
  localeKey?: string;
  placeholder?: string;
  textareaWidth?: string;
  checkError?: (value: string) => number;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Editable: React.FC<EditableProps> = ({
  isTextArea,
  value,
  onEditSubmit,
  localeKey,
  placeholder = "",
  textareaWidth = "sm",
  checkError = () => 0,
  onFocus = () => {},
  onBlur = () => {},
  ...boxProps
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);
  const [tempValue, setTempValue] = useState(value);

  const ref = useRef(null);
  const { t } = useTranslation();

  const EditButtons = () => {
    return isEditing ? (
      <HStack ml="auto">
        <IconButton
          icon={<FiCheck />}
          size="sm"
          aria-label="submit"
          onClick={() => {
            if (isInvalid) return;
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
            setIsInvalid(false);
          }}
        />
      </HStack>
    ) : (
      <IconButton
        icon={<FiEdit />}
        size="sm"
        aria-label="edit"
          onClick={() => {
          setTempValue(value);
          setIsEditing(true);
        }}
        ml="2"
      />
    );
  };

  useEffect(() => {
    if (isEditing) {
      ref.current.focus();
    }
  }, [isEditing]);

  return (
    <Box {...boxProps}>
      {isEditing ? (
        isTextArea ? (
          <FormControl pb={5} isInvalid={isInvalid && isEditing}>
            <Textarea
              ref={ref}
              value={tempValue}
              placeholder={placeholder}
              onChange={(e) => {
                setTempValue(e.target.value);
              }}
              onBlur={() => {
                setIsInvalid(checkError(tempValue) !== 0);
                onBlur();
              }}
              onFocus={() => {
                setIsInvalid(false);
                onFocus();
              }}
            />
            <HStack>
              <FormErrorMessage>
                {localeKey &&
                  (isInvalid && isEditing
                    ? t(`${localeKey}.error-${checkError(tempValue)}`)
                    : "")}
              </FormErrorMessage>
              <Box mt="2" ml="auto">
                {EditButtons()}
              </Box>
            </HStack>
          </FormControl>
        ) : (
          <FormControl isInvalid={isInvalid && isEditing}>
            <HStack>
              <Input
                ref={ref}
                value={tempValue}
                placeholder={placeholder}
                onChange={(e) => {
                  setTempValue(e.target.value);
                }}
                onBlur={() => {
                  setIsInvalid(checkError(tempValue) !== 0);
                  onBlur();
                }}
                onFocus={() => {
                  setIsInvalid(false);
                  onFocus();
                }}
              />
              {EditButtons()}
            </HStack>
            <FormErrorMessage>
              {localeKey &&
                (isInvalid && isEditing
                  ? t(`${localeKey}.error-${checkError(tempValue)}`)
                  : "")}
            </FormErrorMessage>
          </FormControl>
        )
      ) : isTextArea ? (
        <VStack maxW={textareaWidth} whiteSpace="pre-wrap">
          {value}
          {EditButtons()}
        </VStack>
      ) : (
        <HStack spacing={0}>
          <Text>{value}</Text>
          {EditButtons()}
        </HStack>
      )}
    </Box>
  );
};

export default Editable;
