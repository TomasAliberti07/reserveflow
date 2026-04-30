import DashboardLayout from "../layouts/dashboard";
import SalonsDashboard from "../features/salons/salonsdashboard";

export default function Salons() {
  return (
    <DashboardLayout>
      <SalonsDashboard />
    </DashboardLayout>
  );
}