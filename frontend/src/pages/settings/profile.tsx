import Editable from "@/components/common/editable";
import NavMenu from "@/components/common/nav-menu";
import SettingsOption from "@/components/settings-option";
import { UserSettingsSection } from "@/models/user";
import { Box, Divider, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ProfileSettingsPage = () => {
  const { t } = useTranslation();
  const [selectedSecIndex, setSelectedSecIndex] = useState<number>(0);

  const settingsOptions: UserSettingsSection[] = [
    {
      index: 0,
      title: "Sec1",
      subtitle: "Subtitle1",
      settings: [
        {
          title: t("SettingsPages.profile.settings.display_name.title"),
          description: t(
            "SettingsPages.profile.settings.display_name.description"
          ),
          initialValue: "",
          multiLines: false,
        },
        {
          title: t("SettingsPages.profile.settings.bio.title"),
          description: t("SettingsPages.profile.settings.bio.description"),
          initialValue: "",
          multiLines: true,
        },
      ],
    },
    {
      index: 1,
      title: "Sec2",
      subtitle: "Subtitle2",
      settings: [],
    },
    {
      index: 2,
      title: "Sec3",
      subtitle: "Subtitle3",
      settings: [],
    },
  ];
  const [values, setValues] = useState<string[][]>(
    settingsOptions.map((option) =>
      option.settings.map((setting) => setting.initialValue)
    )
  );

  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[selectedSecIndex][index] = value;
    setValues(newValues);
    // TODO: update values in API
  };

  useEffect(() => {
    // TODO: set values from API
  }, [selectedSecIndex]);

  return (
    <>
      <Head>
        <title>{`${t("SettingsPages.profile.title")} - Unica`}</title>
        <meta name="headerTitle" content={t("SettingsPages.header")} />
      </Head>
      <Grid templateColumns="repeat(6, 1fr)" gap={6}>
        <GridItem colSpan={1}>
          <VStack spacing={4} align="stretch">
            <Text ml={1} mt={2} fontWeight="semibold">
              {t("SettingsPages.profile.section")}
            </Text>
            <NavMenu
              spacing={2}
              selectedKeys={[selectedSecIndex]}
              onClick={(value) => {
                setSelectedSecIndex(value);
              }}
              items={settingsOptions.map((section) => ({
                label: <Text>{section.title}</Text>,
                value: section.index,
              }))}
            />
          </VStack>
        </GridItem>
        <GridItem colSpan={4}>
          <Text mt={2} fontWeight="semibold">
            {settingsOptions[selectedSecIndex].title}
          </Text>
          <Text mt={2} className="secondary-text">
            {settingsOptions[selectedSecIndex].subtitle}
          </Text>
          <Box mt={4}>
            {settingsOptions[selectedSecIndex].settings.map((option, index) => (
              <React.Fragment key={index}>
                <SettingsOption
                  title={option.title}
                  description={option.description}
                >
                  <Editable
                    isTextArea={option.multiLines}
                    value={values[selectedSecIndex][index]}
                    onEditSubmit={(value) => handleChange(index, value)}
                  />
                </SettingsOption>
                {index !==
                  settingsOptions[selectedSecIndex].settings.length - 1 && (
                  <Divider marginY={3} />
                )}
              </React.Fragment>
            ))}
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};

export default ProfileSettingsPage;
