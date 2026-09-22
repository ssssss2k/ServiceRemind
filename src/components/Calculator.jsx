import { useState } from 'react';

export default function Calculator({ t }) {
  const [clients, setClients] = useState(100);
  const returnedClients = Math.round(clients * 0.15);
  const extraRevenue = returnedClients * 50;

  return (
    <section id="calculator" className="section section-light">
      <div className="container">
        <h2 className="section-title">{t.calcTitle}</h2>
        <div className="calculator-box animate-on-scroll">
          <div className="calc-controls">
            <label htmlFor="clientsRange">
              <span>{t.calcLabel}</span> <span>{clients}</span>
            </label>
            <input
              type="range"
              id="clientsRange"
              min="20"
              max="500"
              step="10"
              value={clients}
              onChange={(event) => setClients(Number(event.target.value))}
            />
          </div>

          <div className="calc-results">
            <div className="calc-result-item">
              <span>{t.calcRes1}</span>
              <strong>~{returnedClients} {t.clientWord}</strong>
            </div>
            <div className="calc-result-item highlight">
              <span>{t.calcRes2}</span>
              <strong>{extraRevenue} €</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
