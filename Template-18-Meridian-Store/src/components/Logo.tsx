import { Link } from 'react-router-dom';
import { site } from '../config/site';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`logo ${className}`}>
      <img src={site.brand.logo} alt="" width="28" height="28" className="logo-mark" />
      <span className="logo-text">
        <span className="logo-word">{site.brand.wordmark}</span>
        <span className="logo-sub">{site.brand.wordmarkSub}</span>
      </span>
      <span className="sr-only"> — home</span>
    </Link>
  );
}
