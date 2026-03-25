import type { ReactNode, CSSProperties } from "react";
import "../../styles/grid.css";

interface GridProps {
  children: ReactNode;
  cols?: number; 
  gap?: number;
  style?: CSSProperties;
  className?: string;
}

export default function Grid({ children, cols = 1, gap = 1, style, className }: GridProps) {
  const gridStyles: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: `${gap}rem`,
    ...style,
  };

  return (
    <div className={`grid-container ${className || ""}`} style={gridStyles}>
      {children}
    </div>
  );
}