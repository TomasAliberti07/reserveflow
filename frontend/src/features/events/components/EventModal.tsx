import { useState, useEffect } from 'react';
import Popup from '../../../components/ui/popup';
import EventForm from './EventForm';
import { createEvent, updateEvent } from '../../../api/events.api';
import { getMenus } from '../../../api/menus.api'; 
import { getBebidas } from '../../../api/bebida.api'; 
import type { SalonsDTO } from '../../../api/salons.api';
import type { EventoDTO } from '../../../api/events.api';


type Props = {
  isOpen: boolean;
  onClose: () => void;
  salons: SalonsDTO[];
  onEventCreated: () => void;
  initialData?: EventoDTO;
};

export default function EventModal({ isOpen, onClose, salons, onEventCreated, initialData }: Props) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState<string | undefined>(undefined);
  const [popupType, setPopupType] = useState<'success' | 'error' | 'info'>('info');
  const [submitting, setSubmitting] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);
  const [bebidas, setBebidas] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      getMenus()
        .then((res: any) => {
          setMenus(res.data || res);
        })
        .catch((err) => {
          console.error('Error al cargar menús en el modal:', err);
        });

      getBebidas()
        .then((res: any) => {
          setBebidas(res.data || res);
        })
        .catch((err) => {
          console.error('Error al cargar bebidas en el modal:', err);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePopupClose = () => setPopupOpen(false);

  const handleSubmit = async (data: EventoDTO) => {
    setSubmitting(true);
    try {
      if (initialData?.id) {
        await updateEvent(initialData.id, data);
        setPopupTitle('Reserva actualizada');
        setPopupMessage('La reserva se actualizó correctamente.');
      } else {
        await createEvent(data);
        setPopupTitle('Reserva creada');
        setPopupMessage('La reserva se creó correctamente.');
      }

      setPopupType('success');
      setPopupOpen(true);

      try {
        onEventCreated();
      } catch (err) {
        // ignore
      }

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Error al crear la reserva.';
      setPopupTitle('Error');
      setPopupMessage(String(msg));
      setPopupType('error');
      setPopupOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Popup open={popupOpen} title={popupTitle} message={popupMessage} type={popupType} onClose={handlePopupClose} />

      <div className="modal-overlay">
        <div className="event-modal-card">
          <h2 className="event-modal-title">
            {initialData?.id ? 'Editar Reserva' : 'Nueva Reserva'}
          </h2>

          <div className="event-modal-body">
            <EventForm
              salons={salons}
              menus={menus}
              bebidas={bebidas}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="event-modal-footer">
            <button type="submit" form="event-form" className="event-modal-save-button" disabled={submitting}>
              Guardar
            </button>

            <button type="button" className="event-modal-cancel-button" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}