import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Editable from "@/components/common/editable";
import SettingsOption from "@/components/settings-option";
import OrganizationContext from "@/contexts/organization";
import { useToast } from "@/contexts/toast";
import UserContext from "@/contexts/user";
import { SettingsSection } from "@/models/settings";
import { updateUserProfile } from "@/services/user";
import { Box, Divider, Text } from "@chakra-ui/react";

const ProfileSettingsPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const userCtx = useContext(UserContext);
  const orgCtx = useContext(OrganizationContext);

  const [values, setValues] = useState<string[]>([]);
  const profileSettings: SettingsSection = {
    title: t("SettingsPages.profile.title"),
    subtitle: t("SettingsPages.profile.subtitle"),
    items: [
      {
        title: t("SettingsPages.profile.settings.display_name.title"),
        description: t(
          "SettingsPages.profile.settings.display_name.description"
        ),
        initialValue: "",
        component: (
          <Editable
            isTextArea={false}
            value={values[0]}
            onEditSubmit={(value) => handleUpdateUserProfile(0, value)}
            placeholder={t("SettingsPages.profile.settings.display_name.title")}
            localeKey="SettingsPages.profile.settings.display_name"
            checkError={(value) => {
              return value.length <= 0 ? 1 : value.length > 50 ? 2 : 0;
            }}
          />
        ),
      },
      {
        title: t("SettingsPages.profile.settings.bio.title"),
        description: t("SettingsPages.profile.settings.bio.description"),
        initialValue: "",
        component: (
          <Editable
            isTextArea={true}
            value={values[1]}
            onEditSubmit={(value) => handleUpdateUserProfile(1, value)}
            placeholder={t("SettingsPages.profile.settings.bio.title")}
            localeKey="SettingsPages.profile.settings.bio"
            checkError={(value) => {
              return value.length > 200 ? 2 : 0;
            }}
          />
        ),
      },
    ],
  };

  useEffect(() => {
    setValues(profileSettings.items.map((setting) => setting.initialValue));
  }, []);

  useEffect(() => {
    if (!userCtx.profile) return;
    const newValues = [...values];
    newValues[0] = userCtx.profile.display_name;
    newValues[1] = userCtx.profile.biography;
    setValues(newValues);
  }, [userCtx.profile]);

  const handleUpdateUserProfile = async (index: number, value: string) => {
    try {
      await updateUserProfile({
        display_name: index === 0 ? value : values[0],
        biography: index === 1 ? value : values[1],
      });
    } catch (error) {
      if (error.request && error.request.status === 403) {
        orgCtx.toastNoPermissionAndRedirect();
      } else {
        toast({
          title: t("Services.user.updateUserProfile.error"),
          status: "error",
        });
      }
      return;
    }
    toast({
      title: t("Services.user.updateUserProfile.success"),
      status: "success",
    });
    userCtx.updateProfile();
  };

  return (
    <>
      <Head>
        <title>{`${t("SettingsPages.profile.title")} - Unica`}</title>
        <meta name="headerTitle" content={t("SettingsPages.header")} />
      </Head>
      <Text fontWeight="semibold" fontSize="xl">
        {profileSettings.title}
      </Text>
      <Text mt={1} className="secondary-text" fontSize="md">
        {profileSettings.subtitle}
      </Text>
      <Box mt={6}>
        {profileSettings.items.map((option, index) => (
          <React.Fragment key={index}>
            <SettingsOption
              title={option.title}
              description={option.description}
            >
              {option.component}
            </SettingsOption>
            {index !== profileSettings.items.length - 1 && (
              <Divider marginY={3} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </>
  );
};

export default ProfileSettingsPage;
