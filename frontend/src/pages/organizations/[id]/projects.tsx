import CreateProjectModal from "@/components/modals/create-project-modal";
import Pagination from "@/components/pagination";
import RichList from "@/components/rich-list";
import OrganizationContext from "@/contexts/organization";
import { formatRelativeTime } from "@/utils/datetime";
import { Divider, Flex, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const OrganizationProjectsPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [projectList, setProjectList] = useState([]);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    orgCtx.getProjectList(pageIndex, pageSize, Number(router.query.id))
    .then((res) => {
      setProjectList(res.results);
      orgCtx.setBasicInfo({...orgCtx.basicInfo, project_count: res.count});
    });
  }, [pageIndex, pageSize, router.query.id]);

  return (
    <>
      <VStack spacing={6} align="stretch">
        <HStack w="100%" justifyContent="flex-end" align="center" spacing={3}>
          <CreateProjectModal
            organizationId={Number(router.query.id)}
          />
        </HStack>

        <div>
          <Divider />
          {projectList && projectList.length > 0 && (
            <RichList
              titleAsLink
              items={projectList.map((project) => ({
                title: project.display_name,
                href: `/projects/${project.id}/board`,
                body: (
                  <Text fontSize="sm" className="secondary-text">
                    {t("OrganizationPages.projects.list.updated_at", {
                      time: formatRelativeTime(project.updated_at, t),
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
