import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button,
  VStack,
  Tag,
  Text,
  HStack,
  Show,
  Flex,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
import AuthContext from "@/contexts/auth";
import UserContext from "@/contexts/user";
import { useRouter } from "next/router";
import { useToast } from "@/contexts/toast";
import RichList from "@/components/common/rich-list";
import Pagination from "@/components/common/pagination";
import { Organization, MemberRoleEnum } from '@/models/organization';
import CreateOrganizationModal from "@/components/modals/create-organization-modal";
import GenericAlertDialog from "@/components/modals/generic-alert-dialog";
import { leaveOrganization } from "@/services/organization";
import OrganizationContext from "@/contexts/organization";

const MyOrganizationsPage = () => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const orgCtx = useContext(OrganizationContext);
  const toast = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const [orgSortBy, setOrgSortBy] = useState<string>('updated_at');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [orgList, setOrgList] = useState<Organization[]>([]);
  const [orgCount, setOrgCount] = useState<number>(0);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const sortOptions = {
    created_at: '-created_at',
    updated_at: '-updated_at',
    display_name: 'display_name'
  };

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  useEffect(() => {
    updateListOrganizations();
  }, [pageIndex, pageSize, orgSortBy]);

  const updateListOrganizations = () => {
    userCtx.handleListOrganizations(pageIndex, pageSize, sortOptions[orgSortBy])
    .then((res) => {
      setOrgList(res.results);
      setOrgCount(res.count);
    })
    .catch((error) => {
      setOrgList([]);
      setOrgCount(0);
    })
  }

  const handleLeaveOrganization = async () => {
    try {
      await leaveOrganization(selectedOrg.id);
      toast({
        title: t("Services.organization.leaveOrganization.left"),
        status: "success",
      });
      onClose();
      setSelectedOrg(null);
      updateListOrganizations();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to leave organization:", error);
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 400)
      ) {
        toast({
          title: t("Services.organization.leaveOrganization.error"),
          description: t(
            `Services.organization.leaveOrganization.error-${error.response.status}`
          ),
          status: "error",
        });
      }
      onClose();
      if (error.response && error.response.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      }
    }
  };

  return (
    <>
      <Head>
        <title>{`${t('MyOrganizationsPage.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('MyOrganizationsPage.header')} />
      </Head>
      <VStack spacing={6} align="stretch">
        <HStack w="100%" justifyContent="flex-end" align="center" spacing={3}>
          <Menu closeOnSelect={true}>
            <MenuButton as={Button} rightIcon={<FiChevronDown/>} w="auto" style={{ textAlign: 'left' }}>
              {`${t('MyOrganizationsPage.select.sort_by')}${t(`MyOrganizationsPage.select.by_${orgSortBy}`)}`}
            </MenuButton>
            <MenuList>
              <MenuOptionGroup
                defaultValue={orgSortBy}
                type="radio"
                onChange={(value) => setOrgSortBy(value as string)}
              >
                {Object.keys(sortOptions).map(key => (
                  <MenuItemOption key={key} value={key}>
                    {t(`MyOrganizationsPage.select.by_${key}`)}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <CreateOrganizationModal />
        </HStack>

        <div>
          <RichList titleAsLink
            items={orgList.map((item) => ({
              title: item.display_name,
              href: `organizations/${item.id}/overview`,
              subtitle: item.description,
              titleExtra:
                <Tag fontWeight="normal" colorScheme={item.role === MemberRoleEnum.OWNER ? "green" : "cyan"}>
                  {t(`Enums.organization.role.${item.role}`)}
                </Tag>,
              body:
                <Text fontSize="sm" className="secondary-text">
                  {item.member_count} {item.member_count > 1 ? t('MyOrganizationsPage.text.members') : t('MyOrganizationsPage.text.member')}
                </Text>,
              lineExtra:
                <Show above="md">
                  <HStack spacing={2}>
                    {item.role === MemberRoleEnum.OWNER &&
                      <Button 
                        size="sm"
                        onClick={()=>{router.push(`organizations/${item.id}/settings`)}}
                      >
                        {t('MyOrganizationsPage.button.settings')}
                      </Button>
                    }
                    <Button size="sm" colorScheme="red" variant="subtle"
                      isDisabled={item.role === MemberRoleEnum.OWNER && item.owner_count === 1}
                      onClick={() => {
                        setSelectedOrg(item);
                        onOpen();
                      }}
                    >
                      {t('MyOrganizationsPage.button.leave')}
                    </Button>
                  </HStack>
                </Show>
            }))} 
          />
        </div>
        {orgList && orgList.length > 0 && (
          <Flex>
            <Spacer />
            <Pagination
              total={Math.ceil(orgCount / pageSize)}
              current={pageIndex}
              onPageChange={(page) => setPageIndex(page)}
              colorScheme="blue"
              variant="subtle"
            />
          </Flex>
        )}
        {selectedOrg &&
          <GenericAlertDialog 
          isOpen={isOpen} 
          onClose={onClose} 
          title={t('LeaveOrganizationAlertDialog.dialog.title')}
          body={t('LeaveOrganizationAlertDialog.dialog.content', { orgName: selectedOrg.display_name })}
          btnOK={t('LeaveOrganizationAlertDialog.dialog.confirm')}
          btnCancel={t('LeaveOrganizationAlertDialog.dialog.cancel')}
          onOKCallback={handleLeaveOrganization}
        />}
      </VStack>
    </>
  );
};

export default MyOrganizationsPage;