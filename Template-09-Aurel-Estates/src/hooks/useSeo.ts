import { useEffect } from 'react';
import { applySeo } from '../lib/seo';

export function useSeo(opts: { title?: string; description?: string; path?: string; image?: string }) {
  const { title, description, path, image } = opts;
  useEffect(() => {
    applySeo({ title, description, path, image });
  }, [title, description, path, image]);
}
