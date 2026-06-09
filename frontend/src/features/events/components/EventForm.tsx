import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Input } from '../../../components/ui/input';
import { DateSelect } from './DateSelect';
import { TimeSelect } from './TimeSelect';
import type { EventoDTO } from '../../../api/events.api';
import type { SalonsDTO } from '../../../api/salons.api';
import '../../../styles/dateTimeSelect.css';

export interface MenuOptionDTO {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface BebidaOptionDTO {
  id: number;
  nombre: string;
}

type EventoFormProps = {
  salons: SalonsDTO[];
  menus: MenuOptionDTO[];
  bebidas: BebidaOptionDTO[];
  onSubmit: (data: EventoDTO) => void;
  initialData?: EventoDTO;
};

function toDateLocal(value?: string) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}-${month}-${day}`;
}

function toTimeLocal(value?: string) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${hours}:${minutes}`;
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

type CantInvitadosType = number | '';

type BebidaSeleccionada = {
  bebida_id: number;
  cant: number;
  nombre: string;
};

type MenuSeleccionado = {
  menu_id: number;
  cant: number;
  nombre: string;
};

type EventFormState = EventoDTO & {
  fecha_evento: string;
  hora_inicio: string;
  hora_fin: string;
  cant_invitados_display: CantInvitadosType;
  menus_seleccionados: MenuSeleccionado[];
  bebidas_seleccionadas: BebidaSeleccionada[];
};

const emptyFormState: EventFormState = {
  ...emptyEvento,
  fecha_evento: '',
  hora_inicio: '',
  hora_fin: '',
  cant_invitados_display: '',
  menus_seleccionados: [],
  bebidas_seleccionadas: [],
};

type ValidationErrors = Partial<Record<keyof EventFormState | 'general', string>>;

const getTodayDateString = () => {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};

const buildDateTime = (date: string, time: string) => {
  return new Date(`${date}T${time}:00`);
};

const formatLocalDateTime = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

