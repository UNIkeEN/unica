import { useEffect, useRef, useState } from "react";
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

interface DeleteDiscussionAlertDialogProps {
  isOpen: boolean;
  deleteObject: string;
  onClose: () => void;
  onOKCallback: () => void;
}

const DeleteDiscussionAlertDialog: React.FC<
  DeleteDiscussionAlertDialogProps
> = ({ isOpen, deleteObject, onClose, onOKCallback }) => {
  const cancelRef = useRef();
  const { t } = useTranslation();

  const [seconds, setSeconds] = useState(3);
  const [deleteDisabled, setDeleteDisabled] = useState(true);

  useEffect(() => {
    if (deleteObject === "topic") {
      if (seconds > 1) {
        const timer = setTimeout(() => {
          setSeconds(seconds - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setDeleteDisabled(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [seconds]);

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {t(`DeleteDiscussionAlertDialog.${deleteObject}.title`)}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody pb={5}>
            {t(`DeleteDiscussionAlertDialog.${deleteObject}.content`)}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t(`DeleteDiscussionAlertDialog.${deleteObject}.cancel`)}
            </Button>
            {deleteObject === "topic" && deleteDisabled ? (
              <Button
                colorScheme="red"
                onClick={onOKCallback}
                ml={3}
                isDisabled
              >
                {t(`DeleteDiscussionAlertDialog.${deleteObject}.deleteDisabled`, {
                  seconds: seconds,
                })}
              </Button>
            ) : (
              <Button colorScheme="red" onClick={onOKCallback} ml={3}>
                {t(`DeleteDiscussionAlertDialog.${deleteObject}.delete`)}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteDiscussionAlertDialog;
