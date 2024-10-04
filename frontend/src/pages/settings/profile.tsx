import Editable from "@/components/common/editable";
import SettingsItem from "@/components/settings-item";
import OrganizationContext from "@/contexts/organization";
import UserContext from "@/contexts/user";
import { UserSettingsSection } from "@/models/settings";
import { updateUserProfile } from "@/services/user";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/contexts/toast";

const ProfileSettingsPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const userCtx = useContext(UserContext);
  const orgCtx = useContext(OrganizationContext);

  const [values, setValues] = useState<string[]>([]);
  const settingsOptions: UserSettingsSection = {
    title: t("SettingsPages.profile.title"),
    subtitle: t("SettingsPages.profile.subtitle"),
    settings: [
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
          />
        ),
      },
    ],
  };

  useEffect(() => {
    setValues(settingsOptions.settings.map((setting) => setting.initialValue));
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
      const res = await updateUserProfile({
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

  return <SettingsItem settingsOptions={settingsOptions} />;
};

export default ProfileSettingsPage;
