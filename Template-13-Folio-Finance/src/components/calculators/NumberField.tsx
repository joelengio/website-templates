import { useId, type ChangeEvent, type ReactNode } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: ReactNode;
  prefix?: string;
  suffix?: string;
  inputMode?: 'decimal' | 'numeric';
  name: string;
}

/** Labelled numeric input with unit adornment, hint and inline error. Text-based so invalid entries can be explained. */
export function NumberField({ label, value, onChange, error, hint, prefix, suffix, inputMode = 'decimal', name }: Props) {
  const uid = useId();
  const id = `${name}-${uid.replace(/:/g, '')}`;
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="field__control">
        {prefix && <span className="field__affix" aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          name={name}
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
        {suffix && <span className="field__affix field__affix--end" aria-hidden="true">{suffix}</span>}
      </div>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && (
        <p className="field__error" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}
