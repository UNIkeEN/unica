import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
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
import { OrganizationMember } from "@/models/organization";

const OrganizationMembersPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const [memberList, setMemberList] = useState<OrganizationMember[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) {
      orgCtx.getMemberList(Number(router.query.id), pageIndex, pageSize)
      .then((res) => {setMemberList(res);})
      .catch((error) => {setMemberList([]);});
    } else {
      setMemberList([]);
    }
  }, [router.query.id]);

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
          {memberList && memberList.length > 0 &&
            <RichList
              items={memberList.map((member) => ({
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