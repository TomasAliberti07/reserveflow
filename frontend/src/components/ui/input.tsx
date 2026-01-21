import '../../styles/input.css';

type InputProps = {
  label: string;
  type?: string;
};

export function Input({ label, type = 'text' }: InputProps) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type={type} />
    </div>
  );
}
