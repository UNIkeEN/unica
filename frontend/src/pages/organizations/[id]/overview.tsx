import { useContext, useEffect } from "react";
import Head from "next/head";
import { useTranslation } from 'react-i18next';
import AuthContext from "@/contexts/auth";
import OrganizationLayout from "@/layouts/organization-layout";

const OrganizationOverviewPage = () => {
  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!authCtx.checkLoginAndRedirect()) return;
  }, [authCtx]);

  return (
    <>
      <OrganizationLayout>
        <div>Organization Overview</div>
      </OrganizationLayout>
    </>
  );
};

export default OrganizationOverviewPage;