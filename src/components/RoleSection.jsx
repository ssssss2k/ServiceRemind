import {
  getPublicCopy,
} from '../data/publicTranslations';

function RoleColumn({
  role,
}) {
  return (
    <article className="role-column">

      <span className="role-label">
        {role.label}
      </span>

      <h3>
        {role.title}
      </h3>

      <p className="role-description">
        {role.description}
      </p>

      <div className="role-feature-list">

        {role.items.map((item) => (

          <div
            className="role-feature-row"
            key={item}
          >
            <span
              className="role-feature-dot"
              aria-hidden="true"
            />

            <span>
              {item}
            </span>
          </div>

        ))}

      </div>

    </article>
  );
}

export default function RoleSection({
  language,
}) {
  const copy =
    getPublicCopy(language).roles;

  return (
    <section className="role-section">

      <div className="container">

        <div className="role-section-heading">

          <span className="role-eyebrow">
            {copy.eyebrow}
          </span>

          <h2>
            {copy.title}
          </h2>

        </div>

        <div className="role-columns">

          <RoleColumn
            role={copy.owner}
          />

          <RoleColumn
            role={copy.mechanic}
          />

        </div>

        <div className="role-bottom-line">
          <p>
            {copy.bottom}
          </p>
        </div>

      </div>

    </section>
  );
}