import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import Grid from "../../components/ui/grid";
import SalonsStats from "./salonsstats";
import AgregarSalon from "./agregarSalon";
import Popup from "../../components/ui/popup";
import {
  getSalons,
  createSalon,
  updateSalon,
  deleteSalon,
} from "../../api/salons.api";
import type { SalonsDTO } from "../../api/salons.api";
import "../../styles/salonsdashboard.css";

export default function SalonsDashboard() {
  const [salons, setSalons] = useState<SalonsDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [salonParaEditar, setSalonParaEditar] = useState<SalonsDTO | null>(null);
  const [busqueda, setBusqueda] = useState("");
  
  // Estado para controlar la visibilidad de los salones inactivos
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState<string | undefined>(undefined);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    cargarSalones();
  }, []);

  const cargarSalones = async () => {
    try {
      setCargando(true);
      const datos = await getSalons();
      setSalons(datos);
    } catch (error) {
      console.error("Error cargando salones:", error);
      mostrarPopup("Error", "No se pudieron cargar los salones", "error");
    } finally {
      setCargando(false);
    }
  };

  const salonesFiltrados = salons.filter((salon) =>
    salon.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    salon.localizacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const salonesActivos = salonesFiltrados.filter((s) => Number(s.estado) === 1);
  const salonesInactivos = salonesFiltrados.filter((s) => Number(s.estado) === 0);

  const abrirFormularioNuevo = () => {
    setSalonParaEditar(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEdicion = (salon: SalonsDTO) => {
    setSalonParaEditar(salon);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setSalonParaEditar(null);
  };

  const mostrarPopup = (
    title: string,
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupType(type);
    setPopupOpen(true);
  };

  const handleGuardarSalon = async (salonData: Partial<SalonsDTO>) => {
    try {
      if (salonParaEditar?.id != null) {
        const salonActualizado = await updateSalon(salonParaEditar.id, salonData);
        setSalons((prev) =>
          prev.map((item) =>
            item.id === salonParaEditar.id ? { ...salonActualizado } : item
          )
        );
        cerrarFormulario();
        mostrarPopup("Salón actualizado", "Los datos del salón se guardaron correctamente.", "success");
      } else {
        const salonCreado = await createSalon(salonData);
        setSalons((prev) => [...prev, { ...salonCreado }]);
        cerrarFormulario();
        mostrarPopup("Salón agregado", "El salón se guardó correctamente.", "success");
      }
    } catch (error) {
      console.error("Error guardando salón:", error);
      mostrarPopup("Error", "No se pudo guardar el salón. Intenta nuevamente.", "error");
    }
  };

  const handleEliminarSalon = async (id?: number) => {
    if (id == null) return;

    try {
      const salonEliminado = await deleteSalon(id);
      setSalons((prev) =>
        prev.map((salon) =>
          salon.id === id ? { ...salonEliminado } : salon
        )
      );
      mostrarPopup("Salón eliminado", "El salón se eliminó correctamente.", "success");
    } catch (error) {
      console.error("Error eliminando salón:", error);
      mostrarPopup("Error", "No se pudo eliminar el salón. Intenta nuevamente.", "error");
    }
  };

  const renderCardSalon = (salon: SalonsDTO, index: number) => {
    const estaActivo = Number(salon.estado) === 1;

    return (
      <div key={salon.id ?? index} className="salons-dashboard-card" style={{ padding: "16px" }}>
        <div className="salons-dashboard-card-header" style={{ marginBottom: "12px" }}>
          <h4 className="salons-dashboard-card-title" style={{ margin: 0, textTransform: "lowercase" }}>
            {salon.nombre}
          </h4>
          <div className="salons-dashboard-card-actions">
            <button
              type="button"
              className="salons-dashboard-card-action"
              aria-label="Editar salón"
              onClick={() => abrirFormularioEdicion(salon)}
            >
              <FaEdit />
            </button>
            <button
              type="button"
              className="salons-dashboard-card-action"
              aria-label="Eliminar salón"
              onClick={() => handleEliminarSalon(salon.id)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
        <div className="salons-dashboard-card-details" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <p className="salons-dashboard-card-detail" style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
            <FaMapMarkerAlt style={{ color: "#ef4444", flexShrink: 0 }} />
            <span>{salon.localizacion}</span>
          </p>
          <p className="salons-dashboard-card-detail" style={{ margin: 0 }}>
            capacidad: <strong>{salon.mincapacidad} - {salon.maxcapacidad}</strong> personas
          </p>
          <p className="salons-dashboard-card-detail" style={{ margin: 0 }}>
            estado:{" "}
            <span
              className="salons-dashboard-status"
              style={{
                color: estaActivo ? "#4dff4d" : "#ff4d4d",
                fontWeight: "600",
              }}
            >
              {estaActivo ? "activo" : "inactivo"}
            </span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="salons-dashboard">
      <div className="salons-dashboard-header">
        <h1 className="salons-dashboard-title">Gestión de Salones</h1>
        <Button onClick={abrirFormularioNuevo} className="salons-dashboard-button">
          + Agregar
        </Button>
      </div>

      <Grid cols={1} gap={4} className="salons-dashboard-grid">
        <div>
          <SalonsStats salons={salons} />
        </div>
      </Grid>

      <AgregarSalon
        open={mostrarFormulario}
        onClose={cerrarFormulario}
        onSubmit={handleGuardarSalon}
        salonInicial={salonParaEditar ?? undefined}
      />

      <Popup
        open={popupOpen}
        title={popupTitle}
        message={popupMessage}
        type={popupType}
        onClose={() => setPopupOpen(false)}
      />

      <hr className="salons-dashboard-hr" />

     {/* Control de búsqueda y filtro exclusivo de inactivos */}
      <div className="salons-dashboard-search" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por nombre o localización..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="salons-dashboard-search-input"
          style={{ flex: 1 }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", cursor: "pointer", fontSize: "14px", userSelect: "none" }}>
          <input
            type="checkbox"
            checked={mostrarInactivos}
            onChange={(e) => setMostrarInactivos(e.target.checked)}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          Ver inactivos
        </label>
      </div>

      {/* Renderizado exclusivo según el estado del checkbox */}
      {!mostrarInactivos ? (
        <>
          <h3 className="salons-dashboard-inventory-title">Salones Activos</h3>

          {cargando ? (
            <p className="salons-dashboard-no-results">Cargando salones...</p>
          ) : salonesActivos.length > 0 ? (
            <Grid cols={3} gap={4}>
              {salonesActivos.map((salon, index) => renderCardSalon(salon, index))}
            </Grid>
          ) : (
            <p className="salons-dashboard-no-results">No se encontraron salones activos.</p>
          )}
        </>
      ) : (
        <>
          <h3 className="salons-dashboard-inventory-title">Salones Inactivos</h3>

          {cargando ? (
            <p className="salons-dashboard-no-results">Cargando salones...</p>
          ) : salonesInactivos.length > 0 ? (
            <Grid cols={3} gap={4}>
              {salonesInactivos.map((salon, index) => renderCardSalon(salon, index))}
            </Grid>
          ) : (
            <p className="salons-dashboard-no-results">No se encontraron salones inactivos.</p>
          )}
        </>
      )}
    </div>
  );
}