import '../../styles/input.css';
import type { ChangeEvent } from "react";

export interface InputProps {
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string| number;
  maxLength?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
}

export function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error = false,
  errorMessage,
  ...props
}: InputProps) {
  return (
    <div className="input-group">
      {label ? <label className={error ? "label-error" : ""} htmlFor={name}>{label}</label> : null}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={error ? "input-field-error" : ""}
        {...props}
      />
      {error && errorMessage && <span className="input-error">{errorMessage}</span>}
    </div>
  );
}