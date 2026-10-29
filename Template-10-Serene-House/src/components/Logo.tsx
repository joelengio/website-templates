import { site } from '../config/site';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <img src={site.brand.logo} alt="" width="34" height="34" />
      <span className="logo-text">
        <span className="logo-name">{site.brand.name}</span>
        <span className="logo-tag">{site.brand.tagline}</span>
      </span>
    </span>
  );
}
