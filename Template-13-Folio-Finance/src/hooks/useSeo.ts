import { useEffect } from 'react';
import { applySeo, type SeoInput } from '../lib/seo';

export function useSeo({ title, description, path, image, noindex }: SeoInput): void {
  useEffect(() => {
    applySeo({ title, description, path, image, noindex });
  }, [title, description, path, image, noindex]);
}
