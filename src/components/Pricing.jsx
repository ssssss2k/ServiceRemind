export default function Pricing({ t, onLeadClick }) {
  return (
    <section id="pricing" className="section">
      <div className="container">
        <h2 className="section-title">{t.titleHinnad}</h2>
        <div className="pricing-grid">
          <div className="pricing-card animate-on-scroll">
            <h3>{t.priceH1}</h3><div className="price">{t.priceVal1}</div><p>{t.priceP1}</p>
            <button type="button" className="btn btn-black pricing-btn" onClick={onLeadClick}>{t.priceBtn1}</button>
          </div>
          <div className="pricing-card animate-on-scroll">
            <h3>{t.priceH2}</h3><div className="price">{t.priceVal2}</div><p>{t.priceP2}</p>
            <button type="button" className="btn btn-black pricing-btn" disabled>{t.priceBtn2}</button>
          </div>
          <div className="pricing-card animate-on-scroll">
            <h3>{t.priceH3}</h3><div className="price">{t.priceVal3}</div><p>{t.priceP3}</p>
            <button type="button" className="btn btn-black pricing-btn" disabled>{t.priceBtn3}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
