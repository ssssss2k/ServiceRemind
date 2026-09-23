import {
  Link,
} from 'react-router-dom';


export default function Footer({
  t,
}) {
  return (
    <footer
      id="contact"
      className="sr-footer"
    >

      <div className="container sr-footer-inner">


        <div className="sr-footer-email">

          <a
            href="mailto:info.serviceremind@gmail.com"
          >
            info.serviceremind@gmail.com
          </a>

        </div>


        <div
          className="sr-footer-divider"
          aria-hidden="true"
        />


        <div className="sr-footer-bottom">

          <p>
            © 2026 ServiceRemind.ee
          </p>


          <nav className="sr-footer-links">

            <Link to="/privacy">
              {t?.linkPrivacy || 'Privacy Policy'}
            </Link>


            <Link to="/terms">
              {t?.linkTerms || 'Terms of Use'}
            </Link>

          </nav>

        </div>


      </div>

    </footer>
  );
}