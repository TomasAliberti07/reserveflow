import type { ChangeEvent } from 'react';

interface TimeSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  error?: boolean;
  errorMessage?: string;
}

export function TimeSelect({ 
  label, 
  value, 
  onChange, 
  name,
  error = false,
  errorMessage 
}: TimeSelectProps) {
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeString = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="input-group">
      <label htmlFor={name} className={error ? "label-error" : ""}>{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className={`time-select ${error ? "input-field-error" : ""}`}
      >
        <option value="">Seleccionar hora</option>
        {generateTimeOptions().map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      {error && errorMessage && <span className="input-error">{errorMessage}</span>}
    </div>
  );
}
