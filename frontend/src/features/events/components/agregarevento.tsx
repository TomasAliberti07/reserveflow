import EventModal from './EventModal';

export default function AgregarEvento(props: Parameters<typeof EventModal>[0]) {
  // Reexport with the Spanish name expected by the dashboard
  return <EventModal {...props} />;
}
