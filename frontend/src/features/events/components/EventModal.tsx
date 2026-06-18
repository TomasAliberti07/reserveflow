import { useState, useEffect } from 'react';
import ValidationPopup from '../../../components/ui/validationPopup';
import EventForm from './EventForm';
import { createEvent, updateEvent } from '../../../api/events.api';
import { getMenus } from '../../../api/menus.api'; 
import { getBebidas } from '../../../api/bebida.api'; 
import type { SalonsDTO } from '../../../api/salons.api';
import type { EventoDTO } from '../../../api/events.api';
import { useValidationPopup } from '../../../hooks/useValidationPopup';


type Props = {
  isOpen: boolean;
  onClose: () => void;
  salons: SalonsDTO[];
  onEventCreated: () => void;
  initialData?: EventoDTO;
};

export default function EventModal({ isOpen, onClose, salons, onEventCreated, initialData }: Props) {
  const { popup, showSuccess, showError, closePopup } = useValidationPopup();
  const [submitting, setSubmitting] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);
  const [bebidas, setBebidas] = useState<any[]>([]);
  const [shouldRefreshOnClose, setShouldRefreshOnClose] = useState(false);

  const handlePopupClose = () => {
    closePopup();
    if (shouldRefreshOnClose) {
      try {
        onEventCreated();
      } catch (err) {
        // ignore
      }
      setShouldRefreshOnClose(false);
    }
    onClose();
  };

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

  const handleSubmit = async (data: EventoDTO) => {
    setSubmitting(true);
    try {
      if (initialData?.id) {
        await updateEvent(initialData.id, data);
        showSuccess('La reserva se actualizó correctamente.', 'Reserva actualizada');
      } else {
        await createEvent(data);
        showSuccess('La reserva se creó correctamente.', 'Reserva creada');
      }

      setShouldRefreshOnClose(true);
    } catch (error: any) {
      setShouldRefreshOnClose(false);
      const msg = error?.response?.data?.message || error?.message || 'Error al crear la reserva.';
      showError(String(msg), 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ValidationPopup popup={popup} closePopup={handlePopupClose} />

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
              initialData={initialData}
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