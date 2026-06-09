import type { ChangeEvent } from 'react';

interface DateSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  min?: string;
  error?: boolean;
  errorMessage?: string;
}

export function DateSelect({ 
  label, 
  value, 
  onChange, 
  name,
  min,
  error = false,
  errorMessage 
}: DateSelectProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="input-group">
      <label htmlFor={name} className={error ? "label-error" : ""}>{label}</label>
      <input
        id={name}
        name={name}
        type="date"
        value={value}
        min={min}
        onChange={handleChange}
        className={`date-select ${error ? "input-field-error" : ""}`}
      />
      {error && errorMessage && <span className="input-error">{errorMessage}</span>}
    </div>
  );
}
