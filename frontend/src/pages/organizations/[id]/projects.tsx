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
import Head from "next/head";
import { useTranslation } from 'react-i18next';
import OrganizationContext from "@/contexts/organization";
import { useToast } from '@/contexts/toast';
import { Project } from '@/models/project';
import RichList from "@/components/rich-list";
import Pagination from "@/components/pagination";
import { getProjects } from "@/services/project";
import { formatRelativeTime } from "@/utils/datetime";
import CreateProjectModal from "@/components/modals/create-project-modal";

const OrganizationProjectsPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const toast = useToast();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (router.query.id) {
      orgCtx.updateProjects(pageIndex, pageSize, Number(router.query.id));
    }
  }, [pageIndex, pageSize, router.query.id]);

  const getProjectList = async (page: number = 1, pageSize: number = 20, org_id: number) => {
      orgCtx.updateProjects(page, pageSize, org_id);
  }

  return (
    <>
      <VStack spacing={6} align="stretch">

      <HStack w="100%" justifyContent="flex-end" align="center" spacing={3}>
        <CreateProjectModal isPersonal={false} organizationId={Number(router.query.id)} page={pageIndex} pageSize={pageSize}/>
      </HStack>

        <div>
          <Divider />
          {orgCtx.projects && orgCtx.projects.length > 0 &&
            <RichList
              titleAsLink
              items={
                orgCtx.projects.map((project) => ({
                  title: project.display_name,
                  href: `/projects/${project.id}/board`,
                  body:
                  <Text fontSize="sm" className="secondary-text">
                    {t("OrganizationPages.projects.list.updated_at", {
                      time: formatRelativeTime(project.updated_at, t)
                    })}
                  </Text>
                }))
              }
            />
          }
        </div>
        {orgCtx.projects && orgCtx.projects.length > 0 &&
          <Flex>
            <Spacer />
            <Pagination
              total={Math.ceil(orgCtx.projectCount / pageSize)}
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

export default OrganizationProjectsPage;