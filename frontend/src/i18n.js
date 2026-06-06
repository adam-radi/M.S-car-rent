import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const applyDocumentLanguage = (lng) => {
  const code = (lng || 'en').split('-')[0];
  document.documentElement.lang = code;
  // Keep layout structure always LTR - only translate the text string contents
  document.documentElement.dir = 'ltr';
  document.body.classList.remove('rtl');
  document.documentElement.classList.remove('lang-en', 'lang-fr', 'lang-ar');
  document.body.classList.remove('lang-en', 'lang-fr', 'lang-ar');
  document.documentElement.classList.add(`lang-${code}`);
  document.body.classList.add(`lang-${code}`);
};

i18n.on('languageChanged', applyDocumentLanguage);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'ar'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })
  .then(() => {
    applyDocumentLanguage(i18n.language);
  });

export default i18n;
