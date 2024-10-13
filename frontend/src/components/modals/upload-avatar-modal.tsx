import { useContext, useState } from "react";
import { UserAvatar } from "@/components/user-info-popover";
import UserContext from "@/contexts/user";
import { FiEdit } from "react-icons/fi";
import {
  Box,
  Container,
  HStack,
  IconButton,
  Button,
  Image,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useToast } from "@/contexts/toast";
import { uploadUserAvatar } from "@/services/user";
import OrganizationContext from "@/contexts/organization";
import { useTranslation } from "react-i18next";

const AvatarUploader = () => {
  const userCtx = useContext(UserContext);
  const orgCtx = useContext(OrganizationContext);
  const toast = useToast();
  const { t } = useTranslation();

  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [avatarTooLarge, setAvatarTooLarge] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const clearState = () => {
    onClose();
    setUploadingAvatar(false);
    setPreview(null);
    setSelectedFile(null);
    setAvatarTooLarge(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarTooLarge(file.size > 5 * 1024 * 1024);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadUserAvatar = async () => {
    if (!selectedFile) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      await uploadUserAvatar(formData);
      toast({
        title: t("Services.user.uploadUserAvatar.success"),
        status: "success",
      });
      userCtx.updateProfile();
      clearState();
    } catch (error) {
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.user.uploadUserAvatar.error"),
          status: "error",
        });
      }
      clearState();
    }
  };

  return (
    <Box>
      <HStack>
        {userCtx.profile && <UserAvatar size="md" user={userCtx.profile} />}
        <IconButton
          icon={<FiEdit />}
          size="sm"
          aria-label="edit"
          onClick={onOpen}
          ml="2"
        />
      </HStack>
      <Modal isOpen={isOpen} onClose={clearState} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t("SettingsPages.profile.settings.avatar.modal.title")}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl isInvalid={avatarTooLarge}>
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
              />
              {preview && (
                <Image src={preview} alt="preview" boxSize="100px" mt="3" mx="auto" />
              )}
              <FormErrorMessage>
                {avatarTooLarge
                  ? t("SettingsPages.profile.settings.avatar.modal.tooLarge")
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleUploadUserAvatar}
              isLoading={uploadingAvatar}
              isDisabled={!selectedFile || avatarTooLarge}
            >
              {t("SettingsPages.profile.settings.avatar.modal.upload")}
            </Button>
            <Button onClick={clearState}>
              {t("SettingsPages.profile.settings.avatar.modal.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AvatarUploader;
