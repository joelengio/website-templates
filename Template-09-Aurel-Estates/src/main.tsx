import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource-variable/inter';
import './styles/main.css';
import App from './App';
import { ShortlistProvider } from './hooks/useShortlist';
import { applyTheme } from './lib/theme';

applyTheme();
document.documentElement.classList.add('js');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ShortlistProvider>
        <App />
      </ShortlistProvider>
    </BrowserRouter>
  </StrictMode>,
);
