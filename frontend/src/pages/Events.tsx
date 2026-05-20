import DashboardLayout from "../layouts/dashboard";
import EventsDashboard from "../features/events/components/EventsDashboard";

export default function Events() {
  return (
    <DashboardLayout>
      <EventsDashboard />
    </DashboardLayout>
  );
}
