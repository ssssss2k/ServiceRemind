import { useEffect, useState } from 'react';
import { translations } from '../data/translations';

const supportedLanguages = ['est', 'eng', 'rus'];
const htmlLangMap = { est: 'et', eng: 'en', rus: 'ru' };
const LANGUAGE_STORAGE_KEY = 'siteLang_v90';

export function useLanguage() {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return supportedLanguages.includes(savedLanguage) ? savedLanguage : 'eng';
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = htmlLangMap[language];
  }, [language]);

  return {
    language,
    setLanguage,
    t: translations[language],
  };
}
