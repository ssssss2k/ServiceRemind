import {
  getPublicCopy,
} from '../data/publicTranslations';


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

          <article className="role-column">

            <span className="role-label">
              {copy.owner.label}
            </span>

            <h3>
              {copy.owner.title}
            </h3>

            <p className="role-description">
              {copy.owner.description}
            </p>

            <div className="role-feature-list">

              {copy.owner.items.map(
                (item) => (
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
                )
              )}

            </div>

          </article>


          <article className="role-column">

            <span className="role-label">
              {copy.mechanic.label}
            </span>

            <h3>
              {copy.mechanic.title}
            </h3>

            <p className="role-description">
              {copy.mechanic.description}
            </p>

            <div className="role-feature-list">

              {copy.mechanic.items.map(
                (item) => (
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
                )
              )}

            </div>

          </article>

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