import '../../styles/button.css';
type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
};

export function Button({ children, type = 'button' }: ButtonProps) {
  return (
    <button type={type} className="btn-primary">
      {children}
    </button>
  );
}
