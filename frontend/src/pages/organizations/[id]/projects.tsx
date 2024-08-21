import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { 
  VStack,
  Divider,
  Text,
  Flex,
  Spacer
} from "@chakra-ui/react";
import { useTranslation } from 'react-i18next';
import OrganizationContext from "@/contexts/organization";
import { useToast } from '@/contexts/toast';
import { Project } from '@/models/project';
import RichList from "@/components/rich-list";
import Pagination from "@/components/pagination";
import { getProjects } from "@/services/project";
import { formatRelativeTime } from "@/utils/datetime";

const OrganizationProjectsPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [projectCount, setProjectCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const toast = useToast();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) getProjectList(pageIndex, pageSize, id);
    else {
      setProjectList([]);
      setProjectCount(0);
    }
  }, [pageIndex, pageSize, router.query.id]);

  const getProjectList = async (page: number = 1, pageSize: number = 20, org_id: number) => {
    try {
      const res = await getProjects(page, pageSize, org_id);
      setProjectCount(res.count);
      setProjectList(res.results);
    } catch (error) {
      console.error('Failed to get project list:', error);
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast ({
          title: t('Services.projects.getProjects.error'),
          status: 'error'
        })
      }
      setProjectCount(0);
      setProjectList([]);
    }
  }

  return (
    <>
      <VStack spacing={6} align="stretch">
      {/* TODO: Create Project Button and Modal */}
        {projectList && projectList.length > 0 &&
          <>
            <RichList
              titleAsLink
              items={
                projectList.map((project) => ({
                  title: project.display_name,
                  href: `/projects/${project.id}/board`,
                  body:
                  <Text fontSize="sm" className="secondary-text">
                    {t("General.updated_at", {
                      time: formatRelativeTime(project.updated_at, t)
                    })}
                  </Text>
                }))
              }
            />
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
          </>
        }
      </VStack>
    </>
  );
};

export default OrganizationProjectsPage;