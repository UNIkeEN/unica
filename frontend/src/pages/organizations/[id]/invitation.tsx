import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useToast } from '@/contexts/toast';
import { useRouter } from 'next/router';
import { VStack, HStack, Text, Button } from '@chakra-ui/react';
import OrganizationContext from "@/contexts/organization";
import UserContext from "@/contexts/user";
import { MemberRoleEnum } from "@/models/organization";
import { respondInvitation } from "@/services/organization";

const OrganizationInvitationPage = () => {
  const orgCtx = useContext(OrganizationContext);
  const userCtx = useContext(UserContext);
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const { id } = router.query;
    if (id)
      if (orgCtx.mounted && orgCtx.userRole !== MemberRoleEnum.PENDING) {
        router.push(`/organizations/${id}/overview/`);
      }
  }, [router]);

  const handleRespond = (accept: boolean) => {
    const { id } = router.query;
    if (id)
      respondInvitation(Number(id), accept)
        .then(() => {
          if (accept) {
            orgCtx.updateAll(Number(id));
            userCtx.updateOrganizations();
            router.push(`/organizations/${id}/overview/`);
          } else {
            router.push('/home');
          }
        })
        .catch(() => {
          toast({
            title: t('OrganizationPages.invitation.toast.error'),
            status: 'error'
          });
        });
  }

  return (
    <>
      <VStack spacing={6} align="start" flexWrap="wrap">
        <Text>{t("OrganizationPages.invitation.text.description",
          { orgName: orgCtx.basicInfo?.display_name }
        )}</Text>
        <HStack spacing={3}>
          <Button colorScheme="blue" onClick={() => {handleRespond(true)}}>
            {t("OrganizationPages.invitation.button.accept",
              { orgName: orgCtx.basicInfo?.display_name }
            )}
          </Button>
          <Button onClick={() => {handleRespond(false)}}>
            {t("OrganizationPages.invitation.button.decline")}
          </Button>
        </HStack>
      </VStack>
    </>
  );
};

export default OrganizationInvitationPage;