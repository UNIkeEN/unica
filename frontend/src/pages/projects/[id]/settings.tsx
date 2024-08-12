import { useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import ProjectContext from "@/contexts/project";

const ProjectSettingsPage = () => {
  const projCtx = useContext(ProjectContext);
  const { t } = useTranslation();

  return (
    <>
      <div>Project Settings</div>
    </>
  );
};

export default ProjectSettingsPage;