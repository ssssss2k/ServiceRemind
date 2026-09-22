export default function Hero({ t, onLeadClick }) {
  return (
    <section className="hero container">
      <div className="hero-content">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroDesc}</p>
        <div className="hero-buttons">
          <button type="button" className="btn btn-black" onClick={onLeadClick}>{t.heroBtn}</button>
        </div>
      </div>
    </section>
  );
}
