import { useContext, useEffect } from "react";
import Head from "next/head";
import { 
  Button, 
  Flex, 
  VStack,
  Divider,
  Tag,
  Text
} from "@chakra-ui/react";
import { useTranslation } from 'react-i18next';
import AuthContext from "@/contexts/auth";
import UserContext from "@/contexts/user";
import { createOrganization } from "@/services/organization";
import LinkList from "@/components/link-list";

const MyOrganizationsPage = () => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  const handleCreateOrganization = async () => {
    try {
      await createOrganization("测试组织2"); // only for test, @TODO: design a modal to input organization name
      userCtx.updateUserOrganizations();
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
          <Button 
            colorScheme="blue"
            onClick={handleCreateOrganization} 
          >
            {t('MyOrganizationsPage.button.create')}
          </Button>
        </Flex>

        <div>
          <Divider/>
          {userCtx.organizations && userCtx.organizations.length > 0 &&
            <LinkList
              items={userCtx.organizations.map((item) => ({
                title: item.display_name,
                href: `organizations/${item.slug}`,
                subtitle: item.name,
                titleExtra: 
                  <Tag colorScheme={item.role === "Owner" ? "green" : "cyan"}>
                    {item.role}
                  </Tag>,
                body: 
                  <Text fontSize="sm" className="secondary-text">
                    {item.member_count} { item.member_count > 1 ? t('MyOrganizationsPage.text.members') : t('MyOrganizationsPage.text.member') }
                  </Text>
              }))}/>
          }
        </div>

      </VStack>
    </>
  );
};

export default MyOrganizationsPage;