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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comienzo = formData.fecha_evento && formData.hora_inicio ? `${formData.fecha_evento}T${formData.hora_inicio}:00` : '';
    const finaliza = formData.fecha_evento && formData.hora_fin ? `${formData.fecha_evento}T${formData.hora_fin}:00` : '';
    
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
      comienzo,
      finaliza,
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

  const s = {
    form: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '14px',
    },
    row3: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '14px',
      width: '100%',
    },
    row4: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr',
      gap: '12px',
      width: '100%',
    },
    row2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      width: '100%',
    },
    group: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '5px',
      width: '100%',
    },
    label: {
      fontSize: '13px',
      color: '#cbd5e1',
      fontWeight: '500',
    },
    select: {
      width: '100%',
      height: '38px',
      background: '#252a3c',
      color: '#fff',
      border: '1px solid #3f445e',
      borderRadius: '6px',
      padding: '0 10px',
      boxSizing: 'border-box' as const,
      fontSize: '14px',
      outline: 'none',
    },
    actionRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '10px',
      width: '100%',
    },
    btnMas: {
      height: '38px',
      padding: '0 16px',
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold' as const,
      fontSize: '16px',
    },
    gastroBox: {
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '12px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px',
    },
    // ESPACIO FIJO PREPARADO (No cambia de tamaño nunca)
    fixedBadgeContainer: {
      height: '110px', // Altura fija locked
      maxHeight: '110px',
      minHeight: '110px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      background: 'rgba(255, 255, 255, 0.01)',
      border: '1px solid rgba(255, 255, 255, 0.04)',
      padding: '10px 12px',
      borderRadius: '8px',
      width: '100%',
      overflowY: 'auto' as const, // Scroll local si se llena de items
    },
    placeholderText: {
      color: '#4b5563',
      fontSize: '13px',
      fontStyle: 'italic',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
    },
    textarea: {
      width: '100%',
      height: '65px',
      background: '#252a3c',
      color: '#fff',
      border: '1px solid #3f445e',
      borderRadius: '6px',
      padding: '8px',
      boxSizing: 'border-box' as const,
      fontSize: '14px',
      resize: 'none' as const,
      outline: 'none',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      marginTop: '4px',
    },
    btnGuardar: {
      height: '38px',
      padding: '0 32px',
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '500' as const,
      cursor: 'pointer',
    },
  };

  const tieneItemsAgregados = formData.menus_seleccionados.length > 0 || formData.bebidas_seleccionadas.length > 0;

  return (
    <form onSubmit={handleSubmit} style={s.form}>
      <div style={s.row3}>
        <Input label="Email" name="cliente_email" type="email" value={formData.cliente_email} onChange={handleInputChange} />
        <Input label="Teléfono" name="cliente_numero" type="tel" value={formData.cliente_numero} onChange={handleInputChange} />
        <Input label="Cantidad de invitados" name="cant_invitados_display" type="number" value={formData.cant_invitados_display} placeholder="0" onChange={handleInputChange} />
      </div>

      <div style={s.row4}>
        <div style={s.group}>
          <label style={s.label} htmlFor="salon_id">Salón</label>
          <select id="salon_id" name="salon_id" style={s.select} value={formData.salon_id} onChange={handleInputChange}>
            <option value={0}>Seleccione un salón</option>
            {salons?.map((s) => (<option key={s.id} value={s.id ?? 0}>{s.nombre}</option>))}
          </select>
        </div>

        <div style={s.group}>
          <DateSelect label="Fecha del evento" name="fecha_evento" value={formData.fecha_evento} onChange={(value) => handleChange('fecha_evento', value)} />
        </div>

        <div style={s.group}>
          <TimeSelect label="Hora de inicio" name="hora_inicio" value={formData.hora_inicio} onChange={(value) => handleChange('hora_inicio', value)} />
        </div>

        <div style={s.group}>
          <TimeSelect label="Hora de finalización" name="hora_fin" value={formData.hora_fin} onChange={(value) => handleChange('hora_fin', value)} />
        </div>
      </div>

      <div style={s.row2}>
        {/* BLOQUE DE MENÚ */}
        <div style={s.gastroBox}>
          <div style={s.group}>
            <label style={s.label} htmlFor="menu_id">Menú</label>
            <select id="menu_id" style={s.select} value={menuIdActual} onChange={(e) => setMenuIdActual(Number(e.target.value))}>
              <option value={0}>Seleccione un menú</option>
              {menus?.map((m) => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
            </select>
          </div>
          <div style={s.actionRow}>
            <div style={{ flex: 1 }}>
              <Input label="Cantidad de menús" name="menu_cantidad_input" type="number" min={1} value={cantMenuActual} onChange={(e) => setCantMenuActual(Number(e.target.value))} />
            </div>
            <button type="button" style={s.btnMas} onClick={handleAgregarMenu}>+</button>
          </div>
        </div>

        {/* BLOQUE DE BEBIDA */}
        <div style={s.gastroBox}>
          <div style={s.group}>
            <label style={s.label} htmlFor="bebida_id">Bebida</label>
            <select id="bebida_id" style={s.select} value={bebidaIdActual} onChange={(e) => setBebidaIdActual(Number(e.target.value))}>
              <option value={0}>Seleccione una bebida</option>
              {bebidas?.map((b) => (<option key={b.id} value={b.id}>{b.nombre}</option>))}
            </select>
          </div>
          <div style={s.actionRow}>
            <div style={{ flex: 1 }}>
              <Input label="Cantidad" name="cant_bebida" type="number" min={1} value={cantBebidaActual} onChange={(e) => setCantBebidaActual(Number(e.target.value))} />
            </div>
            <button type="button" style={s.btnMas} onClick={handleAgregarBebida}>+</button>
          </div>
        </div>
      </div>

      {/* ESPACIO PREPARADO FIJO (No cambia de tamaño, previene saltos) */}
      <div style={s.fixedBadgeContainer} className="custom-scrollbar">
        {!tieneItemsAgregados ? (
          <div style={s.placeholderText}>
            Sin menús ni bebidas seleccionadas para la reserva.
          </div>
        ) : (
          <>
            {formData.menus_seleccionados.length > 0 && (
              <div className="selected-drinks-block" style={{ width: '100%' }}>
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
              <div className="selected-drinks-block" style={{ width: '100%', marginTop: formData.menus_seleccionados.length > 0 ? '6px' : '0' }}>
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

      <div style={s.group}>
        <label style={s.label} htmlFor="notas">Notas</label>
        <textarea id="notas" name="notas" style={s.textarea} value={formData.notas ?? ''} onChange={handleInputChange} />
      </div>

      <div style={s.footer}>
        <button type="submit" style={s.btnGuardar}>
          Guardar
        </button>
      </div>
    </form>
  );
}