import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/big-shoulders-display/latin-700';
import '@fontsource/big-shoulders-display/latin-800';
import '@fontsource/big-shoulders-display/latin-900';
import '@fontsource/manrope/latin-400';
import '@fontsource/manrope/latin-500';
import '@fontsource/manrope/latin-700';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import { App } from './App';
import { applyTheme } from './lib/theme';

applyTheme();
document.documentElement.classList.add('js');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
