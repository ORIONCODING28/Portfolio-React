import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import itTranslation from './locales/it.json';
import enTranslation from './locales/en.json';
import { readPreference, writePreference } from '../services/preferencesStorage';
const saved = readPreference('portfolio_language') || readPreference('language');
void i18n.use(initReactI18next).init({
  resources: { it: { translation: itTranslation }, en: { translation: enTranslation } },
  lng: saved?.startsWith('en') ? 'en' : 'it', fallbackLng: 'it', supportedLngs: ['it', 'en'],
  interpolation: { escapeValue: false },
});
i18n.on('languageChanged', language => writePreference('portfolio_language', language));
export default i18n;
