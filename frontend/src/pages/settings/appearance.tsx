import React from "react";
import Head from "next/head";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button,
  Text,
  Box,
  Divider
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
import { localeResources, changeLanguage, DEFAULT_LOCALE } from "@/locales";
import { SettingsSection } from "@/models/settings";
import SettingsOption from "@/components/settings-option";


const AppearanceSettingsPage = () => {
  const { t } = useTranslation();
  const currentLanguage = localStorage.getItem('locale') || DEFAULT_LOCALE;

  const LocaleMenu = () => {
    return (
      <Menu>
        <MenuButton as={Button} size="sm" rightIcon={<FiChevronDown/>} w="auto" style={{ textAlign: 'left' }}>
          {localeResources[currentLanguage]?.display_name}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup
            defaultValue={currentLanguage}
            type="radio"
            onChange={(value) => changeLanguage(value as string)}
          >
            {Object.keys(localeResources).map(key => (
              <MenuItemOption key={key} value={key} fontSize="sm">
                {localeResources[key].display_name}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    )
  }

  const appearanceSettings: SettingsSection = {
    title: t("SettingsPages.appearance.appearance.title"),
    subtitle: t("SettingsPages.appearance.appearance.subtitle"),
    items: [
      {
        title: t("SettingsPages.appearance.appearance.settings.language.title"),
        description: t("SettingsPages.appearance.appearance.settings.language.description"),
        initialValue: "",
        component: <LocaleMenu />
      },
    ]
  }

  const settingsSectionList = [
    appearanceSettings,
  ];

  return (
    <>
      <Head>
        <title>{`${t('SettingsPages.appearance.title')} - Unica`}</title>
        <meta name="headerTitle" content={t('SettingsPages.header')} />
      </Head>
      {settingsSectionList.map((sec) => {
       return (
        <React.Fragment key={sec.title}>
          <Text fontWeight="semibold" fontSize="xl">
            {sec.title}
          </Text>
          {sec.subtitle && 
            <Text mt={1} className="secondary-text" fontSize="md">
              {sec.subtitle}
            </Text>
          }
          <Box mt={6}>
            {sec.items.map((option, index) => (
              <React.Fragment key={index}>
                <SettingsOption
                  title={option.title}
                  description={option.description}
                >
                  {option.component}
                </SettingsOption>
                {index !== sec.items.length - 1 && (
                  <Divider marginY={3} />
                )}
              </React.Fragment>
            ))}
          </Box>
        </React.Fragment>
      )})}
    </>
  );
};

export default AppearanceSettingsPage;