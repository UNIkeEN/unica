import { useContext, useEffect } from "react";
import Head from "next/head";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button,
  Flex,
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
import { createOrganization } from "@/services/organization";
import LinkList from "@/components/link-list";
import { ChevronDownIcon } from "@chakra-ui/icons";

const MyOrganizationsPage = () => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  const handleCreateOrganization = async () => {
    try {
      await createOrganization("🦄 测试"); // only for test, @TODO: design a modal to input organization name
      userCtx.updateOrganizations();
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  return (
    <>
      <Head>
        <title>{`${t('MyOrganizationsPage.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('MyOrganizationsPage.header')} />
      </Head>
      <VStack spacing={6} align="stretch">
        <Flex w="100%" justifyContent="flex-end" align="center">
          <Menu closeOnSelect={true}>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="160px" style={{ textAlign: 'left' }}>
              {t('MyOrganizationsPage.select.sortBy')}
            </MenuButton>
            <MenuList>
              <MenuOptionGroup
                defaultValue={userCtx.orgSortBy}
                type="radio"
                onChange={(value) => userCtx.updateOrgSortBy(value.toString())}
              >
                <MenuItemOption value="created_at">{t('MyOrganizationsPage.select.byCreatedAt')}</MenuItemOption>
                <MenuItemOption value="updated_at">{t('MyOrganizationsPage.select.byUpdatedAt')}</MenuItemOption>
                <MenuItemOption value="display_name">{t('MyOrganizationsPage.select.byDisplayName')}</MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <Button style={{ marginLeft: '20px' }}
            colorScheme="blue"
            onClick={handleCreateOrganization}
          >
            {t('MyOrganizationsPage.button.create')}
          </Button>
        </Flex>

        <div>
          <Divider />
          {userCtx.organizations && userCtx.organizations.length > 0 &&
            <LinkList
              items={userCtx.organizations.map((item) => ({
                title: item.display_name,
                href: `organizations/${item.id}`,
                subtitle: item.description,
                titleExtra:
                  <Tag fontWeight="normal" colorScheme={item.role === "Owner" ? "green" : "cyan"}>
                    {item.role}
                  </Tag>,
                body:
                  <Text fontSize="sm" className="secondary-text">
                    {item.member_count} {item.member_count > 1 ? t('MyOrganizationsPage.text.members') : t('MyOrganizationsPage.text.member')}
                  </Text>,
                lineExtra:
                  <Show above="md">
                    <HStack spacing={2}>
                      {/* TODO: Button logic */}
                      {item.role === "Owner" &&
                        <Button size="sm">{t('MyOrganizationsPage.button.settings')}</Button>
                      }
                      <Button size="sm" colorScheme="red" variant="subtle"
                        isDisabled={item.role === "Owner" && item.owner_count === 1}
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