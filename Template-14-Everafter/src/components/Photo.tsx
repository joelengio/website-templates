import type { ImageRef } from '../config/types';

interface PhotoProps {
  image: ImageRef;
  /** Use the small variant (cards, thumbnails). */
  small?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  alt?: string;
}

/** Responsive, lazy-loaded photograph with the focal point from the image catalogue. */
export function Photo({ image, small, sizes, priority, className = '', alt }: PhotoProps) {
  return (
    <img
      className={`photo ${className}`}
      src={small ? image.small : image.src}
      srcSet={small ? undefined : `${image.small} 720w, ${image.src} 1600w`}
      sizes={small ? undefined : sizes ?? '100vw'}
      alt={alt ?? image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      style={image.position ? { objectPosition: image.position } : undefined}
    />
  );
}
