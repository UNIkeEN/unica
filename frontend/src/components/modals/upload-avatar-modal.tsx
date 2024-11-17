import { useCallback, useContext, useState } from "react";
import { UserAvatar } from "@/components/user-info-popover";
import UserContext from "@/contexts/user";
import { FiEdit } from "react-icons/fi";
import {
  Box,
  HStack,
  IconButton,
  Button,
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { useToast } from "@/contexts/toast";
import { uploadUserAvatar } from "@/services/user";
import OrganizationContext from "@/contexts/organization";
import { useTranslation } from "react-i18next";
import Cropper, { Area } from "react-easy-crop";

const AvatarUploader = () => {
  const userCtx = useContext(UserContext);
  const orgCtx = useContext(OrganizationContext);
  const toast = useToast();
  const { t } = useTranslation();

  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [avatarTooLarge, setAvatarTooLarge] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const clearState = () => {
    onClose();
    setUploadingAvatar(false);
    setPreview(null);
    setSelectedFile(null);
    setAvatarTooLarge(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
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

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const getCroppedImg = (
    imageSrc: string,
    croppedAreaPixels: Area
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context is null"));
          return;
        }

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }

          const file = new File([blob], `croppedImage.png`, {
            type: "image/png",
          });
          resolve(file);
        }, "image/png");
      };
      image.onerror = reject;
    });
  };

  const handleUploadUserAvatar = async () => {
    if (!selectedFile || !croppedAreaPixels) return;
    setUploadingAvatar(true);
    try {
      const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
      if (croppedImage.size > 5 * 1024 * 1024)
        throw new Error("File too large");
      const formData = new FormData();
      formData.append("file", croppedImage);
      await uploadUserAvatar(formData);
      toast({
        title: t("Services.user.uploadUserAvatar.success"),
        status: "success",
      });
      userCtx.updateProfile();
      clearState();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      if (error.message === "File too large") {
        toast({
          title: t("Services.user.uploadUserAvatar.tooLarge"),
          status: "error",
        });
      }
      else if (error.request && error.request.status === 403) {
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
        {userCtx.profile && <UserAvatar size="lg" user={userCtx.profile} withPopover={false}/>}
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
            {t("SettingsPages.profile.publicProfile.settings.avatar.modal.title")}
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
                <>
                  <Box position="relative" width="100%" height="300px" mt={5}>
                    <Cropper
                      image={preview}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </Box>
                  <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.05}
                    onChange={(value) => setZoom(value)}
                    mt={4}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </>
              )}
              <FormErrorMessage>
                {avatarTooLarge
                  ? t("SettingsPages.profile.publicProfile.settings.avatar.modal.tooLarge")
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
              {t("SettingsPages.profile.publicProfile.settings.avatar.modal.upload")}
            </Button>
            <Button onClick={clearState}>
              {t("SettingsPages.profile.publicProfile.settings.avatar.modal.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AvatarUploader;
