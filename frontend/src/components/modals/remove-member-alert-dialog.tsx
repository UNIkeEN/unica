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
  MenuItem
} from '@chakra-ui/react';
import { useToast } from "@/contexts/toast";
import { useTranslation } from "react-i18next";
import { removeMember } from "@/services/organization";
import OrganizationContext from "@/contexts/organization";

interface RemoveMemberAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: number;
  displayUserName: string;
  email: string;
  onOKCallback?: () => void;
}

const RemoveMemberAlertDialog: React.FC<RemoveMemberAlertDialogProps> = ({
  isOpen,
  onClose,
  orgId,
  displayUserName,
  email,
  onOKCallback,
}) => {
  const cancelRef = useRef();
  const { t } = useTranslation();
  const toast = useToast();
  const orgCtx = useContext(OrganizationContext);

  const handleRemoveMember = async () => {
    try {
      await removeMember(orgId, email);
      toast({
        title: t("RemoveUserAlertDialog.toast.removed"),
        status: "success",
      });
      onClose();
      onOKCallback();
    } catch (error) {
      console.error("Failed to remove member:", error);
      if (
        error.response &&
        (error.response.status === 400 ||
          error.response.status === 403 ||
          error.response.status === 404)
      ) {
        toast({
          title: t("RemoveUserAlertDialog.toast.error"),
          description: t(
            `RemoveUserAlertDialog.toast.error-${error.response.status}`
          ),
          status: "error",
        });
      }
      onClose();
      if (error.response && error.response.status === 403) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }};

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
            {t("RemoveUserAlertDialog.dialog.title")}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody pb={5}>
            {t("RemoveUserAlertDialog.dialog.content", {
              displayUsername: displayUserName,
              email: email,
              orgName: orgCtx.basicInfo.display_name,
            })}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t("RemoveUserAlertDialog.dialog.cancel")}
            </Button>
            <Button colorScheme='red' onClick={handleRemoveMember} ml={3}>
              {t("RemoveUserAlertDialog.dialog.remove")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default RemoveMemberAlertDialog;