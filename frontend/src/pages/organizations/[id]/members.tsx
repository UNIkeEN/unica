import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button,
  VStack,
  Divider,
  HStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { FiMoreHorizontal, FiChevronDown} from "react-icons/fi";
import RichList from "@/components/rich-list";
import { ISOtoDate } from "@/utils/datetime";
import OrganizationContext from "@/contexts/organization";
import { OrganizationMember, MemberRoleEnum } from "@/models/organization";

const OrganizationMembersPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const [memberList, setMemberList] = useState<OrganizationMember[]>([]);
  const [pendingList, setPendingList] = useState<OrganizationMember[]>([]);
  const [ListDomain, setListDomain] = useState<string>('members');
  const ListDomainOptions = ['members', 'pending'];
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
      setPendingList([]);
    }
  }, [router.query.id]);

  const handleListDomainChange = (value: string) => {
    const id = Number(router.query.id);
    if (value === "pending" && orgCtx.userRole === MemberRoleEnum.OWNER) {
      orgCtx.getInvitationList(id, pageIndex, pageSize)
      .then((res) => {setPendingList(res);})
      .catch((error) => {setPendingList([]);});
    } else if (value === "members") {
      orgCtx.getMemberList(Number(router.query.id), pageIndex, pageSize)
      .then((res) => {setMemberList(res);})
      .catch((error) => {setMemberList([]);});
    }
    setListDomain(value);
  }

  const listData = (ListDomain === 'members' ? memberList : pendingList);

  return (
    <>
      <VStack spacing={6} align="stretch">
        {orgCtx.userRole === MemberRoleEnum.OWNER &&
        <HStack w="100%" justifyContent="flex-end" align="center" spacing={3}>
            <Menu closeOnSelect={true}>
              <MenuButton as={Button} rightIcon={<FiChevronDown/>} w="auto" style={{ textAlign: 'left' }}>
              {t('OrganizationPages.members.select.permission_group')}{t(`OrganizationPages.members.select.${ListDomain}`)}
              </MenuButton>
              <MenuList>
                <MenuOptionGroup
                  defaultValue={ListDomain}
                  type="radio"
                  onChange={(value) => handleListDomainChange(value as string)}
                >
                  {ListDomainOptions.map((option) => (
                    <MenuItemOption key={option} value={option}>
                      {t(`OrganizationPages.members.select.${option}`)}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            <Button
              colorScheme="blue"
            >
              {t('OrganizationPages.members.button.invite')}
            </Button>
          </HStack>
        }

        <div>
          <Divider />
          {listData && listData.length > 0 &&
            <RichList
              items={listData.map((member) => ({
                title: member.user.display_name,
                subtitle: member.user.email,
                lineExtra:
                  <HStack spacing={4}>
                    <Text fontSize="sm" className="secondary-text">
                      {t(`Enums.organization.role.${member.role}`)}
                    </Text>
                    {ListDomain === "members"
                      ? <Text fontSize="sm" className="secondary-text">
                          {t('OrganizationPages.members.list.joined_at', { date: ISOtoDate(member.joined_at) })}
                        </Text>
                      : <Text fontSize="sm" className="secondary-text">
                          {t('OrganizationPages.members.list.invited_at', { date: ISOtoDate(member.joined_at) })}
                        </Text>
                    }
                    {orgCtx.userRole === MemberRoleEnum.OWNER &&
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