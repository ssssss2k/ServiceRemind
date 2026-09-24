import {
  getPublicCopy,
} from '../data/publicTranslations';

export default function Hero({
  language,
  onLeadClick,
}) {
  const copy =
    getPublicCopy(language).hero;

  return (
    <section className="landing-hero">

      <div className="hero container">

        <div className="hero-content">

          <h1
            className={
              `hero-title hero-title-${language}`
            }
          >
            {copy.lines.map((line) => (
              <span key={line}>
                {line}
              </span>
            ))}
          </h1>

          <p>
            {copy.description}
          </p>

          <div className="hero-buttons">

            <button
              type="button"
              className="btn hero-primary-btn"
              onClick={onLeadClick}
            >
              {copy.contact}
            </button>

            <a
              className="btn hero-secondary-btn"
              href="#service"
            >
              {copy.service}
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}