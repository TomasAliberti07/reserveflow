import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Input } from '../../../components/ui/input';
import type { EventoDTO } from '../../../api/events.api';
import type { SalonsDTO } from '../../../api/salons.api';

type EventoFormProps = {
  salons: SalonsDTO[];
  onSubmit: (data: EventoDTO) => void;
  initialData?: EventoDTO;
};

function toDatetimeLocal(value?: string) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const emptyEvento: EventoDTO = {
  salon_id: 0,
  cliente_nombre: '',
  cliente_apellido: '',
  cliente_email: '',
  cliente_numero: '',
  cant_invitados: 0,
  comienzo: '',
  finaliza: '',
  notas: '',
};

export default function EventForm({ salons, onSubmit, initialData }: EventoFormProps) {
  const [formData, setFormData] = useState<EventoDTO>(() => ({
    ...emptyEvento,
    ...(initialData ?? {}),
    comienzo: toDatetimeLocal(initialData?.comienzo),
    finaliza: toDatetimeLocal(initialData?.finaliza),
    notas: initialData?.notas ?? '',
  }));

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...emptyEvento,
        ...initialData,
        comienzo: toDatetimeLocal(initialData.comienzo),
        finaliza: toDatetimeLocal(initialData.finaliza),
        notas: initialData.notas ?? '',
      });
    }
  }, [initialData]);

  const handleChange = (
    field: keyof EventoDTO,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'salon_id' || name === 'cant_invitados') {
      handleChange(name as keyof EventoDTO, Number(value));
      return;
    }

    handleChange(name as keyof EventoDTO, value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      cliente_nombre: formData.cliente_nombre.trim(),
      cliente_apellido: formData.cliente_apellido.trim(),
      cliente_email: formData.cliente_email.trim(),
      cliente_numero: formData.cliente_numero.trim(),
      notas: formData.notas?.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      {/* Fila 1: Nombre | Apellido | Email | Teléfono */}
      <Input
        label="Nombre"
        name="cliente_nombre"
        value={formData.cliente_nombre}
        onChange={handleInputChange}
      />

      <Input
        label="Apellido"
        name="cliente_apellido"
        value={formData.cliente_apellido}
        onChange={handleInputChange}
      />

      <Input
        label="Email"
        name="cliente_email"
        type="email"
        value={formData.cliente_email}
        onChange={handleInputChange}
      />

      <Input
        label="Teléfono"
        name="cliente_numero"
        type="tel"
        value={formData.cliente_numero}
        onChange={handleInputChange}
      />

      {/* Fila 2: Invitados | Salón | Comienzo | Finaliza */}
      <Input
        label="Cantidad de invitados"
        name="cant_invitados"
        type="number"
        value={formData.cant_invitados}
        onChange={handleInputChange}
      />

      <div className="input-group">
        <label htmlFor="salon_id">Salón</label>
        <select
          id="salon_id"
          name="salon_id"
          className="event-form-select"
          value={formData.salon_id}
          onChange={handleInputChange}
        >
          <option value={0}>Seleccione un salón</option>
          {salons.map((s) => (
            <option key={s.id} value={s.id ?? 0}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Comienzo"
        name="comienzo"
        type="datetime-local"
        value={formData.comienzo}
        onChange={handleInputChange}
      />

      <Input
        label="Finaliza"
        name="finaliza"
        type="datetime-local"
        value={formData.finaliza}
        onChange={handleInputChange}
      />

      {/* Fila 3: Notas (span 4) */}
      <div className="input-group event-form-field-full">
        <label htmlFor="notas">Notas</label>
        <textarea
          id="notas"
          name="notas"
          className="event-form-textarea"
          value={formData.notas ?? ''}
          onChange={handleInputChange}
        />
      </div>

      {/* Fila 4: Botón (span 4) */}
      <div className="event-form-actions event-form-field-full">
        <button type="submit" className="ui-button">
          Guardar
        </button>
      </div>
    </form>
  );
}
