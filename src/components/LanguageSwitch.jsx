export default function LanguageSwitch({ language, onLanguageChange }) {
  const languages = ['est', 'eng', 'rus'];

  return (
    <div className="lang-switch">
      {languages.map((lang, index) => (
        <span key={lang} className="lang-option">
          <button
            type="button"
            className={language === lang ? 'lang-button active' : 'lang-button'}
            onClick={() => onLanguageChange(lang)}
          >
            {lang.toUpperCase()}
          </button>
          {index < languages.length - 1 && <span className="divider">|</span>}
        </span>
      ))}
    </div>
  );
}
