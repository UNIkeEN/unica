// src/locales/index.js
import en from './en.json';
import zh_Hans from './zh-Hans.json';
import zh_Hant from './zh-Hant.json';
import { useRouter } from 'next/router';
import i18n from 'i18next';
import i18nConfig from '@/../next-i18next.config.mjs';

export const localeResources = {
  "en": {
    translation: en,
  },
  "zh-Hans": {
    translation: zh_Hans,
  },
  "zh-Hant": {
    translation: zh_Hant,
  },
};

// Function to detect and apply router locale
export function changeLanguageWithRouter(router) {
  // const router = useRouter();
  const storedLocale = localStorage.getItem('locale');
  const currentLocale = router.locale;

  const DEFAULT_LOCALE = i18nConfig.defaultLocale;
  if (currentLocale && currentLocale !== DEFAULT_LOCALE) {
    // If router locale is different from default, apply it and save to localStorage
    changeLanguage(currentLocale);
  } else {
    // If the user explicitly added the default locale in the URL (/zh-Hans/home)
    if (currentLocale === DEFAULT_LOCALE && router.asPath.includes(`/${DEFAULT_LOCALE}/`)) {
      changeLanguage(DEFAULT_LOCALE);
    } else if (storedLocale) {
      // Otherwise use the locale from localStorage
      changeLanguage(storedLocale);
    } else {
      changeLanguage(DEFAULT_LOCALE);
    }
  }
}

// Function to save i18n language changes to localStorage
export function changeLanguage(lang) {
  i18n.changeLanguage(lang);
  localStorage.setItem('locale', lang);
}