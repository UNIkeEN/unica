import { useRef, useState, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  RadioGroup,
  Radio,
  Stack,
  Tag,
  Text
} from "@chakra-ui/react";
import { useToast } from "@/contexts/toast";
import OrganizationContext from "@/contexts/organization";
import { useTranslation } from "react-i18next";
import { modifyMemberRole } from "@/services/organization";
import { MemberRoleEnum } from "@/models/organization";

interface ChangeMemberRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: number;
  displayUserName: string;
  username: string;
  onOKCallback?: () => void;
}

const ChangeMemberRoleModal: React.FC<ChangeMemberRoleModalProps> = ({
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
  const [newRole, setNewRole] = useState(null);

  const handleModifyMemberRole = async () => {
    try {
      await modifyMemberRole(orgId, username, newRole);
      toast({
        title: t("Services.organization.modifyMemberRole.changed"),
        status: "success",
      });
      onClose();
      onOKCallback();
    } catch (error) {
      console.error("Failed to change user role:", error);
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 404)
      ) {
        toast({
          title: t("Services.organization.modifyMemberRole.error"),
          description: t(
            `Services.organization.modifyMemberRole.error-${error.response.status}`
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t("ChangeMemberRoleModal.modal.title", { displayUserName: displayUserName, username:username })}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={5}>
          <RadioGroup onChange={setNewRole} value={newRole}>
            <Stack spacing={4}>
              <Radio value={MemberRoleEnum.OWNER}>
                <Tag fontWeight="normal" colorScheme="green">{t("Enums.organization.role.Owner")}</Tag>
                <Text fontSize="sm" mt={0.5}>{t("ChangeMemberRoleModal.modal.owner_description")}</Text>
              </Radio>
              <Radio value={MemberRoleEnum.MEMBER}>
                <Tag fontWeight="normal" colorScheme="cyan">{t("Enums.organization.role.Member")}</Tag>
                <Text fontSize="sm" mt={0.5}>{t("ChangeMemberRoleModal.modal.member_description")}</Text>
              </Radio>
            </Stack>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Button ref={cancelRef} onClick={onClose}>
            {t("ChangeMemberRoleModal.modal.cancel")}
          </Button>
          <Button colorScheme="blue" onClick={handleModifyMemberRole} ml={3} isDisabled={newRole === null}>
            {t("ChangeMemberRoleModal.modal.change_role")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeMemberRoleModal;
