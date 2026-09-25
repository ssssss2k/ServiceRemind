const LANGUAGES = [
  'est',
  'eng',
  'rus',
];


export default function LanguageSwitch({
  language,
  onLanguageChange,
}) {
  return (
    <div
      className="lang-switch"
      aria-label="Language"
    >

      {LANGUAGES.map(
        (lang, index) => (
          <span
            key={lang}
            className="lang-option"
          >

            <button
              type="button"
              className={
                `lang-button${
                  language === lang
                    ? ' active'
                    : ''
                }`
              }
              aria-pressed={
                language === lang
              }
              onClick={() =>
                onLanguageChange(lang)
              }
            >
              {lang.toUpperCase()}
            </button>


            {index < LANGUAGES.length - 1 && (
              <span className="divider">
                |
              </span>
            )}

          </span>
        )
      )}

    </div>
  );
}