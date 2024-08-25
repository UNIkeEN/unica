import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuItem,
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  useDisclosure,
  Flex,
  Spacer
} from "@chakra-ui/react";
import { FiMoreHorizontal, FiChevronDown} from "react-icons/fi";
import { ISOtoDate } from "@/utils/datetime";
import OrganizationContext from "@/contexts/organization";
import UserContext from "@/contexts/user";
import { useToast } from '@/contexts/toast';
import { OrganizationMember, MemberRoleEnum } from "@/models/organization";
import { getOrganizationInvitations, getOrganizationMembers } from "@/services/organization";
import RichList from "@/components/rich-list";
import Pagination from "@/components/pagination";
import InviteMembersModal from "@/components/modals/invite-members-modal";
import RemoveMemberAlertDialog from "@/components/modals/remove-member-alert-dialog";
import ChangeMemberRoleModal from "@/components/modals/change-member-role-modal";
import CancelInvitationAlertDialog from "@/components/modals/cancel-invitation-alert-dialog";

const OrganizationMembersPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const userCtx = useContext(UserContext);
  const [memberList, setMemberList] = useState<OrganizationMember[]>([]);
  const [pendingList, setPendingList] = useState<OrganizationMember[]>([]);
  const [ListDomain, setListDomain] = useState<string>('members');
  const ListDomainOptions = ['members', 'pending'];
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pendingCount, setPendingCount] = useState(0);
  const toast = useToast();
  const router = useRouter();
  const { t } = useTranslation();

  const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(null);

  const {
    isOpen: isRemoveDialogOpen,
    onOpen: onRemoveDialogOpen,
    onClose: onRemoveDialogClose
  } = useDisclosure();

  const {
    isOpen: isChangeRoleModalOpen,
    onOpen: onChangeRoleModalOpen,
    onClose: onChangeRoleModalClose
  } = useDisclosure();

  const {
    isOpen: isCancelInviteModalOpen,
    onOpen: onCancelInviteModalOpen,
    onClose: onCancelInviteModalClose
  } = useDisclosure();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) {
      getMemberList(Number(router.query.id), pageIndex, pageSize);
    } else {
      setMemberList([]);
      setPendingList([]);
    }
  }, [router.query.id]);

  const getMemberList = async (id: number, page: number = 1, pageSize: number = 20) => {
    try {
      const res = await getOrganizationMembers(id, page, pageSize);
      orgCtx.setBasicInfo({
        ...orgCtx.basicInfo,
        member_count: res.count
      });
      setMemberList(res.results as OrganizationMember[]);
    } catch (error) {
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t('Services.organization.getOrganizationMembers.error'),
          status: 'error'
        });
      }
      console.error('Failed to update organization members:', error);
      setMemberList([]);
    }
  };

  const getInvitationList = async (id: number, page: number = 1, pageSize: number = 20) => {
    try {
      const res = await getOrganizationInvitations(id, page, pageSize);
      setPendingCount(res.count);
      setPendingList(res.results as OrganizationMember[]);
    } catch (error) {
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t('Services.organization.getOrganizationInvitations.error'),
          status: 'error'
        });
      }
      console.error('Failed to update organization members:', error);
      setPendingCount(0);
      setPendingList([]);
    }
  };

  const handleListDomainChange = (value: string) => {
    setPageIndex(1);
    const id = Number(router.query.id);
    if (value === "pending" && orgCtx.userRole === MemberRoleEnum.OWNER) {
      getInvitationList(id, 1, pageSize)
    } else if (value === "members") {
      getMemberList(Number(router.query.id), 1, pageSize)
    }
    setListDomain(value);
  }

  const listData = (ListDomain === 'members' ? memberList : pendingList);

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    if (ListDomain === "members") {
      getMemberList(Number(router.query.id), page, pageSize)
    } else if (ListDomain === "pending") {
      getInvitationList(Number(router.query.id), page, pageSize)
    }
  };

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
            <InviteMembersModal id={Number(router.query.id)}
            onOKCallback={()=>{
              if (ListDomain === "pending") {
                getInvitationList(Number(router.query.id), pageIndex, pageSize);
              }
            }}/>
          </HStack>
        }

        {listData && listData.length > 0 &&
          <>
            <RichList
              items={listData.map((member) => ({
                title: member.user.display_name,
                subtitle: member.user.username,
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
                    {ListDomain === "members" && orgCtx.userRole === MemberRoleEnum.OWNER &&
                      <Menu>
                        <MenuButton as={IconButton} size="sm" aria-label="Menu" icon={<FiMoreHorizontal />} />
                        <MenuList>
                          <MenuItem onClick={() => {
                            setSelectedMember(member);
                            onChangeRoleModalOpen();
                          }}>
                            {t("OrganizationPages.members.list.menu.change_role")}
                          </MenuItem>
                          <MenuItem onClick={() => {
                            setSelectedMember(member);
                            onRemoveDialogOpen();
                          }}>
                            {t("OrganizationPages.members.list.menu.remove")}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    }
                    {ListDomain === "pending" && orgCtx.userRole === MemberRoleEnum.OWNER &&
                          <Button onClick={() => {
                            setSelectedMember(member);
                            onCancelInviteModalOpen();
                          }}
                          size={'sm'}
                          variant={'subtle'}
                          colorScheme={'red'}
                          >
                            {t("OrganizationPages.members.list.menu.cancel_invitation")}
                          </Button>
                    }
                  </HStack>
              }))} 
            />
            <Flex>
              <Spacer />
              <Pagination
                total={
                  ListDomain === "members"
                    ? Math.ceil(orgCtx.basicInfo.member_count / pageSize)
                    : Math.ceil(pendingCount / pageSize)
                }
                current={pageIndex}
                onPageChange={handlePageChange}
                colorScheme="blue"
                variant="subtle"
              />
            </Flex>
          </>
        }

      </VStack>

      {selectedMember && 
        <RemoveMemberAlertDialog
          isOpen={isRemoveDialogOpen}
          onClose={onRemoveDialogClose}
          orgId={Number(router.query.id)}
          displayUserName={selectedMember.user.display_name}
          username={selectedMember.user.username}
          onOKCallback={() => {
            onRemoveDialogClose();
            getMemberList(Number(router.query.id), pageIndex, pageSize);
          }}
        />
      }
      {selectedMember && 
        <CancelInvitationAlertDialog
          isOpen={isCancelInviteModalOpen}
          onClose={onCancelInviteModalClose}
          orgId={Number(router.query.id)}
          displayUserName={selectedMember.user.display_name}
          username={selectedMember.user.username}
          onOKCallback={() => {
            onCancelInviteModalClose();
            getInvitationList(Number(router.query.id), pageIndex, pageSize)
          }}
        />
      }
      {selectedMember && 
        <ChangeMemberRoleModal
          isOpen={isChangeRoleModalOpen}
          onClose={onChangeRoleModalClose}
          orgId={Number(router.query.id)}
          displayUserName={selectedMember.user.display_name}
          username={selectedMember.user.username}
          onOKCallback={() => {
            onChangeRoleModalClose();
            if (selectedMember.user.username === userCtx.profile.username) {
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              getMemberList(Number(router.query.id), pageIndex, pageSize);
            }
          }}
        />
      }
    </>
  );
};

export default OrganizationMembersPage;