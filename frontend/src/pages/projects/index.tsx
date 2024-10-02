import CreateProjectModal from "@/components/modals/create-project-modal";
import Pagination from "@/components/common/pagination";
import RichList from "@/components/common/rich-list";
import AuthContext from "@/contexts/auth";
import UserContext from "@/contexts/user";
import { formatRelativeTime } from "@/utils/datetime";
import { Flex, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MyProjectsPage = () => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [projectList, setProjectList] = useState([]);
  const [projectCount, setProjectCount] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  useEffect(() => {
    userCtx.handleListProjects(pageIndex, pageSize)
    .then((res) => {
      setProjectList(res.results);
      setProjectCount(res.count);
    })
    .catch((error) => {
      setProjectList([]);
      setProjectCount(0);
    })
  }, [pageIndex, pageSize]);

  return (
    <>
      <Head>
        <title>{`${t("MyProjectsPage.title")} - Unica`}</title>
        <meta name="headerTitle" content={t("MyProjectsPage.header")} />
      </Head>
      <VStack spacing={6} align="stretch">
        <HStack w="100%" justifyContent="flex-end" align="center" spacing={3}>
          <CreateProjectModal isPersonal/>
        </HStack>

        <div>
          <RichList
            titleAsLink
            items={projectList.map((project) => ({
              title: project.display_name,
              href: `/projects/${project.id}/tasks`,
              body: (
                <Text fontSize="sm" className="secondary-text">
                  {t("MyProjectsPage.list.updated_at", {
                    time: formatRelativeTime(project.updated_at, t),
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
              total={Math.ceil(projectCount / pageSize)}
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

export default MyProjectsPage;
