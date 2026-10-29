import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/hanken-grotesk/400.css';
import '@fontsource/hanken-grotesk/500.css';
import '@fontsource/hanken-grotesk/600.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import { App } from './App';
import { applyTheme } from './lib/theme';
import { checkConfig } from './lib/config-check';

applyTheme();
if (import.meta.env.DEV) {
  const issues = checkConfig();
  if (issues.length) console.warn('[MERIDIAN] Configuration issues:\n' + issues.map((i) => `${i.severity.toUpperCase()} ${i.where}: ${i.message}`).join('\n'));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
