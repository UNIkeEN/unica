import { useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import OrganizationContext from "@/contexts/organization";

const OrganizationProjectsPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const { t } = useTranslation();

  return (
    <>
      <div>Organization Projects</div>
    </>
  );
};

export default OrganizationProjectsPage;