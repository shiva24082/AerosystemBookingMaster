import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import en from './locales/en.json';
import gu from './locales/gu.json';
import hi from './locales/hi.json';
import ka from './locales/ka.json';
import ma from './locales/ma.json';
import pu from './locales/pu.json';
import ta from './locales/ta.json';
import te from './locales/te.json';

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier;

const languageCode = deviceLanguage ? deviceLanguage.split('_')[0] : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    gu: { translation: gu },
    hi: { translation: hi },
    ka: { translation: ka },
    ma: { translation: ma },
    pu: { translation: pu },
    ta: { translation: ta },
    te: { translation: te },
  },
  lng: languageCode,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
