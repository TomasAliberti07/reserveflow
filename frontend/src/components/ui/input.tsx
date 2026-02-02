import '../../styles/input.css';
import type { ChangeEvent } from "react";

export interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  maxLength?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  type = "text",
  value,
  onChange,
}: InputProps) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}