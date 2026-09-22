import { Link } from 'react-router-dom';

export default function Footer({ t, onLeadClick }) {
  return (
    <footer id="contact" className="footer-dark footer-compact">
      <div className="container">
        <div className="contact-row footer-contact-row">
          <span className="email-plain">info.serviceremind@gmail.com</span>
          <button type="button" className="btn-pill footer-lead-btn" onClick={onLeadClick}>{t.footerBtn}</button>
        </div>
        <div className="footer-bottom">
          <p>© 2026 ServiceRemind.ee</p>
          <div className="footer-links">
            <Link to="/privacy">{t.linkPrivacy}</Link>
            <Link to="/terms">{t.linkTerms}</Link>
          </div>
        </div>
        <div className="huge-brand-text"><span>ServiceRemind.</span></div>
      </div>
    </footer>
  );
}
