import React from "react";
import DigitalClock from "../../components/ui/DigitalClock";
import "../../styles/dashboardheader.css";

const DashboardHeader: React.FC = () => {
  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <p className="dashboard-subtitle">
            Resumen general de tus salones, eventos y reservas en un solo lugar.
          </p>
        </div>
        <div className="header-right">
          <DigitalClock />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
