import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';
import './styles/main.css';
import App from './App';
import { LearnerProvider } from './hooks/useLearner';
import { applyTheme } from './lib/theme';

applyTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LearnerProvider>
        <App />
      </LearnerProvider>
    </BrowserRouter>
  </StrictMode>,
);
