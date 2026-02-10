import type { ReactNode } from "react";
import TopNavbar from "../components/ui/topnavbar";
import "../styles/dashboardlayaout.css";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="dashboard-layout">
      <TopNavbar />
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}
