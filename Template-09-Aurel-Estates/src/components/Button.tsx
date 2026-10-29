import { Link, type LinkProps } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

type Variant = 'primary' | 'ghost' | 'light' | 'brass';

export function LinkButton({ variant = 'primary', arrow, children, className = '', ...rest }: LinkProps & { variant?: Variant; arrow?: boolean; children: ReactNode }) {
  return (
    <Link className={`btn btn--${variant} ${className}`} {...rest}>
      {children}
      {arrow && <Icon name="arrow" size={16} />}
    </Link>
  );
}

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={`btn btn--${variant} ${className}`} {...rest} />;
}
