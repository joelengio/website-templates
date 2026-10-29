import type { CSSProperties } from 'react';
import { images, type ImageKey } from '../config/images';

interface Props {
  name: ImageKey | string;
  sizes?: string;
  eager?: boolean;
  className?: string;
  alt?: string;
  style?: CSSProperties;
}

/** Responsive image from the registry. Falls back to an empty placeholder if the key is unknown. */
export function Img({ name, sizes = '(min-width: 1024px) 50vw, 100vw', eager = false, className, alt, style }: Props) {
  const img = (images as Record<string, (typeof images)[ImageKey]>)[name];
  if (!img) return <div className={`img-missing ${className ?? ''}`} role="img" aria-label={alt ?? 'Image unavailable'} />;
  return (
    <img
      className={className}
      src={img.src}
      srcSet={`${img.thumb} 640w, ${img.src} ${img.width}w`}
      sizes={sizes}
      width={img.width}
      height={img.height}
      alt={alt ?? img.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      style={style}
    />
  );
}
