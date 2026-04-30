import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
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
  const [salonParaEditar, setSalonParaEditar] = useState<SalonsDTO | null>(
    null
  );
  const [busqueda, setBusqueda] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState<string | undefined>(undefined);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  // Cargar salones de la API al montar el componente
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
      mostrarPopup(
        "Error",
        "No se pudieron cargar los salones",
        "error"
      );
    } finally {
      setCargando(false);
    }
  };

  const salonesFiltrados = salons.filter((salon) =>
    salon.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    salon.localizacion.toLowerCase().includes(busqueda.toLowerCase())
  );

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
        const salonActualizado = await updateSalon(
          salonParaEditar.id,
          salonData
        );
        setSalons((prev) =>
          prev.map((item) =>
            item.id === salonParaEditar.id ? salonActualizado : item
          )
        );
        cerrarFormulario();
        mostrarPopup(
          "Salón actualizado",
          "Los datos del salón se guardaron correctamente.",
          "success"
        );
      } else {
        const salonCreado = await createSalon(salonData);
        setSalons((prev) => [...prev, salonCreado]);
        cerrarFormulario();
        mostrarPopup(
          "Salón agregado",
          "El salón se guardó correctamente.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error guardando salón:", error);
      mostrarPopup(
        "Error",
        "No se pudo guardar el salón. Intenta nuevamente.",
        "error"
      );
    }
  };

  const handleEliminarSalon = async (id?: number) => {
    if (id == null) return;

    try {
      await deleteSalon(id);
      setSalons((prev) => prev.filter((salon) => salon.id !== id));
      mostrarPopup(
        "Salón eliminado",
        "El salón se eliminó correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error eliminando salón:", error);
      mostrarPopup(
        "Error",
        "No se pudo eliminar el salón. Intenta nuevamente.",
        "error"
      );
    }
  };

  return (
    <div className="salons-dashboard">
      <div className="salons-dashboard-header">
        <h1 className="salons-dashboard-title">Gestión de Salones</h1>
        <Button
          onClick={abrirFormularioNuevo}
          className="salons-dashboard-button"
        >
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

      {/* Barra de búsqueda */}
      <div className="salons-dashboard-search">
        <input
          type="text"
          placeholder="Buscar por nombre o localización..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="salons-dashboard-search-input"
        />
      </div>

      {/* Lista de salones usando Grid */}
      <h3 className="salons-dashboard-inventory-title">Salones Disponibles</h3>

      {cargando ? (
        <p className="salons-dashboard-no-results">Cargando salones...</p>
      ) : (
        <Grid cols={3} gap={4}>
          {salonesFiltrados.map((salon, index) => (
            <div
              key={salon.id ?? index}
              className="salons-dashboard-card"
            >
              <div className="salons-dashboard-card-header">
                <h4 className="salons-dashboard-card-title">{salon.nombre}</h4>
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
              <div className="salons-dashboard-card-details">
                <p className="salons-dashboard-card-detail">
                  📍 <strong>{salon.localizacion}</strong>
                </p>
                <p className="salons-dashboard-card-detail">
                  Capacidad: <strong>{salon.mincapacidad} - {salon.maxcapacidad}</strong> personas
                </p>
                <p className="salons-dashboard-card-detail">
                  Estado:{" "}
                  <span
                    className="salons-dashboard-status"
                    style={{
                      color: salon.estado ? "#4dff4d" : "#ff4d4d",
                    }}
                  >
                    {salon.estado ? "Activo" : "Inactivo"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </Grid>
      )}

      {!cargando && salonesFiltrados.length === 0 && (
        <p className="salons-dashboard-no-results">
          No se encontraron salones.
        </p>
      )}
    </div>
  );
}
