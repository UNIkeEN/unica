import {
  VStack,
  Box,
  BoxProps
} from '@chakra-ui/react';
import React from 'react';
import SettingsOption from "@/components/settings-option";
import EditableText from "@/components/editable";

interface PersonalInfoSettingsProps extends BoxProps {
  userName: string;
  userBio: string;
}

const PersonalInfoSettings: React.FC<PersonalInfoSettingsProps> = ({ userName, userBio, ...boxProps }) => {
  return (
    <VStack spacing={4} {...boxProps}>
      <Box
        width="100%"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        p={4}
      >
        <SettingsOption title="userName" description="Edit your name">
          <EditableText value={userName} />
        </SettingsOption>
      </Box>
      <Box
        width="100%"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        p={4}
      >
        <SettingsOption title="Profile Settings" description="Enter your profile">
          <EditableText value={userBio} isTextarea />
        </SettingsOption>
      </Box>
    </VStack>
  );
};

export default PersonalInfoSettings;
