import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { 
  VStack,
  Divider,
  Text,
  Flex,
  Spacer,
  HStack
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useToast } from '@/contexts/toast';
import { Project } from '@/models/project';
import CreateProjectModal from "@/components/modals/create-project-modal";
import Pagination from "@/components/pagination";
import RichList from "@/components/rich-list";
import OrganizationContext from "@/contexts/organization";
import { formatRelativeTime } from "@/utils/datetime";
import { getProjects } from "@/services/project";


const OrganizationProjectsPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [projectList, setProjectList] = useState([]);
  const [projectCount, setProjectCount] = useState<number>(0);
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) handleGetProjects(pageIndex, pageSize, id);
    else {
      setProjectList([]);
      setProjectCount(0);
    }
  }, [pageIndex, pageSize, router.query.id]);

  const handleGetProjects = async (page: number = 1, pageSize: number = 20, org_id: number) => {
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
        <HStack w="100%" justifyContent="flex-end" align="center" spacing={3}>
          <CreateProjectModal
            organizationId={Number(router.query.id)}
          />
        </HStack>

        <div>
          {projectList && projectList.length > 0 && (
            <RichList
              titleAsLink
              items={projectList.map((project) => ({
                title: project.display_name,
                href: `/projects/${project.id}/board`,
                body: (
                  <Text fontSize="sm" className="secondary-text">
                    {t("General.updated_at", {
                      time: formatRelativeTime(project.updated_at, t)
                    })}
                  </Text>
                ),
              }))}
            />
          )}
        </div>
        {projectList && projectList.length > 0 && (
          <Flex>
            <Spacer />
            <Pagination
              total={Math.ceil(orgCtx.basicInfo?.project_count / pageSize)}
              current={pageIndex}
              onPageChange={(page) => setPageIndex(page)}
              colorScheme="blue"
              variant="subtle"
            />
          </Flex>
        )}
      </VStack>
    </>
  );
};

export default OrganizationProjectsPage;
