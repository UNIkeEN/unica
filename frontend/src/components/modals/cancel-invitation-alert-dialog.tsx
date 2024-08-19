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
} from '@chakra-ui/react';
import { useToast } from "@/contexts/toast";
import { useTranslation } from "react-i18next";
import { cancelInvitation } from "@/services/organization";
import OrganizationContext from "@/contexts/organization";

interface CancelInvitationAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: number;
  displayUserName: string;
  username: string;
  onOKCallback?: () => void;
}

const CancelInvitationAlertDialog: React.FC<CancelInvitationAlertDialogProps> = ({
  isOpen,
  onClose,
  orgId,
  displayUserName,
  username,
  onOKCallback,
}) => {
  const cancelRef = useRef();
  const { t } = useTranslation();
  const toast = useToast();
  const orgCtx = useContext(OrganizationContext);

  const handleCancelInvitation = async () => {
    try {
      await cancelInvitation(orgId, username);
      toast({
        title: t("Services.organization.cancelInvitation.cancelSuccess"),
        status: "success",
      });
      onClose();
      onOKCallback();
    } catch (error) {
      console.error("Failed to remove member:", error);
      if (
        error.response &&
        (error.response.status === 404)
      ) {
        toast({
          title: t("Services.organization.cancelInvitation.error"),
          description: t(
            `Services.organization.cancelInvitation.error-${error.response.status}`
          ),
          status: "error",
        });
      }
      onClose();
      if (error.response && error.response.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
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
            {t("CancelInvitationDialog.dialog.title")}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody pb={5}>
            {t("CancelInvitationDialog.dialog.content", {
              displayUsername: displayUserName,
              username: username,
              orgName: orgCtx.basicInfo.display_name,
            })}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t("CancelInvitationDialog.dialog.cancel")}
            </Button>
            <Button colorScheme='red' onClick={handleCancelInvitation} ml={3}>
              {t("CancelInvitationDialog.dialog.remove")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default CancelInvitationAlertDialog;