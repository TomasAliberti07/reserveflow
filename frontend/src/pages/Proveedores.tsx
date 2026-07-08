import DashboardLayout from "../layouts/dashboard";
import ProveedoresDashboard from "../features/proveedores/proveedoresdashboard";

export default function Proveedores() {
  return (
    <DashboardLayout>
      <ProveedoresDashboard />
    </DashboardLayout>
  );
}