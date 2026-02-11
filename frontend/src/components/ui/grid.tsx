import type { ReactNode } from "react";
import "../../styles/grid.css";

interface GridProps {
  children: ReactNode;
  columns?: number;
}

export default function Grid({ children, columns = 4 }: GridProps) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  );
}
