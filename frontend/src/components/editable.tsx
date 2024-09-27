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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiX } from "react-icons/fi";

interface EditableProps extends BoxProps {
  isTextArea: boolean;
  value: string;
  onEditSubmit: (value: string) => void;
  title?: string;
  localeKey?: string;
  placeholder?: string;
  checkError?: (value: string) => number;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Editable: React.FC<EditableProps> = ({
  isTextArea,
  value,
  onEditSubmit,
  title,
  localeKey,
  placeholder = "",
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
        icon={<EditIcon />}
        size="sm"
        aria-label="edit"
        onClick={() => {
          setIsEditing(true);
          ref.current.focus();
        }}
        ml="auto"
      />
    );
  };

  return (
    <Box {...boxProps}>
      <FormControl pb={5} isInvalid={isInvalid && isEditing}>
        {title && <FormLabel>{title}</FormLabel>}
        {isTextArea ? (
          <>
            <Textarea
              ref={ref}
              value={tempValue}
              placeholder={placeholder}
              isReadOnly={!isEditing}
              variant={isEditing ? "outline" : "unstyled"}
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
              <Box mt="2" ml="auto">{EditButtons()}</Box>
            </HStack>
          </>
        ) : (
          <>
            <HStack>
              <Input
                ref={ref}
                value={tempValue}
                placeholder={placeholder}
                isReadOnly={!isEditing}
                variant={isEditing ? "outline" : "unstyled"}
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
          </>
        )}
      </FormControl>
    </Box>
  );
};

export default Editable;
