import { useEffect, useState } from 'react';
import { translations } from '../data/translations';

const supportedLanguages = ['est', 'eng', 'rus'];
const htmlLangMap = { est: 'et', eng: 'en', rus: 'ru' };

export function useLanguage() {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('siteLang');
    return supportedLanguages.includes(savedLanguage) ? savedLanguage : 'eng';
  });

  useEffect(() => {
    localStorage.setItem('siteLang', language);
    document.documentElement.lang = htmlLangMap[language];
  }, [language]);

  return {
    language,
    setLanguage,
    t: translations[language],
  };
}
