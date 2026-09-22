import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const privacySections = [
  ['Information we collect', 'We may collect contact details, workshop details, booking information, vehicle data, service history and messages sent through the site.'],
  ['How we use the data', 'The information is used to organise work, improve the product, respond to enquiries and prepare the pilot version for real customer usage.'],
  ['Workshop records', 'Bookings, client details and vehicle history are stored so the team can work faster and see the context of each visit.'],
  ['Communication', 'If you contact us, we may use the provided email or phone number to answer your request and continue the discussion.'],
  ['Analytics and improvement', 'We may review anonymised usage patterns to understand which screens, actions and workflows should be improved first.'],
  ['Data sharing', 'We do not plan to sell user data. Limited sharing may happen only with technical providers needed to host forms, infrastructure or authentication.'],
  ['Storage period', 'Pilot data is kept for as long as it is useful for product testing, legal obligations or agreed collaboration with the workshop.'],
  ['Security approach', 'We aim to protect stored information with sensible access control, secure authentication and principle-of-least-access improvements over time.'],
  ['Pilot limitations', 'This current version is still a prototype, so wording and technical details may change as the platform moves into production.'],
  ['Your choices', 'You can contact us if you want to correct details, ask questions or request removal of information that is no longer needed.'],
  ['Cross-border access', 'Because the service may be developed and tested by distributed teams, technical access can involve systems located in different regions.'],
  ['Contact', 'For any privacy-related question, the easiest first step is to contact us by email and describe the issue clearly.'],
];

const termsSections = [
  ['Pilot access', 'ServiceRemind is currently offered as a pilot product and some features, layouts and flows may change without notice.'],
  ['Intended use', 'The platform is meant to help workshops manage bookings, clients, vehicles, service records and internal work processes.'],
  ['Accounts', 'Users are responsible for keeping their account access secure and for using the workspace in a reasonable and lawful way.'],
  ['Content entered by users', 'You are responsible for the correctness of workshop data, customer details, notes and service records entered into the system.'],
  ['Availability', 'We aim to keep the product available, but pilot software may occasionally be offline, incomplete or updated abruptly.'],
  ['Feature changes', 'We may add, remove, rename or redesign features as we learn from real workshop use and continue product development.'],
  ['Feedback', 'If you share product ideas or bug reports, we may use them to improve the service without owing compensation.'],
  ['Intellectual property', 'The software, brand, interface and original product materials remain part of ServiceRemind unless stated otherwise.'],
  ['Acceptable conduct', 'Do not misuse the service, interfere with the product or attempt to gain unauthorised access to data or systems.'],
  ['Limitation of liability', 'Because this is a pilot, the service is provided on a best-effort basis and should be reviewed by each workshop before operational reliance.'],
  ['Termination', 'We may suspend pilot access if the service is misused, if testing ends or if access conditions change.'],
  ['Contact and updates', 'These terms are a working draft and may be updated as the product becomes a full SaaS platform.'],
];

export default function PolicyPage({ type, t, language, onLanguageChange, onContactClick }) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? t.privTitle : t.termsTitle;
  const description = isPrivacy ? t.privDesc : t.termsDesc;
  const sections = isPrivacy ? privacySections : termsSections;

  return (
    <>
      <Header
        t={t}
        language={language}
        onLanguageChange={onLanguageChange}
        variant="policy"
      />

      <main className="container policy-page policy-page-rich">
        <div className="policy-hero-card">
          <span className="section-kicker">{isPrivacy ? t.linkPrivacy : t.linkTerms}</span>
          <h1>{title}</h1>
          <p className="policy-description">{description}</p>
          <div className="policy-contact-row">
            <span>{t.policyContact}</span>
            <button type="button" className="policy-contact-link" onClick={onContactClick}>
              info.serviceremind@gmail.com
            </button>
          </div>
        </div>

        <div className="policy-sections-grid">
          {sections.map(([heading, body], index) => (
            <section key={heading} className="policy-section-card">
              <span className="policy-section-index">{String(index + 1).padStart(2, '0')}</span>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>

        <Link to="/" className="policy-home-link" aria-label={t.btnBack}>
          <span className="policy-home-arrow" aria-hidden="true">‹</span>
          <span>{t.btnBackText}</span>
        </Link>
      </main>

      <Footer t={t} onLeadClick={onContactClick} />
    </>
  );
}
