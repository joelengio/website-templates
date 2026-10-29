import { Link } from 'react-router-dom';
import { site } from '../config/site';

export function Logo({ inverse = false }: { inverse?: boolean }) {
  const { logo } = site.brand;
  return (
    <Link to="/" className={`logo${inverse ? ' logo--inverse' : ''}`}>
      {logo.type === 'image' && logo.imageSrc ? (
        <img src={logo.imageSrc} alt={logo.imageAlt} className="logo__img" height={40} />
      ) : (
        <>
          <span className="logo__mark" aria-hidden="true">
            {logo.monogram}
          </span>
          <span className="logo__text">
            <span className="logo__word">{logo.wordmark}</span>
            <span className="logo__sub">{logo.wordmarkSub}</span>
          </span>
        </>
      )}
    </Link>
  );
}
