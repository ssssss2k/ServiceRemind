import Header from '../components/Header';
import Hero from '../components/Hero';
import Audience from '../components/Audience';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

export default function HomePage({ t, language, onLanguageChange, onContactClick }) {
  return (
    <>
      <Header t={t} language={language} onLanguageChange={onLanguageChange} />
      <main>
        <Hero t={t} onLeadClick={onContactClick} />
        <Audience t={t} />
        <HowItWorks t={t} />
      </main>
      <Footer t={t} onLeadClick={onContactClick} />
    </>
  );
}
