import {
  useEffect,
  useState,
} from 'react';

import {
  translations,
} from '../data/translations';


const DEFAULT_LANGUAGE =
  'eng';


const SUPPORTED_LANGUAGES = [
  'est',
  'eng',
  'rus',
];


const HTML_LANG = {
  est: 'et',
  eng: 'en',
  rus: 'ru',
};


export function useLanguage() {
  const [
    language,
    setLanguage,
  ] = useState(() => {

    const saved =
      localStorage.getItem(
        'siteLang'
      );


    return SUPPORTED_LANGUAGES.includes(
      saved
    )
      ? saved
      : DEFAULT_LANGUAGE;

  });


  useEffect(() => {

    localStorage.setItem(
      'siteLang',
      language
    );


    document.documentElement.lang =
      HTML_LANG[language]
      || 'en';

  }, [language]);


  return {
    language,
    setLanguage,
    t: translations[language],
  };
}