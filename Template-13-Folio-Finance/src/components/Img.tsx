import type { CSSProperties } from 'react';
import { images } from '../config/images';
import type { ImageAsset } from '../config/types';

interface Props {
  /** Key from config/images.ts or a full ImageAsset. */
  image: string | ImageAsset;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

/** Responsive, lazy-loaded image with intrinsic dimensions (prevents layout shift). */
export function Img({ image, sizes = '(max-width: 800px) 100vw, 50vw', priority = false, className, style, alt }: Props) {
  const asset = typeof image === 'string' ? images[image] : image;
  if (!asset) return null;
  const srcSet = asset.small && asset.smallWidth ? `${asset.small} ${asset.smallWidth}w, ${asset.src} ${asset.width}w` : undefined;
  return (
    <img
      src={asset.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={asset.width}
      height={asset.height}
      alt={alt ?? asset.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      className={className}
      style={style}
    />
  );
}
