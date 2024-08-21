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
  Divider,
  Tag,
  Text,
  HStack,
  Show,
} from "@chakra-ui/react";

import { useTranslation } from 'react-i18next';
import AuthContext from "@/contexts/auth";
import UserContext from "@/contexts/user";
import { useRouter } from "next/router";
import RichList from "@/components/rich-list";
import { FiChevronDown } from "react-icons/fi";
import { Organization, MemberRoleEnum } from '@/models/organization';
import CreateOrganizationModal from "@/components/modals/create-organization-modal";

const MyOrganizationsPage = () => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const { t } = useTranslation();
  const [orgSortBy, setOrgSortBy] = useState<string>('updated_at'); // updated_at, created_at, display_name
  const sortOptions = ['created_at', 'updated_at', 'display_name'];

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  // const handleCreateOrganization = async () => {
  //   try {
  //     await createOrganization("🦄 测试"); // only for test, @TODO: design a modal to input organization name
  //     userCtx.updateOrganizations();
  //   } catch (error) {
  //     console.error('Failed to create organization:', error);
  //   }
  // };

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
          {/* <Button
            colorScheme="blue"
            onClick={handleCreateOrganization}
          >
            {t('MyOrganizationsPage.button.create')}
          </Button> */}
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
                      {/* TODO: Button logic */}
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
                      >
                        {t('MyOrganizationsPage.button.leave')}
                      </Button>
                    </HStack>
                  </Show>
              }))} />
          }
        </div>

      </VStack>
    </>
  );
};

export default MyOrganizationsPage;