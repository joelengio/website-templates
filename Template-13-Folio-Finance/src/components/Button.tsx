import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light';

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
}

export function LinkButton({ to, variant = 'primary', arrow = false, className = '', children, ...rest }: CommonProps & { to: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <Link to={to} className={`btn btn--${variant} ${className}`.trim()} {...rest}>
      {children}
      {arrow && <Icon name="arrow" size={16} />}
    </Link>
  );
}

export function Button({ variant = 'primary', arrow = false, className = '', children, type = 'button', ...rest }: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={`btn btn--${variant} ${className}`.trim()} {...rest}>
      {children}
      {arrow && <Icon name="arrow" size={16} />}
    </button>
  );
}