export default function EventForm({ salons, menus, bebidas, onSubmit, initialData }: EventoFormProps) {
  const [formData, setFormData] = useState<EventFormState>(() => ({
    ...emptyFormState,
    ...(initialData ?? {}),
    fecha_evento: toDateLocal(initialData?.comienzo),
    hora_inicio: toTimeLocal(initialData?.comienzo),
    hora_fin: toTimeLocal(initialData?.finaliza),
    notas: initialData?.notas ?? '',
    cant_invitados_display: initialData?.cant_invitados ? initialData.cant_invitados : '',
  }));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [minDate] = useState(getTodayDateString());

  const [menuIdActual, setMenuIdActual] = useState<number>(0);
  const [cantMenuActual, setCantMenuActual] = useState<number>(1);

  const [bebidaIdActual, setBebidaIdActual] = useState<number>(0);
  const [cantBebidaActual, setCantBebidaActual] = useState<number>(1);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...emptyFormState,
        ...initialData,
        fecha_evento: toDateLocal(initialData.comienzo),
        hora_inicio: toTimeLocal(initialData.comienzo),
        hora_fin: toTimeLocal(initialData.finaliza),
        notas: initialData.notas ?? '',
        cant_invitados_display: initialData.cant_invitados ? initialData.cant_invitados : '',
        menus_seleccionados: [], 
        bebidas_seleccionadas: [],
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof EventFormState, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'salon_id') {
      handleChange(name as keyof EventFormState, Number(value));
      return;
    }
    if (name === 'cant_invitados_display') {
      const numValue = value === '' ? '' : Number(value);
      handleChange('cant_invitados_display', numValue);
      return;
    }
    handleChange(name as keyof EventFormState, value);
  };

  const handleAgregarMenu = () => {
    if (menuIdActual === 0) return alert('Por favor, selecciona un menú');
    if (cantMenuActual <= 0) return alert('La cantidad debe ser mayor a 0');

    const menuSeleccionado = menus.find((m) => m.id === menuIdActual);
    if (!menuSeleccionado) return;

    setFormData((prev) => ({
      ...prev,
      menus_seleccionados: [...prev.menus_seleccionados, { menu_id: menuIdActual, cant: cantMenuActual, nombre: menuSeleccionado.nombre }],
    }));
    setMenuIdActual(0);
    setCantMenuActual(1);
  };

  const handleEliminarMenu = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      menus_seleccionados: prev.menus_seleccionados.filter((_, i) => i !== index),
    }));
  };

  const handleAgregarBebida = () => {
    if (bebidaIdActual === 0) return alert('Por favor, selecciona una bebida');
    if (cantBebidaActual <= 0) return alert('La cantidad debe ser mayor a 0');

    const bebidaSeleccionada = bebidas.find((b) => b.id === bebidaIdActual);
    if (!bebidaSeleccionada) return;

    setFormData((prev) => ({
      ...prev,
      bebidas_seleccionadas: [...prev.bebidas_seleccionadas, { bebida_id: bebidaIdActual, cant: cantBebidaActual, nombre: bebidaSeleccionada.nombre }],
    }));
    setBebidaIdActual(0);
    setCantBebidaActual(1);
  };

  const handleEliminarBebida = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bebidas_seleccionadas: prev.bebidas_seleccionadas.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    const email = formData.cliente_email.trim();
    const phone = formData.cliente_numero.trim();
    const inicioValido = Boolean(formData.fecha_evento && formData.hora_inicio);
    const finValido = Boolean(formData.fecha_evento && formData.hora_fin);
    const comienzo = inicioValido ? buildDateTime(formData.fecha_evento, formData.hora_inicio) : null;
    const finaliza = finValido ? buildDateTime(formData.fecha_evento, formData.hora_fin) : null;
    const ahora = new Date();

    if (!formData.salon_id || formData.salon_id === 0) {
      newErrors.salon_id = 'Seleccione un salón';
    }
    if (!formData.cliente_nombre.trim()) {
      newErrors.cliente_nombre = 'Nombre es obligatorio';
    }
    if (!formData.cliente_apellido.trim()) {
      newErrors.cliente_apellido = 'Apellido es obligatorio';
    }
    if (!email) {
      newErrors.cliente_email = 'Email es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.cliente_email = 'Ingrese un email válido';
    }
    if (!phone) {
      newErrors.cliente_numero = 'Teléfono es obligatorio';
    } else if (!/^[0-9+()\- ]{7,20}$/.test(phone)) {
      newErrors.cliente_numero = 'Ingrese un teléfono válido';
    }
    if (formData.cant_invitados_display !== '' && Number(formData.cant_invitados_display) < 0) {
      newErrors.cant_invitados_display = 'La cantidad de invitados debe ser mayor o igual a 0';
    }
    if (!formData.fecha_evento) {
      newErrors.fecha_evento = 'Seleccione la fecha del evento';
    } else if (buildDateTime(formData.fecha_evento, '00:00') < buildDateTime(minDate, '00:00')) {
      newErrors.fecha_evento = 'No se puede cargar un evento con fecha anterior';
    }
    if (!formData.hora_inicio) {
      newErrors.hora_inicio = 'Seleccione la hora de inicio';
    }
    if (!formData.hora_fin) {
      newErrors.hora_fin = 'Seleccione la hora de finalización';
    }
    if (comienzo && comienzo < ahora) {
      newErrors.fecha_evento = 'La fecha y hora de inicio no pueden ser anteriores al momento actual';
    }
    if (comienzo && finaliza) {
      const finalTime = finaliza <= comienzo ? new Date(finaliza.getTime() + 24 * 60 * 60 * 1000) : finaliza;
      if (finalTime <= comienzo) {
        newErrors.hora_fin = 'La hora de fin debe ser posterior a la hora de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const comienzoDate = buildDateTime(formData.fecha_evento, formData.hora_inicio);
    let finalizaDate = buildDateTime(formData.fecha_evento, formData.hora_fin);
    if (finalizaDate <= comienzoDate) {
      finalizaDate = new Date(finalizaDate.getTime() + 24 * 60 * 60 * 1000);
    }

    if (finalizaDate <= comienzoDate) {
      setErrors({ general: 'La hora de finalización debe ser posterior a la hora de inicio' });
      return;
    }

    const submitData: EventoDTO & {
      menus?: Array<{ menu_id: number; cant: number }>;
      bebidas?: Array<{ bebida_id: number; cant: number }>;
    } = {
      salon_id: formData.salon_id,
      cliente_nombre: formData.cliente_nombre.trim(),
      cliente_apellido: formData.cliente_apellido.trim(),
      cliente_email: formData.cliente_email.trim(),
      cliente_numero: formData.cliente_numero.trim(),
      cant_invitados: formData.cant_invitados_display === '' ? 0 : Number(formData.cant_invitados_display),
      comienzo: formatLocalDateTime(comienzoDate),
      finaliza: formatLocalDateTime(finalizaDate),
      notas: formData.notas?.trim(),
    };

    if (formData.menus_seleccionados.length > 0) {
      submitData.menus = formData.menus_seleccionados.map((m) => ({ menu_id: m.menu_id, cant: Number(m.cant) }));
    }
    if (formData.bebidas_seleccionadas.length > 0) {
      submitData.bebidas = formData.bebidas_seleccionadas.map((b) => ({ bebida_id: b.bebida_id, cant: Number(b.cant) }));
    }
    onSubmit(submitData);
  };


  const tieneItemsAgregados = formData.menus_seleccionados.length > 0 || formData.bebidas_seleccionadas.length > 0;

  return (
    <form id="event-form" onSubmit={handleSubmit} className="event-form event-form-root">
      {errors.general ? <div className="form-error">{errors.general}</div> : null}
      <div className="event-form-row3">
        <Input label="Nombre" name="cliente_nombre" type="text" value={formData.cliente_nombre} placeholder="Nombre" onChange={handleInputChange} />
        <Input label="Apellido" name="cliente_apellido" type="text" value={formData.cliente_apellido} placeholder="Apellido" onChange={handleInputChange} />
      </div>

      <div className="event-form-row3">
        <Input label="Email" name="cliente_email" type="email" value={formData.cliente_email} onChange={handleInputChange} />
        <Input label="Teléfono" name="cliente_numero" type="tel" value={formData.cliente_numero} onChange={handleInputChange} />
        <Input label="Cantidad de invitados" name="cant_invitados_display" type="number" value={formData.cant_invitados_display} placeholder="0" onChange={handleInputChange} />
      </div>

      <div className="event-form-row4">
        <div className="event-form-group">
          <label className="event-form-label" htmlFor="salon_id">Salón</label>
          <select id="salon_id" name="salon_id" className="event-form-select" value={formData.salon_id} onChange={handleInputChange}>
            <option value={0}>Seleccione un salón</option>
            {salons?.map((s) => (<option key={s.id} value={s.id ?? 0}>{s.nombre}</option>))}
          </select>
        </div>

        <div className="event-form-group">
          <DateSelect
            label="Fecha del evento"
            name="fecha_evento"
            value={formData.fecha_evento}
            min={minDate}
            onChange={(value) => handleChange('fecha_evento', value)}
            error={Boolean(errors.fecha_evento)}
            errorMessage={errors.fecha_evento}
          />
        </div>

        <div className="event-form-group">
          <TimeSelect
            label="Hora de inicio"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={(value) => handleChange('hora_inicio', value)}
            error={Boolean(errors.hora_inicio)}
            errorMessage={errors.hora_inicio}
          />
        </div>

        <div className="event-form-group">
          <TimeSelect
            label="Hora de finalización"
            name="hora_fin"
            value={formData.hora_fin}
            onChange={(value) => handleChange('hora_fin', value)}
            error={Boolean(errors.hora_fin)}
            errorMessage={errors.hora_fin}
          />
        </div>
      </div>

      <div className="event-form-row2">
        {/* BLOQUE DE MENÚ */}
        <div className="event-form-gastro-box">
          <div className="event-form-group">
            <label className="event-form-label" htmlFor="menu_id">Menú</label>
            <select id="menu_id" className="event-form-select" value={menuIdActual} onChange={(e) => setMenuIdActual(Number(e.target.value))}>
              <option value={0}>Seleccione un menú</option>
              {menus?.map((m) => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
            </select>
          </div>
          <div className="event-form-action-row">
            <div className="event-form-flex-grow">
              <Input label="Cantidad de menús" name="menu_cantidad_input" type="number" min={1} value={cantMenuActual} onChange={(e) => setCantMenuActual(Number(e.target.value))} />
            </div>
            <button type="button" className="event-form-btn-add" onClick={handleAgregarMenu}>+</button>
          </div>
        </div>

        {/* BLOQUE DE BEBIDA */}
        <div className="event-form-gastro-box">
          <div className="event-form-group">
            <label className="event-form-label" htmlFor="bebida_id">Bebida</label>
            <select id="bebida_id" className="event-form-select" value={bebidaIdActual} onChange={(e) => setBebidaIdActual(Number(e.target.value))}>
              <option value={0}>Seleccione una bebida</option>
              {bebidas?.map((b) => (<option key={b.id} value={b.id}>{b.nombre}</option>))}
            </select>
          </div>
          <div className="event-form-action-row">
            <div className="event-form-flex-grow">
              <Input label="Cantidad" name="cant_bebida" type="number" min={1} value={cantBebidaActual} onChange={(e) => setCantBebidaActual(Number(e.target.value))} />
            </div>
            <button type="button" className="event-form-btn-add" onClick={handleAgregarBebida}>+</button>
          </div>
        </div>
      </div>

      {/* ESPACIO PREPARADO FIJO (No cambia de tamaño, previene saltos) */}
      <div className="event-form-fixed-badge-container custom-scrollbar">
        {!tieneItemsAgregados ? (
          <div className="event-form-placeholder-text">
            Sin menús ni bebidas seleccionadas para la reserva.
          </div>
        ) : (
          <>
            {formData.menus_seleccionados.length > 0 && (
              <div className="selected-drinks-block">
                <div className="selected-drinks-title">Menús seleccionados:</div>
                <div className="selected-drinks-list">
                  {formData.menus_seleccionados.map((menu, index) => (
                    <div key={index} className="selected-drink-item">
                      <span>{menu.nombre} x{menu.cant}</span>
                      <button type="button" className="selected-drink-remove" onClick={() => handleEliminarMenu(index)}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.bebidas_seleccionadas.length > 0 && (
              <div className="selected-drinks-block">
                <div className="selected-drinks-title">Bebidas seleccionadas:</div>
                <div className="selected-drinks-list">
                  {formData.bebidas_seleccionadas.map((bebida, index) => (
                    <div key={index} className="selected-drink-item">
                      <span>{bebida.nombre} x{bebida.cant}</span>
                      <button type="button" className="selected-drink-remove" onClick={() => handleEliminarBebida(index)}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="event-form-group">
        <label className="event-form-label" htmlFor="notas">Notas</label>
        <textarea id="notas" name="notas" className="event-form-notes-textarea" value={formData.notas ?? ''} onChange={handleInputChange} />
      </div>
    </form>
  );
}