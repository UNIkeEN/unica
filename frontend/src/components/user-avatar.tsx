import {
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  VStack,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { UserBasicInfo } from "@/models/user";

interface UserAvatarProps {
  user: UserBasicInfo;
  trigger?: "hover" | "click";
  avatarSize?: string;
}

const UserAvatar = ({
  user,
  trigger = "hover",
  avatarSize = "md",
}: UserAvatarProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover
      placement="bottom-start"
      closeOnBlur
      isLazy
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      trigger={trigger}
    >
      <PopoverTrigger>
        <Avatar
          cursor="pointer"
          name={user.display_name}
          size={avatarSize}
          onMouseEnter={trigger === "hover" ? onOpen : undefined}
          onMouseLeave={trigger === "hover" ? onClose : undefined}
        />
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverBody p={4}>
          <VStack spacing={2} align="start">
            <HStack>
              <Text fontSize="lg" fontWeight="normal">
                {user.display_name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                @{user.username}
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {user.biography}
            </Text>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatar;
