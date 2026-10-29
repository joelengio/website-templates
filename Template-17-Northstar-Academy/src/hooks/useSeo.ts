import { useEffect } from 'react';
import { applySeo, type SeoOptions } from '../lib/seo';

export function useSeo(opts: SeoOptions) {
  const { title, description, path, image, noindex } = opts;
  useEffect(() => {
    applySeo({ title, description, path, image, noindex });
  }, [title, description, path, image, noindex]);
}
