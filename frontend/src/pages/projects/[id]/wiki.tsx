import { useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import ProjectContext from "@/contexts/project";

const ProjectWikiPage = () => {
  const projCtx = useContext(ProjectContext);
  const { t } = useTranslation();

  return (
    <>
      <div>Project Wiki</div>
    </>
  );
};

export default ProjectWikiPage;