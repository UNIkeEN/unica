import { useContext, useEffect, useState } from "react";
import { 
  VStack,
  Divider,
  Text,
  Flex,
  Spacer
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

const MyProjectsPage = () => {
  const authCtx = useContext(AuthContext);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [projectCount, setProjectCount] = useState<number>(0);
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
    try {
      const res = await getProjects(page, pageSize);
      console.warn(res);
      setProjectCount(res.count);
      setProjectList(res.results);
    } catch (error) {
      console.error('Failed to get project list:', error);
      toast ({
        title: t('Services.projects.getProjects.error'),
        status: 'error'
      })
      setProjectCount(0);
      setProjectList([]);
    }
  }

  return (
    <>
      <Head>
        <title>{`${t('MyProjectsPage.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('MyProjectsPage.header')} />
      </Head>
      <VStack spacing={6} align="stretch">
      {/* TODO: Create Project Button and Modal */}
        <div>
          <Divider />
          {projectList && projectList.length > 0 &&
            <RichList
              titleAsLink
              items={
                projectList.map((project) => ({
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
        {projectList && projectList.length > 0 &&
          <Flex>
            <Spacer />
            <Pagination
              total={Math.ceil(projectCount / pageSize)}
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