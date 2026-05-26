import EventModal from './EventModal';

export default function AgregarEvento(props: Parameters<typeof EventModal>[0]) {
  
  return <EventModal {...props} />;
}
