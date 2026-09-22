
export default function Hero({ t, onLeadClick }) {
  return (
    <section className="hero container">
      <div className="hero-content">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroDesc}</p>
        <div className="hero-buttons hero-buttons-dual">
          <button type="button" className="btn btn-black hero-primary-btn" onClick={onLeadClick}>{t.heroBtn}</button>
          <a href="#services" className="btn btn-light hero-secondary-btn">{t.heroSecondaryBtn}</a>
        </div>
      </div>
    </section>
  );
}
