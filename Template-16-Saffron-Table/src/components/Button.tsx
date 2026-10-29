import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'ghost' | 'light' | 'dark' | 'text';

interface BaseProps {
  variant?: Variant;
  icon?: IconName;
  size?: 'md' | 'lg' | 'sm';
  children: ReactNode;
  className?: string;
}

const cls = (v: Variant, size: string, extra?: string) => `btn btn--${v} btn--${size}${extra ? ` ${extra}` : ''}`;

export function ButtonLink({ to, variant = 'primary', icon, size = 'md', children, className }: BaseProps & { to: string }) {
  const external = /^(https?:|mailto:|tel:)/.test(to);
  const inner = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} size={18} />}
    </>
  );
  return external ? (
    <a className={cls(variant, size, className)} href={to}>
      {inner}
    </a>
  ) : (
    <Link className={cls(variant, size, className)} to={to}>
      {inner}
    </Link>
  );
}

export function Button({ variant = 'primary', icon, size = 'md', children, className, type = 'button', ...rest }: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cls(variant, size, className)} {...rest}>
      <span>{children}</span>
      {icon && <Icon name={icon} size={18} />}
    </button>
  );
}
