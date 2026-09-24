import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import {
  getPricingCopy,
} from '../data/pricingTranslations';

function InfoList({ items }) {
  return (
    <div className="sr-pricing-info-list">

      {items.map((item) => (
        <article
          className="sr-pricing-info-row"
          key={item.title}
        >
          <h3>
            {item.title}
          </h3>

          <p>
            {item.description}
          </p>
        </article>
      ))}

    </div>
  );
}

export default function PricingPage({
  t,
  language,
  onLanguageChange,
  onContactClick,
}) {
  const copy =
    getPricingCopy(language);

  return (
    <>
      <Header
        t={t}
        language={language}
        onLanguageChange={onLanguageChange}
        variant="pricing"
      />

      <main className="sr-pricing-page">

        <section className="sr-pricing-hero">

          <div className="container">

            <span className="sr-pricing-eyebrow">
              {copy.eyebrow}
            </span>

            <h1>
              {copy.titleLines.map(
                (line) => (
                  <span key={line}>
                    {line}
                  </span>
                )
              )}
            </h1>

            <p>
              {copy.description}
            </p>

            <div className="sr-pricing-hero-actions">

              <button
                type="button"
                className="sr-pricing-main-button"
                onClick={onContactClick}
              >
                {copy.heroButton}
              </button>

              <Link
                className="sr-pricing-back-button"
                to="/"
              >
                {copy.backButton}
              </Link>

            </div>

          </div>

        </section>


        <section className="sr-pricing-plans">

          <div className="container">

            <div className="sr-pricing-section-heading">

              <span>
                {copy.plansEyebrow}
              </span>

              <h2>
                {copy.plansTitle}
              </h2>

            </div>

            <div className="sr-pricing-plan-grid">

              {copy.plans.map((plan) => (

                <article
                  className="sr-pricing-plan"
                  key={plan.name}
                >

                  <div>

                    <h3>
                      {plan.name}
                    </h3>

                    <div className="sr-pricing-plan-price">
                      {plan.price}
                    </div>

                    <p>
                      {plan.description}
                    </p>

                  </div>

                  <div className="sr-pricing-plan-bottom">

                    <span>
                      {plan.note}
                    </span>

                    <button
                      type="button"
                      onClick={onContactClick}
                    >
                      {plan.button}
                    </button>

                  </div>

                </article>

              ))}

            </div>

          </div>

        </section>


        <section className="sr-pricing-included">

          <div className="container sr-pricing-split">

            <div className="sr-pricing-split-title">

              <span>
                {copy.includedEyebrow}
              </span>

              <h2>
                {copy.includedTitle}
              </h2>

            </div>

            <InfoList
              items={copy.included}
            />

          </div>

        </section>


        <section className="sr-pricing-connect">

          <div className="container sr-pricing-split">

            <div className="sr-pricing-split-title">

              <span>
                {copy.connectEyebrow}
              </span>

              <h2>
                {copy.connectTitle}
              </h2>

            </div>

            <InfoList
              items={copy.connectItems}
            />

          </div>

        </section>

      </main>

      <Footer
        t={t}
        onContactClick={onContactClick}
      />

    </>
  );
}