import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'text';
interface Common {
  variant?: Variant;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
}

export function LinkButton({ to, variant = 'primary', arrow, children, className = '', ...rest }: Common & { to: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <Link to={to} className={`btn btn--${variant} ${className}`} {...rest}>
      {children}
      {arrow && <Icon name="arrow" size={18} />}
    </Link>
  );
}

export default function Button({ variant = 'primary', arrow, children, className = '', type = 'button', ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={`btn btn--${variant} ${className}`} {...rest}>
      {children}
      {arrow && <Icon name="arrow" size={18} />}
    </button>
  );
}
