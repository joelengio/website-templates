import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function Wrapper({ id, label, error, hint, required, children }: BaseProps & { id: string; children: ReactNode }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="field__req" aria-hidden="true"> *</span>}
        {!required && <span className="field__opt"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && (
        <p className="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const describe = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export function TextField({ label, error, hint, required, ...rest }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <input id={id} aria-invalid={!!error} aria-describedby={describe(id, error, hint)} aria-required={required} {...rest} />
    </Wrapper>
  );
}

export function SelectField({ label, error, hint, required, children, ...rest }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <select id={id} aria-invalid={!!error} aria-describedby={describe(id, error, hint)} aria-required={required} {...rest}>
        {children}
      </select>
    </Wrapper>
  );
}

export function TextArea({ label, error, hint, required, ...rest }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <textarea id={id} aria-invalid={!!error} aria-describedby={describe(id, error, hint)} aria-required={required} {...rest} />
    </Wrapper>
  );
}

export function CheckField({ label, error, checked, onChange, id: idProp }: { label: ReactNode; error?: string; checked: boolean; onChange: (v: boolean) => void; id?: string }) {
  const gen = useId();
  const id = idProp ?? gen;
  return (
    <div className={`field field--check${error ? ' field--error' : ''}`}>
      <label className="check" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
        <span>{label}</span>
      </label>
      {error && (
        <p className="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function ErrorSummary({ errors, title = 'Please fix the following' }: { errors: Record<string, string>; title?: string }) {
  const entries = Object.values(errors);
  if (entries.length === 0) return null;
  return (
    <div className="error-summary" role="alert" tabIndex={-1} data-error-summary>
      <strong>{title}</strong>
      <ul>
        {entries.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  );
}
