import { useRef, useContext } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import OrganizationContext from "@/contexts/organization";

interface GenericAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pageName: string;
  objectName: string;
  objectDisplayName?: string;
  onOKCallback?: () => void;
}

const GenericAlertDialog: React.FC<GenericAlertDialogProps> = ({
  isOpen,
  onClose,
  pageName,
  objectName,
  objectDisplayName,
  onOKCallback,
}) => {
  const cancelRef = useRef();
  const { t } = useTranslation();
  const orgCtx = useContext(OrganizationContext);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {t(`${pageName}.dialog.title`)}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody pb={5}>
            {t(`${pageName}.dialog.content`, {
              objectDisplayName: objectDisplayName,
              objectName: objectName,
              orgName: orgCtx.basicInfo.display_name,
            })}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t(`${pageName}.dialog.cancel`)}
            </Button>
            <Button colorScheme="red" onClick={onOKCallback} ml={3}>
              {t(`${pageName}.dialog.confirm`)}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default GenericAlertDialog;
