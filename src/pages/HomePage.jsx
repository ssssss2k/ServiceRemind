import Header
  from '../components/Header';

import Hero
  from '../components/Hero';

import Audience
  from '../components/Audience';

import RoleSection
  from '../components/RoleSection';

import Footer
  from '../components/Footer';


export default function HomePage({
  t,
  language,
  onLanguageChange,
  onContactClick,
}) {
  return (
    <>

      <Header
        t={t}
        language={language}
        onLanguageChange={
          onLanguageChange
        }
      />


      <main>

        <Hero
          language={language}
          onLeadClick={
            onContactClick
          }
        />


        <Audience
          language={language}
        />


        <RoleSection
          language={language}
        />

      </main>


      <Footer
        t={t}
        language={language}
        onLeadClick={
          onContactClick
        }
      />

    </>
  );
}