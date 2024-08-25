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
import { useToast } from "@/contexts/toast";
import { useTranslation } from "react-i18next";
import { leaveOrganization } from "@/services/organization";
import OrganizationContext from "@/contexts/organization";

interface LeaveOrganizationAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: number;
  orgName: string;
  onOKCallback?: () => void;
}

const LeaveOrganizationAlertDialog: React.FC<
  LeaveOrganizationAlertDialogProps
> = ({ isOpen, onClose, orgId, orgName, onOKCallback }) => {
  const cancelRef = useRef();
  const { t } = useTranslation();
  const toast = useToast();
  const orgCtx = useContext(OrganizationContext);

  const handleLeaveOrganization = async () => {
    try {
      await leaveOrganization(orgId);
      toast({
        title: t("Services.organization.leaveOrganization.left"),
        status: "success",
      });
      onClose();
      onOKCallback();
    } catch (error) {
      console.error("Failed to leave organization:", error);
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 400)
      ) {
        toast({
          title: t("Services.organization.leaveOrganization.error"),
          description: t(
            `Services.organization.leaveOrganization.error-${error.response.status}`
          ),
          status: "error",
        });
      }
      onClose();
      if (error.response && error.response.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      }
    }
  };

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
            {t("LeaveOrganizationAlertDialog.dialog.title")}
          </AlertDialogHeader>
          <AlertDialogCloseButton />

          <AlertDialogBody pb={5}>
            {t("LeaveOrganizationAlertDialog.dialog.confirm", { orgName })}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t("LeaveOrganizationAlertDialog.dialog.cancel")}
            </Button>
            <Button colorScheme="red" onClick={handleLeaveOrganization} ml={3}>
              {t("LeaveOrganizationAlertDialog.dialog.leave")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default LeaveOrganizationAlertDialog;
