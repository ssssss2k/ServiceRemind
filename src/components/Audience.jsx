import {
  getPublicCopy,
} from '../data/publicTranslations';

export default function Audience({
  language,
}) {
  const copy =
    getPublicCopy(language).service;

  return (
    <section
      id="service"
      className="section service-section"
    >

      <div className="container service-layout">

        <div className="service-copy animate-on-scroll">

          <span className="service-eyebrow">
            {copy.eyebrow}
          </span>

          <h2>
            {copy.title}
          </h2>

          <p>
            {copy.description}
          </p>

        </div>

        <div className="service-panel animate-on-scroll">

          {copy.items.map((item) => (

            <article
              className="service-panel-row"
              key={item.title}
            >

              <span
                className="service-panel-dot"
                aria-hidden="true"
              />

              <div>
                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>
              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}