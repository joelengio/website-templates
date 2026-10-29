import { useEffect } from 'react';
import { applySeo } from '../lib/seo';

export function useSeo(opts: { title?: string; description?: string; path?: string; image?: string; noindex?: boolean }) {
  const { title, description, path, image, noindex } = opts;
  useEffect(() => {
    applySeo({ title, description, path, image, noindex });
  }, [title, description, path, image, noindex]);
}
