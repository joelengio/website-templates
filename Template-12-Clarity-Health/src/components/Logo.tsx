import { site } from '../config/site';

export function Logo({ light = false }: { light?: boolean }) {
  const { brand } = site;
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`}>
      <img src={brand.logo} alt="" width={40} height={40} className="logo-mark" />
      {brand.showWordmark && (
        <span className="logo-text">
          <span className="logo-name">{brand.name}</span>
          <span className="logo-tag">{brand.tagline}</span>
        </span>
      )}
      {!brand.showWordmark && <span className="sr-only">{brand.name}</span>}
    </span>
  );
}
