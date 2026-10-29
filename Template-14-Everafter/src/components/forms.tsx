import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Icon } from './Icon';

interface FieldShell {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

function Shell({ id, label, error, hint, optional, children }: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}{optional && <span className="field__opt"> (optional)</span>}</label>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {children}
      {error && <p className="field__error" id={`${id}-err`} role="alert"><Icon name="info" size={16} />{error}</p>}
    </div>
  );
}

const describe = (id: string, error?: string, hint?: string) => [hint ? `${id}-hint` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined;

export function TextField({ label, error, hint, optional, ...rest }: FieldShell & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional}>
      <input id={id} aria-invalid={error ? true : undefined} aria-describedby={describe(id, error, hint)} {...rest} />
    </Shell>
  );
}

export function TextArea({ label, error, hint, optional, ...rest }: FieldShell & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional}>
      <textarea id={id} aria-invalid={error ? true : undefined} aria-describedby={describe(id, error, hint)} {...rest} />
    </Shell>
  );
}

export function SelectField({ label, error, hint, optional, children, ...rest }: FieldShell & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional}>
      <select id={id} aria-invalid={error ? true : undefined} aria-describedby={describe(id, error, hint)} {...rest}>{children}</select>
    </Shell>
  );
}

interface ChoiceOption {
  id: string;
  label: string;
  hint?: string;
}

/** Accessible radio or checkbox group rendered as selectable tiles. */
export function ChoiceGroup({ legend, name, type, options, value, onChange, error, columns = 2, hint }: {
  legend: string;
  name: string;
  type: 'radio' | 'checkbox';
  options: ChoiceOption[];
  value: string | string[];
  onChange: (next: string | string[]) => void;
  error?: string;
  columns?: 1 | 2 | 3;
  hint?: string;
}) {
  const uid = useId();
  const selected = Array.isArray(value) ? value : [value];
  const toggle = (id: string) => {
    if (type === 'radio') return onChange(id);
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };
  return (
    <fieldset className={`choices choices--${columns}${error ? ' has-error' : ''}`} aria-describedby={[hint ? `${uid}-h` : '', error ? `${uid}-e` : ''].filter(Boolean).join(' ') || undefined}>
      <legend>{legend}</legend>
      {hint && <p className="field__hint" id={`${uid}-h`}>{hint}</p>}
      <div className="choices__grid">
        {options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <label key={o.id} className={`choice${on ? ' is-on' : ''}`}>
              <input type={type} name={name} value={o.id} checked={on} onChange={() => toggle(o.id)} />
              <span className="choice__mark" aria-hidden="true">{on && <Icon name="check" size={14} />}</span>
              <span className="choice__text"><strong>{o.label}</strong>{o.hint && <small>{o.hint}</small>}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="field__error" id={`${uid}-e`} role="alert"><Icon name="info" size={16} />{error}</p>}
    </fieldset>
  );
}
