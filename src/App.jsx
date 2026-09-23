import {
  useEffect,
  useRef,
  useState,
} from 'react';


import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';


import ContactModal
  from './components/ContactModal';

import Toast
  from './components/Toast';


import {
  useLanguage,
} from './hooks/useLanguage';

import {
  useScrollReveal,
} from './hooks/useScrollReveal';


import HomePage
  from './pages/HomePage';

import PricingPage
  from './pages/PricingPage';

import PolicyPage
  from './pages/PolicyPage';

import LoginPage
  from './pages/LoginPage';

import DashboardPage
  from './pages/DashboardPage';

import AdminPage
  from './pages/AdminPage';


import ProtectedRoute
  from './auth/ProtectedRoute';


const initialToast = {
  visible: false,
  message: '',
  isError: false,
};


export default function App() {

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();


  const [
    contactOpen,
    setContactOpen,
  ] = useState(false);


  const [
    toast,
    setToast,
  ] = useState(initialToast);


  const toastTimerRef =
    useRef(null);


  const location =
    useLocation();


  useScrollReveal();


  useEffect(() => {

    if (!location.hash) {
      window.scrollTo(0, 0);
    }

  }, [
    location.pathname,
    location.hash,
  ]);


  useEffect(() => {

    return () =>
      clearTimeout(
        toastTimerRef.current
      );

  }, []);


  const showToast = (
    message,
    isError = false,
  ) => {

    clearTimeout(
      toastTimerRef.current
    );


    setToast({
      visible: true,
      message,
      isError,
    });


    toastTimerRef.current =
      setTimeout(() => {

        setToast(
          (currentToast) => ({
            ...currentToast,
            visible: false,
          })
        );

      }, 3500);

  };


  const sharedPageProps = {
    t,
    language,
    onLanguageChange:
      setLanguage,

    onContactClick: () =>
      setContactOpen(true),
  };


  return (
    <>

      <Routes>


        <Route
          path="/"
          element={
            <HomePage
              {...sharedPageProps}
            />
          }
        />


        <Route
          path="/pricing"
          element={
            <PricingPage
              {...sharedPageProps}
            />
          }
        />


        <Route
          path="/privacy"
          element={
            <PolicyPage
              type="privacy"
              {...sharedPageProps}
            />
          }
        />


        <Route
          path="/privacy.html"
          element={
            <PolicyPage
              type="privacy"
              {...sharedPageProps}
            />
          }
        />


        <Route
          path="/terms"
          element={
            <PolicyPage
              type="terms"
              {...sharedPageProps}
            />
          }
        />


        <Route
          path="/terms.html"
          element={
            <PolicyPage
              type="terms"
              {...sharedPageProps}
            />
          }
        />


        <Route
          path="/login"
          element={(
            <LoginPage
              t={t}
              language={language}
              onLanguageChange={
                setLanguage
              }
            />
          )}
        />


        <Route
          path="/admin"
          element={(
            <ProtectedRoute>

              <AdminPage
                t={t}
                language={language}
                onLanguageChange={
                  setLanguage
                }
              />

            </ProtectedRoute>
          )}
        />


        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>

              <DashboardPage
                t={t}
                language={language}
                onLanguageChange={
                  setLanguage
                }
                onToast={
                  showToast
                }
              />

            </ProtectedRoute>
          )}
        />


        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />


      </Routes>


      <ContactModal
        open={contactOpen}
        onClose={() =>
          setContactOpen(false)
        }
        t={t}
        onToast={
          showToast
        }
      />


      <Toast
        toast={toast}
      />

    </>
  );
}