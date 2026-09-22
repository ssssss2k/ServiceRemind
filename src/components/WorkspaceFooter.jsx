import { Link } from 'react-router-dom';

export default function WorkspaceFooter({ workCopy, onFeedback }) {
  return (
    <footer className="footer-dark workspace-footer workspace-footer-clean workspace-footer-minimal">
      <div className="container workspace-footer-inner">
        <div className="workspace-footer-top">
          <div>
            <div className="footer-brand">Workspace</div>
            <p className="footer-minimal-copy">{workCopy.feedbackFooterText}</p>
          </div>
          <button type="button" className="btn-pill workspace-feedback-btn" onClick={onFeedback}>{workCopy.sendFeedback}</button>
        </div>
        <div className="footer-bottom workspace-footer-bottom">
          <p>© 2026 ServiceRemind.ee</p>
          <div className="footer-links">
            <Link to="/privacy">{workCopy.privacyPolicy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
