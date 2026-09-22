export default function Stats({ t }) {
  const stats = [
    [t.statValue1 || '1', t.stat1],
    [t.statValue2 || '~2 min', t.stat2],
    [t.statValue3 || '24/7', t.stat3],
  ];

  return (
    <section className="stats-section">
      <div className="container stats-grid">
        {stats.map(([value, label]) => (
          <div className="stat-item animate-on-scroll" key={value}>
            <div className="stat-num">{value}</div>
            <div className="stat-text">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
