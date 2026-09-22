import Header from '../components/Header';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function PricingPage({ t, language, onLanguageChange, onContactClick }) {
  return (
    <>
      <Header t={t} language={language} onLanguageChange={onLanguageChange} variant="policy" />
      <main className="pricing-page-shell">
        <section className="section pricing-page-hero">
          <div className="container pricing-page-copy">
            <span className="section-kicker">{t.titleHinnad}</span>
            <h1>{t.pricingPageTitle}</h1>
            <p>{t.pricingPageDesc}</p>
          </div>
        </section>
        <Pricing t={t} onLeadClick={onContactClick} />
      </main>
      <Footer t={t} onLeadClick={onContactClick} />
    </>
  );
}
