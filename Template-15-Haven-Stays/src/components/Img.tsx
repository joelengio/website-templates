import type { ImgHTMLAttributes } from 'react';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  priority?: boolean;
  ratio?: [number, number];
}

/** Lazy-loaded image with intrinsic dimensions so the layout never shifts. */
export default function Img({ src, alt, priority = false, ratio = [8, 5], className = '', ...rest }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      width={ratio[0] * 100}
      height={ratio[1] * 100}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      className={className}
      {...rest}
    />
  );
}
