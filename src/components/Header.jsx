import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LanguageSwitch from './LanguageSwitch';
import { UserIcon } from './WorkspaceIcons';

export default function Header({
  t,
  language,
  onLanguageChange,
  variant = 'landing',
  showLogin = true,
  rightAction = null,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const isLanding = variant === 'landing';
  const logoTarget = variant === 'portal' ? '/dashboard' : '/';
  const accountTarget = isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/login';
  const accountLabel = isAuthenticated ? user?.name || (t.workspace || 'Workspace') : t.login;

  const AccountLink = () => (
    <Link className="login-btn account-entry-btn desktop-login-btn" to={accountTarget}>
      <span className="account-entry-icon"><UserIcon size={17} /></span>
      <span>{accountLabel}</span>
    </Link>
  );

  return (
    <header className="navbar">
      <div className="container nav-container">
        <div className="nav-left">
          {isLanding && (
            <>
              <button
                className={menuOpen ? 'hamburger-btn open' : 'hamburger-btn'}
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((isOpen) => !isOpen)}
              >
                <span></span><span></span><span></span>
              </button>

              <nav className={menuOpen ? 'nav-links active' : 'nav-links'}>
                <Link className="mobile-logo" to="/" onClick={closeMenu}>ServiceRemind</Link>
                <a href="#for-whom" onClick={closeMenu}>{t.nav[0]}</a>
                <span className="nav-divider" aria-hidden="true" />
                <a href="#how-it-works" onClick={closeMenu}>{t.nav[1]}</a>
                <span className="nav-divider" aria-hidden="true" />
                <a href="#pricing" onClick={closeMenu}>{t.nav[2]}</a>
                <span className="nav-divider" aria-hidden="true" />
                <a href="#contact" onClick={closeMenu}>{t.nav[3]}</a>
              </nav>
            </>
          )}
        </div>

        <div className="nav-center">
          <Link to={logoTarget} className="logo">ServiceRemind</Link>
        </div>

        <div className="nav-right">
          <LanguageSwitch language={language} onLanguageChange={onLanguageChange} />
          {showLogin && <AccountLink />}
          {rightAction}
        </div>
      </div>
    </header>
  );
}
