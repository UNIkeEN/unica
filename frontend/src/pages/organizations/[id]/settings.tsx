import { useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import OrganizationContext from "@/contexts/organization";
import { MemberRoleEnum } from "@/models/organization";

const OrganizationSettingsPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (orgCtx.userRole !==MemberRoleEnum.OWNER) {
      router.push(`/organizations/${router.query.id}/overview/`);
    }
  }, []);

  return (
    <>
      <div>Organization Settings</div>
    </>
  );
};

export default OrganizationSettingsPage;