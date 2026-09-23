import Header
  from '../components/Header';

import Footer
  from '../components/Footer';

import {
  getPricingCopy,
} from '../data/pricingTranslations';


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
        onLanguageChange={
          onLanguageChange
        }
        variant="pricing"
      />


      <main className="sr-pricing-page">


        {/* HERO */}

        <section className="sr-pricing-hero">

          <div className="container">

            <span className="sr-pricing-eyebrow">
              {copy.eyebrow}
            </span>


            <h1>
              {copy.title}
            </h1>


            <p>
              {copy.description}
            </p>


            <button
              type="button"
              className="sr-pricing-main-button"
              onClick={onContactClick}
            >
              {copy.heroButton}
            </button>

          </div>

        </section>



        {/* PLANS */}

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

              {copy.plans.map(
                (plan) => (

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

                )
              )}

            </div>

          </div>

        </section>



        {/* INCLUDED */}

        <section className="sr-pricing-included">

          <div
            className="container sr-pricing-split"
          >

            <div className="sr-pricing-split-title">

              <span>
                {copy.includedEyebrow}
              </span>


              <h2>
                {copy.includedTitle}
              </h2>

            </div>


            <div className="sr-pricing-info-list">

              {copy.included.map(
                (item) => (

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

                )
              )}

            </div>

          </div>

        </section>



        {/* CONNECTION */}

        <section className="sr-pricing-connect">

          <div
            className="container sr-pricing-split"
          >

            <div className="sr-pricing-split-title">

              <span>
                {copy.connectEyebrow}
              </span>


              <h2>
                {copy.connectTitle}
              </h2>

            </div>


            <div className="sr-pricing-info-list">

              {copy.connectItems.map(
                (item) => (

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

                )
              )}

            </div>

          </div>

        </section>



        {/* FINAL CTA */}

        <section className="sr-pricing-final">

          <div className="container">

            <div className="sr-pricing-final-inner">

              <div>

                <h2>
                  {copy.finalTitle}
                </h2>


                <p>
                  {copy.finalDescription}
                </p>

              </div>


              <button
                type="button"
                onClick={onContactClick}
              >
                {copy.finalButton}
              </button>

            </div>

          </div>

        </section>


      </main>


      <Footer t={t} />

    </>
  );
}