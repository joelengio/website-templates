import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applySeo, type SeoInput } from '../lib/seo';

/** Sets the document title, description, canonical URL and Open Graph tags for the current page. */
export function Seo(props: Omit<SeoInput, 'path'>) {
  const { pathname } = useLocation();
  const { title, description, image, noindex, type } = props;
  useEffect(() => {
    applySeo({ title, description, image, noindex, type, path: pathname });
  }, [title, description, image, noindex, type, pathname]);
  return null;
}
