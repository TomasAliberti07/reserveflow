import '../../styles/input.css';
import type { ChangeEvent } from "react";

export interface InputProps {
  label: string;
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
  type = "text",
  value,
  onChange,
  error = false,
  errorMessage,
}: InputProps) {
  return (
    <div className="input-group">
      <label className={error ? "label-error" : ""}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={error ? "input-field-error" : ""}
      />
      {error && errorMessage && <span className="input-error">{errorMessage}</span>}
    </div>
  );
}