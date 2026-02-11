import React from "react";
import DashboardLayout from "../layouts/dashboard";
import DashboardHeader from "../features/dashboard/DashboardHeader";
import DashboardStats from "../features/dashboard/DashboardStats";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <DashboardHeader />
        <DashboardStats />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
