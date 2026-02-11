import React from "react";
import "../../styles/dashboardheader.css";

const DashboardHeader: React.FC = () => {
  return (
    <div className="dashboard-header">
      <h1 className="dashboard-title">ReserveFlow</h1>
      <p className="dashboard-subtitle">
        Resumen general de tus salones, eventos y reservas en un solo lugar.
      </p>
    </div>
  );
};

export default DashboardHeader;
