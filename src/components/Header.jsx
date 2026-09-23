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
      xmlns="http://www.w3.org/2000/svg"
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
  const [menuOpen, setMenuOpen] =
    useState(false);

  const {
    isAuthenticated,
    user,
  } = useAuth();

  const location =
    useLocation();

  const copy =
    getPublicCopy(language);


  useEffect(() => {
    document.body.style.overflow =
      menuOpen
        ? 'hidden'
        : '';

    return () => {
      document.body.style.overflow =
        '';
    };
  }, [menuOpen]);


  const closeMenu = () =>
    setMenuOpen(false);


  const showPublicNavigation =
    variant === 'landing'
    || variant === 'pricing';


  const logoTarget =
    variant === 'portal'
      ? '/dashboard'
      : '/';


  const accountTarget =
    isAuthenticated
      ? user?.role === 'admin'
        ? '/admin'
        : '/dashboard'
      : '/login';


  const accountLabel =
    isAuthenticated
      ? user?.name
        || t.workspace
        || 'Workspace'
      : t.login;


  const serviceHref =
    location.pathname === '/'
      ? '#service'
      : '/#service';


  const AccountLink = () => (
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
  );


  return (
    <header className="navbar">

      <div className="container nav-container">

        <div className="nav-left">

          {showPublicNavigation && (
            <>

              <button
                className={
                  menuOpen
                    ? 'hamburger-btn open'
                    : 'hamburger-btn'
                }
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() =>
                  setMenuOpen(
                    (isOpen) => !isOpen
                  )
                }
              >
                <span />
                <span />
                <span />
              </button>


              <nav
                className={
                  menuOpen
                    ? 'nav-links active'
                    : 'nav-links'
                }
              >

                <Link
                  className="mobile-logo"
                  to="/"
                  onClick={closeMenu}
                >
                  ServiceRemind
                </Link>


                <a
                  href={serviceHref}
                  onClick={closeMenu}
                >
                  {copy.nav.service}
                </a>


                <Link
                  to="/pricing"
                  onClick={closeMenu}
                >
                  {copy.nav.pricing}
                </Link>


                <a
                  href="#contact"
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
            onLanguageChange={
              onLanguageChange
            }
          />


          {showLogin && (
            <AccountLink />
          )}


          {rightAction}

        </div>

      </div>

    </header>
  );
}