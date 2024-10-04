import SettingsOption from "@/components/settings-option";
import { UserSettingsSection } from "@/models/settings";
import { Box, Divider, Text } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { useTranslation } from "react-i18next";

interface SettingsItemProps {
  settingsOptions: UserSettingsSection;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ settingsOptions }) => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{`${t("SettingsPages.profile.title")} - Unica`}</title>
        <meta name="headerTitle" content={t("SettingsPages.header")} />
      </Head>
      <Text mt={2} fontWeight="semibold" fontSize={20}>
        {settingsOptions.title}
      </Text>
      <Text mt={2} className="secondary-text" fontSize={16}>
        {settingsOptions.subtitle}
      </Text>
      <Box mt={4}>
        {settingsOptions.settings.map((option, index) => (
          <React.Fragment key={index}>
            <SettingsOption
              title={option.title}
              description={option.description}
            >
              {option.component}
            </SettingsOption>
            {index !== settingsOptions.settings.length - 1 && (
              <Divider marginY={3} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </>
  );
};

export default SettingsItem;
