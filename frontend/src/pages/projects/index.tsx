import { useContext, useEffect, useState } from "react";
import { 
  VStack,
  Divider,
  Text,
  Flex,
  Spacer,
  HStack
} from "@chakra-ui/react";
import Head from "next/head";
import { useTranslation } from 'react-i18next';
import AuthContext from "@/contexts/auth";
import { useToast } from '@/contexts/toast';
import { Project } from '@/models/project';
import RichList from "@/components/rich-list";
import Pagination from "@/components/pagination";
import { getProjects } from "@/services/project";
import { formatRelativeTime } from "@/utils/datetime";
import CreateProjectModal from "@/components/modals/create-project-modal";
import UserContext from "@/contexts/user";

const MyProjectsPage = () => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const toast = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  useEffect(() => {
    getProjectList(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const getProjectList = async (page: number = 1, pageSize: number = 20) => {
      userCtx.updateProjects(page, pageSize);
  }

  return (
    <>
      <Head>
        <title>{`${t('MyProjectsPage.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('MyProjectsPage.header')} />
      </Head>
      <VStack spacing={6} align="stretch">
        
        <HStack w="100%" justifyContent="flex-end" align="center" spacing={3}>
          <CreateProjectModal isPersonal={true} page={pageIndex} pageSize={pageSize}/>
        </HStack>

        <div>
          <Divider />
          {userCtx.projects && userCtx.projects.length > 0 &&
            <RichList
              titleAsLink
              items={
                userCtx.projects.map((project) => ({
                  title: project.display_name,
                  href: `/projects/${project.id}/board`,
                  body:
                    <Text fontSize="sm" className="secondary-text">
                      {t("MyProjectsPage.list.updated_at", {
                        time: formatRelativeTime(project.updated_at, t)
                      })}
                    </Text>
                }))
              }
            />
          }
        </div>
        {userCtx.projects && userCtx.projects.length > 0 &&
          <Flex>
            <Spacer />
            <Pagination
              total={Math.ceil(userCtx.projectCount / pageSize)}
              current={pageIndex}
              onPageChange={(page)=>setPageIndex(page)}
              colorScheme="blue"
              variant="subtle"
            />
          </Flex>
        }
      </VStack>
    </>
  );
};

export default MyProjectsPage;