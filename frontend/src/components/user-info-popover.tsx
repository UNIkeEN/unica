import {
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { UserBasicInfo } from "@/models/user";

interface UserAvatarProps {
  user: UserBasicInfo;
  trigger?: "hover" | "click";
  avatarSize?: string;
}

interface UserInfoPopoverProps {
  user: UserBasicInfo;
  trigger?: "hover" | "click";
  avatarSize?: string;
  children?: React.ReactNode;
}

const UserInfoPopover = ({ user, trigger = "hover", avatarSize = "md", children }: UserInfoPopoverProps) => {

  return (
    <Popover placement="bottom-start" closeOnBlur trigger={trigger} isLazy>
      <PopoverTrigger>
        {children || <Avatar cursor="pointer" name={user.display_name} size={avatarSize} />}
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

const UserAvatar = ({ user, trigger = "hover", avatarSize = "md" }: UserAvatarProps) => {

  return (
    <UserInfoPopover
      user={user}
      trigger={trigger}
      avatarSize={avatarSize}>
      <Avatar
        cursor="pointer"
        name={user.display_name}
        size={avatarSize}
      />
    </UserInfoPopover>
  );
};

export { UserAvatar, UserInfoPopover };
