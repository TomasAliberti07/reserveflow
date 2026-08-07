import React from 'react';
import EventForm from './EventForm';
import type { EventoDTO } from '../../../api/events.api';
import type { SalonsDTO } from '../../../api/salons.api';
import type { MenusDTO } from '../../../api/menus.api';
import type { BebidaDTO } from '../../../api/bebida.api'; 

// Re-exportamos los tipos oficiales para usarlos centralizadamente
export type MenuOptionDTO = MenusDTO;
export type BebidaOptionDTO = BebidaDTO;

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventoDTO) => void;
  salons: SalonsDTO[];
  menus: MenusDTO[];
  bebidas: BebidaDTO[];
  initialData?: EventoDTO;
  isSubmitting?: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  salons,
  menus,
  bebidas,
  initialData,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialData?.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="event-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="event-modal-title">
          {isEditing ? 'Editar Evento' : 'Nuevo Evento'}
        </h2>

        <div className="event-modal-body custom-scrollbar">
          <EventForm
            salons={salons}
            menus={menus}
            bebidas={bebidas}
            onSubmit={onSubmit}
            initialData={initialData}
          />
        </div>

        <div className="event-modal-footer">
          <button
            type="button"
            className="event-modal-cancel-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="event-form"
            className="event-modal-save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Evento'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;