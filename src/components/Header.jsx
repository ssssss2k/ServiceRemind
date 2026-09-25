import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { getPublicCopy } from '../data/publicTranslations';

import LanguageSwitch from './LanguageSwitch';

function LoginUserIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="9.5"
        r="6"
        stroke="currentColor"
        strokeWidth="2.2"
      />

      <path
        d="M5.5 26.5C7 20.1 10.8 17 16 17C21.2 17 25 20.1 26.5 26.5H5.5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header({
  t,
  language,
  onLanguageChange,
  variant = 'landing',
  showLogin = true,
  rightAction = null,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    isAuthenticated,
    user,
  } = useAuth();

  const location = useLocation();
  const copy = getPublicCopy(language);

  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const showPublicNavigation =
    variant === 'landing'
    || variant === 'pricing';

  const logoTarget =
    variant === 'portal'
      ? '/dashboard'
      : '/';

  const accountTarget = isAuthenticated
    ? user?.role === 'admin'
      ? '/admin'
      : '/dashboard'
    : '/login';

  const accountLabel = isAuthenticated
    ? user?.name || t.workspace || 'Workspace'
    : t.login;

  const activeNav =
    location.hash === '#service'
      ? 'service'
      : location.hash === '#contact'
        ? 'contact'
        : location.pathname === '/pricing'
          ? 'pricing'
          : null;

  const navClass = (name) => {
    return `nav-link${activeNav === name ? ' active' : ''}`;
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-container">

        <div className="nav-left">
          {showPublicNavigation && (
            <>
              <button
                className={`hamburger-btn${menuOpen ? ' open' : ''}`}
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((current) => !current)}
              >
                <span />
                <span />
                <span />
              </button>

              <nav
                className={`nav-links${menuOpen ? ' active' : ''}`}
              >
                <Link
                  className="mobile-logo"
                  to="/"
                  onClick={closeMenu}
                >
                  ServiceRemind
                </Link>

                <Link
                  className={navClass('service')}
                  to="/#service"
                  aria-current={
                    activeNav === 'service'
                      ? 'page'
                      : undefined
                  }
                  onClick={closeMenu}
                >
                  {copy.nav.service}
                </Link>

                <Link
                  className={navClass('pricing')}
                  to="/pricing"
                  aria-current={
                    activeNav === 'pricing'
                      ? 'page'
                      : undefined
                  }
                  onClick={closeMenu}
                >
                  {copy.nav.pricing}
                </Link>

                <a
                  className={navClass('contact')}
                  href="#contact"
                  aria-current={
                    activeNav === 'contact'
                      ? 'page'
                      : undefined
                  }
                  onClick={closeMenu}
                >
                  {copy.nav.contact}
                </a>
              </nav>
            </>
          )}
        </div>

        <div className="nav-center">
          <Link
            to={logoTarget}
            className="logo"
          >
            ServiceRemind
          </Link>
        </div>

        <div className="nav-right">
          <LanguageSwitch
            language={language}
            onLanguageChange={onLanguageChange}
          />

          {showLogin && (
            <Link
              className="login-btn account-entry-btn desktop-login-btn"
              to={accountTarget}
              aria-label={accountLabel}
            >
              <span className="account-entry-icon">
                <LoginUserIcon />
              </span>

              <span>
                {accountLabel}
              </span>
            </Link>
          )}

          {rightAction}
        </div>

      </div>
    </header>
  );
}