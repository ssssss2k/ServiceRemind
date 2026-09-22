import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PolicyPage({ type, t, language, onLanguageChange, onContactClick }) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? t.privTitle : t.termsTitle;
  const description = isPrivacy ? t.privDesc : t.termsDesc;

  const handleContactClick = () => {
    const footer = document.getElementById('contact');
    footer?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Open the same contact form used in the footer after the scroll begins.
    window.setTimeout(() => onContactClick(), 300);
  };

  return (
    <>
      <Header
        t={t}
        language={language}
        onLanguageChange={onLanguageChange}
        variant="policy"
      />

      <main className="container policy-page">
        <h1>{title}</h1>
        <p className="policy-description">{description}</p>
        <p className="policy-contact-row">
          {t.policyContact}{' '}
          <button type="button" className="policy-contact-link" onClick={handleContactClick}>
            info.serviceremind@gmail.com
          </button>
        </p>

        <Link to="/" className="policy-home-link" aria-label={t.btnBack}>
          <span className="policy-home-arrow" aria-hidden="true">‹</span>
          <span>{t.btnBackText}</span>
        </Link>
      </main>

      <Footer t={t} onContactClick={onContactClick} />
    </>
  );
}
