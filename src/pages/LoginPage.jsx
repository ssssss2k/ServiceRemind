import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import { EyeIcon, EyeOffIcon } from '../components/WorkspaceIcons';

export default function LoginPage({ t, language, onLanguageChange }) {
  const { isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/workspace'} replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const session = login(email, password);

    if (session) {
      const destination = location.state?.from || (session.role === 'admin' ? '/admin' : '/workspace');
      navigate(destination, { replace: true });
      return;
    }

    setError(t.authError);
    setSubmitting(false);
  };

  return (
    <>
      <Header
        t={t}
        language={language}
        onLanguageChange={onLanguageChange}
        variant="auth"
        showLogin={false}
      />

      <main className="auth-page">
        <section className="auth-card" aria-labelledby="login-heading">
          <Link className="auth-close" to="/" aria-label={t.authBackAria}>×</Link>
          <h1 id="login-heading">{t.loginTitle}</h1>
          <p className="auth-description">{t.authDescription}</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>{t.authEmail}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                placeholder="owner@serviceremind.ee"
                required
              />
            </label>

            <label className="auth-field">
              <span>{t.authPassword}</span>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle password-toggle-icon"
                  aria-label={showPassword ? t.authHide : t.authShow}
                  title={showPassword ? t.authHide : t.authShow}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </label>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? t.authSigningIn : t.login}
            </button>
          </form>

        </section>
      </main>
    </>
  );
}
