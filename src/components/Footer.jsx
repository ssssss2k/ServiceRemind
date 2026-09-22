import { Link } from 'react-router-dom';

export default function Footer({ t, onLeadClick }) {
  return (
    <footer id="contact" className="footer-dark footer-compact footer-minimal">
      <div className="container footer-minimal-inner">
        <div className="footer-minimal-top">
          <div>
            <div className="footer-brand">ServiceRemind</div>
            <p className="footer-minimal-copy">{t.footerMiniText}</p>
          </div>
          <button type="button" className="btn-pill footer-lead-btn" onClick={onLeadClick}>{t.footerBtn}</button>
        </div>
        <div className="footer-bottom footer-bottom-minimal">
          <p>© 2026 ServiceRemind.ee</p>
          <div className="footer-links">
            <Link to="/privacy">{t.linkPrivacy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
