import {
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverProps,
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
  withPopover?: boolean;
  trigger?: "hover" | "click";
  size?: string;
}

interface UserInfoPopoverProps extends PopoverProps {
  user: UserBasicInfo;
  trigger?: "hover" | "click";
  children: React.ReactNode;
}

const UserInfoPopover: React.FC<UserInfoPopoverProps> = ({ 
  user, 
  trigger = "hover", 
  children,
  ...popoverProps
}) => {

  return (
    <Popover closeOnBlur trigger={trigger} isLazy {...popoverProps}>
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
  withPopover = true,
  trigger = "hover", 
  size = "md",
  ...boxProps
}) => {

  if (withPopover)
    return (
      <UserInfoPopover user={user} trigger={trigger}>
        <Box {...boxProps}>
          <Avatar
            cursor="pointer"
            name={user?.display_name || ""}
            src={useUserAvatarUrl(user?.username)}
            size={size}
          />
        </Box>
      </UserInfoPopover>
    );
  else return (
    <Box {...boxProps}>
      <Avatar
        name={user?.display_name || ""}
        src={useUserAvatarUrl(user?.username)}
        size={size}
      />
    </Box>
  )
};

export { UserAvatar, UserInfoPopover };
