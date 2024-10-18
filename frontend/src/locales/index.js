// src/locales/index.js
import en from './en.json';
import zh_Hans from './zh-Hans.json';
import zh_Hant from './zh-Hant.json';
import { useRouter } from 'next/router';
import i18n from 'i18next';

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
export function detectRouterLocale(router) {
  // const router = useRouter();
  const storedLocale = localStorage.getItem('locale');
  const currentLocale = router.locale;

  const DEFAULT_LOCALE = 'zh-Hans';
  if (currentLocale && currentLocale !== DEFAULT_LOCALE) {
    // If router locale is different from default, apply it and save to localStorage
    i18n.changeLanguage(currentLocale);
    localStorage.setItem('locale', currentLocale);
  } else {
    // If the user explicitly added the default locale in the URL (/zh-Hans/home)
    if (currentLocale === DEFAULT_LOCALE && router.asPath.includes(`/${DEFAULT_LOCALE}/`)) {
      i18n.changeLanguage(DEFAULT_LOCALE);
      localStorage.setItem('locale', DEFAULT_LOCALE);
    } else if (storedLocale) {
      // Otherwise use the locale from localStorage
      i18n.changeLanguage(storedLocale);
    } else {
      i18n.changeLanguage(DEFAULT_LOCALE);
      localStorage.setItem('locale', DEFAULT_LOCALE);
    }
  }
}

// Function to save i18n language changes to localStorage
export function saveLocaleOnChange() {
  i18n.on('languageChanged', (lang) => {
    localStorage.setItem('locale', lang);
  });
}