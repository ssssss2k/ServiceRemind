import { Link } from 'react-router-dom';
export default function WorkspaceFooter({ workCopy, onFeedback }) {
  return (
    <footer className="footer-dark workspace-footer workspace-footer-clean"><div className="container">
      <div className="workspace-footer-brand-row"><div className="huge-brand-text workspace-huge-brand"><span>ServiceRemind.</span></div><button type="button" className="btn-pill workspace-feedback-btn" onClick={onFeedback}>{workCopy.sendFeedback}</button></div>
      <div className="footer-bottom workspace-footer-bottom"><p>© 2026 ServiceRemind.ee</p><div className="footer-links"><Link to="/privacy">{workCopy.privacyPolicy}</Link><Link to="/terms">{workCopy.termsOfUse}</Link></div></div>
    </div></footer>
  );
}
