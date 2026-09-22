export default function HowItWorks({ t }) {
  const steps = [
    { id: 'step-1', title: t.cardH1, description: t.cardP1 },
    { id: 'step-2', title: t.cardH2, description: t.cardP2 },
    { id: 'step-3', title: t.cardH3, description: t.cardP3 },
  ];

  return (
    <section id="services" className="section how-minimal-section">
      <div className="container how-editorial-layout">
        <div className="section-heading-compact how-editorial-copy">
          <span>{t.howEyebrow}</span>
          <h2 className="section-title">{t.titlePakume}</h2>
          <p className="section-description">{t.howIntro}</p>
        </div>
        <div className="how-editorial-steps">
          {steps.map((step, index) => (
            <article className="how-editorial-step animate-on-scroll" key={step.id}>
              <span className="how-editorial-index">{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
