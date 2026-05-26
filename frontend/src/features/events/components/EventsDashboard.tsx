import { useState, useEffect } from 'react';
import { getEvents } from '../../../api/events.api';
import type { EventoDTO } from '../../../api/events.api';
import { getSalons } from '../../../api/salons.api';
import type { SalonsDTO } from '../../../api/salons.api';
import { Button } from '../../../components/ui/button';
import AgregarEvento from '../components/agregarevento';
import '../../../styles/eventsdashboard.css';

export default function EventsDashboard() {
  const [events, setEvents] = useState<EventoDTO[]>([]);
  const [salons, setSalons] = useState<SalonsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsData, salonsData] = await Promise.all([getEvents(), getSalons()]);
      setEvents(eventsData);
      setSalons(salonsData);
    } catch (error) {
      console.error('Error cargando eventos o salones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const eventsPendientes = events.filter(
    (event) => event.estado === 'pendiente'
  ).length;
  const eventsConfirmados = events.filter(
    (event) => event.estado === 'confirmado'
  ).length;
  const eventsCancelados = events.filter(
    (event) => event.estado === 'cancelado'
  ).length;

  const filteredEvents = events.filter((ev) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const nombre = (ev.cliente_nombre || '').toLowerCase();
    const apellido = (ev.cliente_apellido || '').toLowerCase();
    return nombre.includes(q) || apellido.includes(q) || `${nombre} ${apellido}`.includes(q);
  });

  if (loading) {
    return (
      <section className="events-dashboard">
        <div className="events-dashboard-header">
          <h1 className="events-dashboard-title">Gestión de Reservas</h1>
          <Button onClick={() => setIsModalOpen(true)} className="bebida-dashboard-button">+ Agregar</Button>
        </div>
        <p className="events-dashboard-loading">Cargando datos...</p>
      </section>
    );
  }

  return (
    <section className="events-dashboard">
      <div className="events-dashboard-header">
        <h1 className="events-dashboard-title">Gestión de Reservas</h1>
        <Button onClick={() => setIsModalOpen(true)} className="bebida-dashboard-button">+ Agregar</Button>
      </div>

      <div className="events-dashboard-grid">
        <div className="events-dashboard-card events-dashboard-card-pending">
          <p className="events-dashboard-card-title">Pendientes</p>
          <p className="events-dashboard-card-value">{eventsPendientes}</p>
        </div>

        <div className="events-dashboard-card events-dashboard-card-confirmed">
          <p className="events-dashboard-card-title">Confirmados</p>
          <p className="events-dashboard-card-value">{eventsConfirmados}</p>
        </div>

        <div className="events-dashboard-card events-dashboard-card-cancelled">
          <p className="events-dashboard-card-title">Cancelados</p>
          <p className="events-dashboard-card-value">{eventsCancelados}</p>
        </div>
      </div>

      <div className="events-dashboard-placeholder">
        <p className="events-dashboard-placeholder-text">
          Salones disponibles: {salons.length}
        </p>
        <p className="events-dashboard-placeholder-text">
          {/* Aquí irá la lista de eventos y acciones adicionales más adelante */}
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="bebida-dashboard-search">
        <input
          type="text"
          placeholder="Buscar reserva..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bebida-dashboard-search-input"
        />
      </div>

   
      <div className="events-dashboard-results" aria-live="polite">
        {/* mapped results will go here */}
      </div>

      <AgregarEvento isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} salons={salons} onEventCreated={loadData} />
    </section>
  );
}
