import { useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import ProjectContext from "@/contexts/project";
import { ProjectLayoutTabs } from "@/layouts/project-layout";

const ProjectIssuesPage = () => {
  const projCtx = useContext(ProjectContext);
  const { t } = useTranslation();

  return (
    <>
      <ProjectLayoutTabs/>
      <div>Project Issues</div>
    </>
  );
};

export default ProjectIssuesPage;