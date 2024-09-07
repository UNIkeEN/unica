import {
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  VStack,
  HStack
} from "@chakra-ui/react";
import { UserBasicInfo } from "@/models/user";

interface UserInfoPopoverProps {
  user: UserBasicInfo;
  trigger?: "hover" | "click";
  avatarSize?: string;
}

const UserInfoPopover = ({
  user,
  trigger = {trigger},
  avatarSize = "md",
}: UserInfoPopoverProps) => {

  return (
    <Popover placement="bottom-start" closeOnBlur trigger={trigger} isLazy>
      <PopoverTrigger>
        <Avatar cursor="pointer" name={user.display_name} size={avatarSize} />
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

export default UserInfoPopover;