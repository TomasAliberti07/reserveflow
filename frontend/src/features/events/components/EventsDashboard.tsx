import { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrash, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { getEvents, deleteEvent } from '../../../api/events.api';
import type { EventoDTO } from '../../../api/events.api';
import { getSalons } from '../../../api/salons.api';
import type { SalonsDTO } from '../../../api/salons.api';
import { Button } from '../../../components/ui/button';
import ValidationPopup from '../../../components/ui/validationPopup';
import { useValidationPopup } from '../../../hooks/useValidationPopup';
import AgregarEvento from '../components/agregarevento';
import '../../../styles/eventsdashboard.css';

export default function EventsDashboard() {
  const [events, setEvents] = useState<EventoDTO[]>([]);
  const [salons, setSalons] = useState<SalonsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventoDTO | null>(null);
  const { popup, showSuccess, showError, closePopup } = useValidationPopup();

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

  const handleDeleteEvent = async (id?: number) => {
    if (!id) return;
    try {
      await deleteEvent(id);
      await loadData();
      showSuccess('La reserva se eliminó correctamente.', 'Reserva eliminada');
    } catch (error) {
      console.error('Error eliminando evento:', error);
      showError('No se pudo eliminar la reserva. Intenta nuevamente.', 'Error');
    }
  };

  const openAddModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: EventoDTO) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const getEventStatus = (event: EventoDTO) => {
    const estadoActual = event.estado ?? 'pendiente';
    if (estadoActual === 'pendiente' && event.finaliza) {
      const finalizaFecha = new Date(event.finaliza);
      if (!Number.isNaN(finalizaFecha.getTime()) && finalizaFecha < new Date()) {
        return 'cancelado';
      }
    }
    return estadoActual;
  };

  const eventsPendientes = events.filter(
    (event) => getEventStatus(event) === 'pendiente'
  ).length;
  const eventsConfirmados = events.filter(
    (event) => getEventStatus(event) === 'confirmado'
  ).length;
  const eventsCancelados = events.filter(
    (event) => getEventStatus(event) === 'cancelado'
  ).length;

  const filteredEvents = events.filter((ev) => {
    const q = searchQuery.trim().toLowerCase();
    const status = getEventStatus(ev);
    const nombre = (ev.cliente_nombre || '').toLowerCase();
    const apellido = (ev.cliente_apellido || '').toLowerCase();
    const nombreCompleto = `${nombre} ${apellido}`.trim();

    const matchesSearch =
      !q ||
      nombre.includes(q) ||
      apellido.includes(q) ||
      nombreCompleto.includes(q);

    if (status === 'cancelado') {
      return matchesSearch && q.length > 0;
    }

    return matchesSearch;
  });

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
        <Button onClick={openAddModal} className="bebida-dashboard-button">+ Agregar</Button>
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
        {filteredEvents.length === 0 ? (
          <p className="events-dashboard-no-events">No hay reservas registradas todavía.</p>
        ) : (
          <div className="events-dashboard-list">
            {filteredEvents.map((event) => {
              const salon = salons.find((s) => s.id === event.salon_id);
              const status = getEventStatus(event);

              return (
                <article key={event.id ?? `${event.cliente_nombre}-${event.cliente_apellido}-${event.comienzo}`} className="events-dashboard-event-card">
                  <div className="events-dashboard-event-card-header">
                    <div className="events-dashboard-event-card-header-info">
                      <div className="events-dashboard-event-card-meta-item">
                        <FaUser className="events-dashboard-event-card-meta-icon" />
                        <div>
                          <span className="event-label">Cliente</span>
                          <span className="event-value">{event.cliente_nombre} {event.cliente_apellido}</span>
                        </div>
                      </div>

                      <div className="events-dashboard-event-card-meta-item">
                        <FaEnvelope className="events-dashboard-event-card-meta-icon" />
                        <div>
                          <span className="event-label">Gmail</span>
                          <span className="event-value">{event.cliente_email || 'Sin datos'}</span>
                        </div>
                      </div>

                      <div className="events-dashboard-event-card-meta-item">
                        <FaPhoneAlt className="events-dashboard-event-card-meta-icon" />
                        <div>
                          <span className="event-label">Teléfono</span>
                          <span className="event-value">{event.cliente_numero || 'Sin datos'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="events-dashboard-event-card-header-aside">
                      <span className={`events-dashboard-event-card-status events-dashboard-event-card-status-${status}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>

                      <div className="events-dashboard-event-card-actions">
                        <button type="button" className="events-dashboard-card-action" aria-label="Editar evento" onClick={() => openEditModal(event)}>
                          <FaEdit />
                        </button>
                        <button type="button" className="events-dashboard-card-action" aria-label="Eliminar evento" onClick={() => handleDeleteEvent(event.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="events-dashboard-event-card-body">
                    <div className="events-dashboard-event-card-field">
                      <span className="event-label">Edificio</span>
                      <span className="event-value">{salon?.localizacion ?? 'Sin ubicación asignada'}</span>
                    </div>
                    <div className="events-dashboard-event-card-field">
                      <span className="event-label">Fecha</span>
                      <span className="event-value">{formatDate(event.comienzo)}</span>
                    </div>
                    <div className="events-dashboard-event-card-field">
                      <span className="event-label">Salón</span>
                      <span className="event-value events-dashboard-event-card-salon-name">
                        {salon?.nombre ?? 'Salón no asignado'}
                      </span>
                    </div>
                    <div className="events-dashboard-event-card-field">
                      <span className="event-label">Hora</span>
                      <span className="event-value">{formatTime(event.comienzo)} - {formatTime(event.finaliza)}</span>
                    </div>
                    <div className="events-dashboard-event-card-field">
                      <span className="event-label">Invitados</span>
                      <span className="event-value">{event.cant_invitados}</span>
                    </div>
                    <div className="events-dashboard-event-card-field events-dashboard-event-card-field-notes">
                      <span className="event-label">Notas</span>
                      <span className="event-value">{event.notas || 'Sin notas'}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <ValidationPopup popup={popup} closePopup={closePopup} />

      <AgregarEvento
        isOpen={isModalOpen}
        onClose={handleModalClose}
        salons={salons}
        onEventCreated={loadData}
        initialData={selectedEvent ?? undefined}
      />
    </section>
  );
}
