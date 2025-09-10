import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationJa from "./public/locales/ja/translation.json";
import translationEn from "./public/locales/en/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    ja: {
      translation: translationJa,
    },
    en: {
      translation: translationEn,
    },
  },
  lng: "ja", // デフォルト言語
  fallbackLng: "ja", // フォールバック言語
  interpolation: {
    escapeValue: false, // Reactなのでエスケープ不要
  },
});

export default i18n;
