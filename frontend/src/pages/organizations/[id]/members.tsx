import { useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import OrganizationContext from "@/contexts/organization";

const OrganizationMembersPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const { t } = useTranslation();

  return (
    <>
      <div>Organization Members</div>
    </>
  );
};

export default OrganizationMembersPage;