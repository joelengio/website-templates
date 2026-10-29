import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/manrope';
import App from './App';
import { applyTheme } from './lib/theme';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';

applyTheme();
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('js');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
