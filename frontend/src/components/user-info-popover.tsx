import {
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  VStack,
  HStack,
  Box,
  BoxProps
} from "@chakra-ui/react";
import { UserBasicInfo } from "@/models/user";
import { useUserAvatarUrl } from "@/utils/url";

interface UserAvatarProps extends BoxProps {
  user: UserBasicInfo;
  trigger?: "hover" | "click";
  size?: string;
}

interface UserInfoPopoverProps {
  user: UserBasicInfo;
  trigger?: "hover" | "click";
  children: React.ReactNode;
}

const UserInfoPopover: React.FC<UserInfoPopoverProps> = ({ 
  user, 
  trigger = "hover", 
  children 
}) => {

  return (
    <Popover closeOnBlur trigger={trigger} isLazy>
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverBody p={4} maxW="18em">
          <VStack spacing={2} align="start">
            <HStack>
              <Text fontSize="md" className="subtitle-bold" color="black">
                {user.display_name}
              </Text>
              <Text fontSize="md" className="secondary-text">
                {user.username}
              </Text>
            </HStack>
            <Text fontSize="sm" wordBreak="break-all" whiteSpace="pre-wrap">
              {user.biography}
            </Text>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  trigger = "hover", 
  size = "md",
  ...boxProps
}) => {

  return (
    <UserInfoPopover user={user} trigger={trigger}>
      <Box {...boxProps}>
        <Avatar
          cursor="pointer"
          name={user.display_name}
          src={useUserAvatarUrl(user.username)}
          size={size}
        />
      </Box>
    </UserInfoPopover>
  );
};

export { UserAvatar, UserInfoPopover };
