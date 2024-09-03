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
  useDisclosure,
} from "@chakra-ui/react";

import { useTranslation } from 'react-i18next';
import AuthContext from "@/contexts/auth";
import UserContext from "@/contexts/user";
import { useRouter } from "next/router";
import { useToast } from "@/contexts/toast";
import RichList from "@/components/rich-list";
import { FiChevronDown } from "react-icons/fi";
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
  const [orgSortBy, setOrgSortBy] = useState<string>('updated_at'); // updated_at, created_at, display_name
  const sortOptions = ['created_at', 'updated_at', 'display_name'];
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  const sortOrganizations = (orgs: Organization[], orgSortBy: string): Organization[] => {
    return [...orgs].sort((a, b) => {
      if (orgSortBy === 'created_at' || orgSortBy === 'updated_at') {
        return new Date(b[orgSortBy]).getTime() - new Date(a[orgSortBy]).getTime();
      } else if (orgSortBy === 'display_name') {
        return a.display_name.localeCompare(b.display_name);
      }
      return 0;
    });
  };

  const handleLeaveOrganization = async () => {
    try {
      await leaveOrganization(selectedOrg.id);
      toast({
        title: t("Services.organization.leaveOrganization.left"),
        status: "success",
      });
      onClose();
      setSelectedOrg(null);
      userCtx.updateOrganizations();
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
                {sortOptions.map((option) => (
                  <MenuItemOption key={option} value={option}>
                    {t(`MyOrganizationsPage.select.by_${option}`)}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <CreateOrganizationModal />
        </HStack>

        <div>
          {userCtx.organizations && userCtx.organizations.length > 0 &&
            <RichList titleAsLink
              items={sortOrganizations(userCtx.organizations, orgSortBy).map((item) => ({
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
              }))} />
          }
        </div>
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