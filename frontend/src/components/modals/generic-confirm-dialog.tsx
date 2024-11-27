import { useRef } from "react";
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
import { FocusableElement } from "@chakra-ui/utils";

interface GenericConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: string;
  btnOK: string;
  btnCancel: string;
  onOKCallback?: () => void;
  isAlert?: boolean; 
}

const GenericConfirmDialog: React.FC<GenericConfirmDialogProps> = ({
  isOpen,
  onClose,
  title,
  body,
  btnOK,
  btnCancel,
  onOKCallback,
  isAlert = true,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {title}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody pb={5}>
            {body}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {btnCancel}
            </Button>
            <Button 
                colorScheme={isAlert ? "red" : "blue"} 
                onClick={onOKCallback} 
                ml={3} 
            >
              {btnOK}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default GenericConfirmDialog;
