export default function Audience({ t }) {
  const cards = [
    { id: 'service', title: t.kelleleH1, description: t.kelleleP1 },
    { id: 'team', title: t.kelleleH2, description: t.kelleleP2 },
    { id: 'repeat', title: t.audienceCard3H, description: t.audienceCard3P },
    { id: 'day-plan', title: t.audienceCard4H, description: t.audienceCard4P },
    { id: 'history', title: t.audienceCard5H, description: t.audienceCard5P },
    { id: 'overview', title: t.audienceExtraH, description: t.audienceExtraP },
  ].filter((item) => item.title && item.description);

  return (
    <section id="fit" className="section section-light audience-section">
      <div className="container">
        <div className="section-heading-compact audience-heading-clean">
          <span>{t.audienceEyebrow}</span>
          <h2 className="section-title">{t.titleKellele}</h2>
          <p className="section-description audience-description">{t.audienceIntro}</p>
        </div>
        <div className="audience-card-grid">
          {cards.map((card, index) => (
            <article className="audience-card animate-on-scroll" key={card.id}>
              <span className="audience-card-index">{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
