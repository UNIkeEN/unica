import { useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
  Button,
  VStack,
  Divider,
  HStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { FiMoreHorizontal } from "react-icons/fi";
import RichList from "@/components/rich-list";
import { ISOtoDate } from "@/utils/datetime";
import OrganizationContext from "@/contexts/organization";

const OrganizationMembersPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const { t } = useTranslation();

  return (
    <>
      <VStack spacing={6} align="stretch">
        <HStack w="100%" justifyContent="flex-end" align="center" spacing={3}>
          {orgCtx.userRole === "Owner" &&<Button
            colorScheme="blue"
          >
            {t('OrganizationPages.members.button.invite')}
          </Button>}
        </HStack>

        <div>
          <Divider />
          {orgCtx.memberList && orgCtx.memberList.length > 0 &&
            <RichList
              items={orgCtx.memberList.map((member) => ({
                title: member.user.display_name,
                subtitle: member.user.email,
                lineExtra:
                  <HStack spacing={4}>
                    <Text fontSize="sm" className="secondary-text">{member.role}</Text>
                    <Text fontSize="sm" className="secondary-text">
                      {t('OrganizationPages.members.list.joined_at', { date: ISOtoDate(member.joined_at) })}
                    </Text>
                    {orgCtx.userRole === "Owner" &&
                      <IconButton size="sm" aria-label="Menu" icon={<FiMoreHorizontal />} />
                    }
                  </HStack>
              }))} 
            />
          }
        </div>

      </VStack>
    </>
  );
};

export default OrganizationMembersPage;