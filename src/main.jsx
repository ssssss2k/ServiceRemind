import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import App from './App';
import './styles/style.css';
import './styles/workspace.css';
import './styles/polish.css';
import './styles/refinement.css';
import './styles/final88.css';
import './styles/final89.css';
import './styles/final90.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
