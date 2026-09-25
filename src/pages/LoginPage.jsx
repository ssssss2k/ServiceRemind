import {
  useState,
} from 'react';

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Footer
  from '../components/Footer';

import LanguageSwitch
  from '../components/LanguageSwitch';

import {
  EyeIcon,
  EyeOffIcon,
} from '../components/WorkspaceIcons';

import {
  useAuth,
} from '../auth/AuthContext';


const LOGIN_COPY = {
  est: {
    home:
      'Tagasi avalehele',

    title:
      'Sisene oma töökeskkonda.',

    intro:
      'Ligipääs autoteeninduse omanikule ja mehaanikutele.',

    detail:
      'Tööplaan, kliendid, autod ja hooldusajalugu on pärast sisselogimist ühes kohas.',

    formTitle:
      'Logi sisse',

    formDescription:
      'Sisesta oma konto andmed.',
  },


  eng: {
    home:
      'Back to home',

    title:
      'Sign in to your workspace.',

    intro:
      'Access for workshop owners and mechanics.',

    detail:
      'Scheduling, customers, vehicles and service history are available in one place after sign-in.',

    formTitle:
      'Log in',

    formDescription:
      'Enter your account details.',
  },


  rus: {
    home:
      'Назад на главную',

    title:
      'Вход в рабочее пространство.',

    intro:
      'Доступ для владельца автосервиса и механиков.',

    detail:
      'Расписание, клиенты, автомобили и история обслуживания доступны в одном месте после входа.',

    formTitle:
      'Вход',

    formDescription:
      'Введите данные своей учётной записи.',
  },
};


export default function LoginPage({
  t,
  language,
  onLanguageChange,
  onContactClick,
}) {
  const {
    isAuthenticated,
    login,
    user,
  } = useAuth();


  const navigate =
    useNavigate();

  const location =
    useLocation();


  const copy =
    LOGIN_COPY[language]
    || LOGIN_COPY.eng;


  const [
    email,
    setEmail,
  ] = useState('');


  const [
    password,
    setPassword,
  ] = useState('');


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState('');


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  if (isAuthenticated) {
    return (
      <Navigate
        to={
          user?.role === 'admin'
            ? '/admin'
            : '/dashboard'
        }
        replace
      />
    );
  }


  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    setError('');
    setSubmitting(true);


    const session =
      login(
        email,
        password
      );


    if (session) {
      const destination =
        location.state?.from
        || (
          session.role === 'admin'
            ? '/admin'
            : '/dashboard'
        );


      navigate(
        destination,
        {
          replace: true,
        }
      );

      return;
    }


    setError(
      t.authError
    );

    setSubmitting(false);
  };


  return (
    <>

      <div className="sr-login-screen">


        <header className="navbar">

          <div className="container nav-container">


            <div className="nav-left">

              <Link
                className="sr-login-home-link"
                to="/"
              >
                {copy.home}
              </Link>

            </div>


            <div className="nav-center">

              <Link
                to="/"
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

            </div>


          </div>

        </header>



        <main className="sr-login-main container">


          <section className="sr-login-intro">

            <span className="sr-login-eyebrow">
              Workspace
            </span>


            <h1>
              {copy.title}
            </h1>


            <p className="sr-login-intro-lead">
              {copy.intro}
            </p>


            <p className="sr-login-intro-detail">
              {copy.detail}
            </p>

          </section>



          <section className="sr-login-form-section">

            <div className="sr-login-form-wrap">


              <div className="sr-login-form-heading">

                <h2>
                  {copy.formTitle}
                </h2>

                <p>
                  {copy.formDescription}
                </p>

              </div>



              <form
                className="sr-login-form"
                onSubmit={
                  handleSubmit
                }
              >


                <label className="sr-login-field">

                  <span>
                    {t.authEmail}
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={
                      (event) =>
                        setEmail(
                          event.target.value
                        )
                    }
                    autoComplete="username"
                    placeholder="name@workshop.ee"
                    required
                  />

                </label>



                <label className="sr-login-field">

                  <span>
                    {t.authPassword}
                  </span>


                  <div className="sr-login-password-wrap">

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={password}
                      onChange={
                        (event) =>
                          setPassword(
                            event.target.value
                          )
                      }
                      autoComplete="current-password"
                      placeholder="••••••••"
                      required
                    />


                    <button
                      type="button"
                      className="sr-login-password-toggle"
                      aria-label={
                        showPassword
                          ? t.authHide
                          : t.authShow
                      }
                      title={
                        showPassword
                          ? t.authHide
                          : t.authShow
                      }
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                    >

                      {
                        showPassword
                          ? (
                            <EyeOffIcon
                              size={21}
                            />
                          )
                          : (
                            <EyeIcon
                              size={21}
                            />
                          )
                      }

                    </button>

                  </div>

                </label>



                {error && (
                  <p
                    className="sr-login-error"
                    role="alert"
                  >
                    {error}
                  </p>
                )}



                <button
                  type="submit"
                  className="sr-login-submit"
                  disabled={submitting}
                >
                  {
                    submitting
                      ? t.authSigningIn
                      : t.login
                  }
                </button>


              </form>


            </div>

          </section>


        </main>


      </div>


      <Footer
        t={t}
        onContactClick={
          onContactClick
        }
      />

    </>
  );
}