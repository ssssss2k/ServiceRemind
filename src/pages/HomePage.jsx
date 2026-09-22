import Header from '../components/Header';
import Hero from '../components/Hero';
import Audience from '../components/Audience';
import HowItWorks from '../components/HowItWorks';
import WorkflowShowcase from '../components/WorkflowShowcase';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function HomePage({ t, language, onLanguageChange, onContactClick }) {
  return (
    <>
      <Header t={t} language={language} onLanguageChange={onLanguageChange} />
      <main>
        <Hero t={t} onLeadClick={onContactClick} />
        <Audience t={t} />
        <HowItWorks t={t} />
        <WorkflowShowcase t={t} />
        <Pricing t={t} onLeadClick={onContactClick} />
      </main>
      <Footer t={t} onLeadClick={onContactClick} />
    </>
  );
}
