import { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrash, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { getEvents, createEvent, updateEvent } from '../../../api/events.api';
import type { EventoDTO } from '../../../api/events.api';
import { getSalons } from '../../../api/salons.api';
import type { SalonsDTO } from '../../../api/salons.api';
import { getMenus } from '../../../api/menus.api';
import type { MenuOptionDTO } from './EventModal';
import { getBebidas } from '../../../api/bebida.api';
import type { BebidaOptionDTO } from './EventModal';
import { Button } from '../../../components/ui/button';
import ValidationPopup from '../../../components/ui/validationPopup';
import { useValidationPopup } from '../../../hooks/useValidationPopup';
import EventModal from './EventModal';
import '../../../styles/eventsdashboard.css';

export default function EventsDashboard() {
  const [events, setEvents] = useState<EventoDTO[]>([]);
  const [salons, setSalons] = useState<SalonsDTO[]>([]);
  const [menus, setMenus] = useState<MenuOptionDTO[]>([]);
  const [bebidas, setBebidas] = useState<BebidaOptionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelled, setShowCancelled] = useState(false);
  const [showFinalized, setShowFinalized] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventoDTO | null>(null);
  const { popup, showSuccess, showError, closePopup } = useValidationPopup();

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsData, salonsData, menusData, bebidaData] = await Promise.all([
        getEvents(),
        getSalons(),
        getMenus(),
        getBebidas(),
      ]);
      setEvents(eventsData);
      setSalons(salonsData);
      setMenus(menusData);
      setBebidas(bebidaData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      showError('Ocurrió un error al cargar la información.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelEvent = async (event: EventoDTO) => {
    if (!event.id) return;
    try {
      await updateEvent(event.id, { estado: 'cancelado' } as Partial<EventoDTO> as EventoDTO);
      showSuccess('La reserva se marcó como cancelada.', 'Reserva cancelada');
      await loadData();
    } catch (error) {
      console.error('Error al cancelar evento:', error);
      showError('No se pudo cancelar la reserva. Intenta nuevamente.', 'Error');
    }
  };

  const handleStatusChange = async (event: EventoDTO, newStatus: string) => {
    if (!event.id) return;
    try {
     await updateEvent(event.id, { estado: newStatus as EventoDTO['estado'] } as Partial<EventoDTO> as EventoDTO);
      showSuccess(`Reserva actualizada a estado ${newStatus.toUpperCase()}.`, 'Éxito');
      await loadData();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showError('No se pudo cambiar el estado de la reserva.', 'Error');
    }
  };

  const handleModalSubmit = async (data: EventoDTO) => {
    setIsSubmitting(true);
    try {
      if (selectedEvent?.id) {
        await updateEvent(selectedEvent.id, data);
        showSuccess('Reserva actualizada correctamente.', 'Éxito');
      } else {
        await createEvent(data);
        showSuccess('Reserva creada correctamente.', 'Éxito');
      }
      handleModalClose();
      await loadData();
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      showError('Ocurrió un error al procesar el evento.', 'Error');
    } finally {
      setIsSubmitting(false);
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
    if (event.finaliza) {
      const finalizaFecha = new Date(event.finaliza);
      const esPasado = !Number.isNaN(finalizaFecha.getTime()) && finalizaFecha < new Date();

      if (estadoActual === 'pendiente' && esPasado) {
        return 'cancelado';
      }
      if (estadoActual === 'confirmado' && esPasado) {
        return 'finalizado';
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
  const eventsFinalizados = events.filter(
    (event) => getEventStatus(event) === 'finalizado'
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

    if (showCancelled && !showFinalized) {
      return status === 'cancelado' && matchesSearch;
    }

    if (showFinalized && !showCancelled) {
      return status === 'finalizado' && matchesSearch;
    }

    if (showCancelled && showFinalized) {
      return (status === 'cancelado' || status === 'finalizado') && matchesSearch;
    }

    return (status === 'pendiente' || status === 'confirmado') && matchesSearch;
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

      <div className="events-dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="events-dashboard-card events-dashboard-card-pending">
          <p className="events-dashboard-card-title">Pendientes</p>
          <p className="events-dashboard-card-value">{eventsPendientes}</p>
        </div>

        <div className="events-dashboard-card events-dashboard-card-confirmed">
          <p className="events-dashboard-card-title">Confirmados</p>
          <p className="events-dashboard-card-value">{eventsConfirmados}</p>
        </div>

        <div className="events-dashboard-card events-dashboard-card-finalized" style={{ borderTop: '4px solid #3b82f6', backgroundColor: '#1e293b' }}>
          <p className="events-dashboard-card-title" style={{ color: '#93c5fd' }}>Finalizados</p>
          <p className="events-dashboard-card-value" style={{ color: '#60a5fa' }}>{eventsFinalizados}</p>
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
      </div>

      {/* Controles de filtro: Búsqueda y Checkboxes */}
      <div className="bebida-dashboard-search" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Buscar reserva..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bebida-dashboard-search-input"
          style={{ flex: '1', minWidth: '240px' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', cursor: 'pointer', fontSize: '0.9rem', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={showCancelled}
            onChange={(e) => setShowCancelled(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          Mostrar eventos cancelados
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', cursor: 'pointer', fontSize: '0.9rem', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={showFinalized}
            onChange={(e) => setShowFinalized(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          Mostrar eventos finalizados
        </label>
      </div>

      <div className="events-dashboard-results" aria-live="polite">
        {filteredEvents.length === 0 ? (
          <p className="events-dashboard-no-events">No hay reservas registradas para mostrar.</p>
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
                      {/* Selector directo de estado en la card */}
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(event, e.target.value)}
                        className={`events-dashboard-event-card-status events-dashboard-event-card-status-${status}`}
                        style={{ cursor: 'pointer', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}
                      >
                        <option value="pendiente" style={{ color: '#000' }}>Pendiente</option>
                        <option value="confirmado" style={{ color: '#000' }}>Confirmado</option>
                        <option value="finalizado" style={{ color: '#000' }}>Finalizado</option>
                        <option value="cancelado" style={{ color: '#000' }}>Cancelado</option>
                      </select>

                      <div className="events-dashboard-event-card-actions">
                        <button type="button" className="events-dashboard-card-action" aria-label="Editar evento" onClick={() => openEditModal(event)}>
                          <FaEdit />
                        </button>
                        <button type="button" className="events-dashboard-card-action" aria-label="Cancelar evento" title="Marcar como cancelado" onClick={() => handleCancelEvent(event)}>
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

      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        salons={salons}
        menus={menus}
        bebidas={bebidas}
        initialData={selectedEvent ?? undefined}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}