import '../../styles/button.css';
import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button className={`ui-button ${className || ""}`} {...props}>
      {children}
    </button>
  );
}
