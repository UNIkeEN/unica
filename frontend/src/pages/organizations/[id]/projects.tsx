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
import CreateProjectModal from "@/components/modals/create-project-modal";
import Pagination from "@/components/common/pagination";
import RichList from "@/components/common/rich-list";
import OrganizationContext from "@/contexts/organization";
import { formatRelativeTime } from "@/utils/datetime";


const OrganizationProjectsPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [projectList, setProjectList] = useState([]);
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();

  useEffect(() => {
    const id = Number(router.query.id);
    if (id) {
      orgCtx.handleListProjects(pageIndex, pageSize, id)
      .then((res) => {setProjectList(res);})
      .catch((error) => {setProjectList([]);})
    } else {
      setProjectList([]);
    }
  }, [pageIndex, pageSize]);

  return (
    <>
      <HStack w="100%" justifyContent="flex-end" align="center" spacing={3}>
        <CreateProjectModal
          organizationId={Number(router.query.id)}
        />
      </HStack>

      <div>
        <RichList
          titleAsLink
          items={projectList.map((project) => ({
            title: project.display_name,
            href: `/projects/${project.id}/tasks`,
            body: (
              <Text fontSize="sm" className="secondary-text">
                {t("General.updated_at", {
                  time: formatRelativeTime(project.updated_at, t)
                })}
              </Text>
            ),
          }))}
        />
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
    </>
  );
};

export default OrganizationProjectsPage;
