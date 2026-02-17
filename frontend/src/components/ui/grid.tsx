import type { ReactNode } from "react";
import "../../styles/grid.css";

interface GridProps {
  children: ReactNode;
}

export default function Grid({ children }: GridProps) {
  return <div className="grid-container">{children}</div>;
}
