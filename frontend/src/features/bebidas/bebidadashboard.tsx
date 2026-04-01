import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import Grid from "../../components/ui/grid";

import BebidaStats from "./bebidastats";
import AgregarBebida from "./agregarbebida";
import Popup from "../../components/ui/popup";
import { getBebidas, createBebida, updateBebida, deleteBebida } from "../../api/bebida.api";
import type { BebidaDTO } from "../../api/bebida.api";
import "../../styles/bebidadashboard.css";

export default function BebidaDashboard() {
  const [bebidas, setBebidas] = useState<BebidaDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [bebidaParaEditar, setBebidaParaEditar] = useState<BebidaDTO | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState<string | undefined>(undefined);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");

  // Cargar bebidas de la API al montar el componente
  useEffect(() => {
    cargarBebidas();
  }, []);

  const cargarBebidas = async () => {
    try {
      setCargando(true);
      const datos = await getBebidas();
      setBebidas(datos);
    } catch (error) {
      console.error("Error cargando bebidas:", error);
    } finally {
      setCargando(false);
    }
  };

  const bebidasFiltradas = bebidas.filter((bebida) =>
    bebida.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormularioNuevo = () => {
    setBebidaParaEditar(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEdicion = (bebida: BebidaDTO) => {
    setBebidaParaEditar(bebida);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setBebidaParaEditar(null);
  };

  const mostrarPopup = (title: string, message: string, type: "success" | "error" | "info") => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupType(type);
    setPopupOpen(true);
  };

  const handleGuardarBebida = async (bebidaData: Partial<BebidaDTO>) => {
    try {
      if (bebidaParaEditar?.id != null) {
        const bebidaActualizada = await updateBebida(bebidaParaEditar.id, bebidaData);
        setBebidas((prev) => prev.map((item) => (item.id === bebidaParaEditar.id ? bebidaActualizada : item)));
        cerrarFormulario();
        mostrarPopup("Bebida actualizada", "Los datos de la bebida se guardaron correctamente.", "success");
      } else {
        const bebidaCreada = await createBebida(bebidaData);
        setBebidas((prev) => [...prev, bebidaCreada]);
        cerrarFormulario();
        mostrarPopup("Bebida agregada", "La bebida se guardó correctamente.", "success");
      }
    } catch (error) {
      console.error("Error guardando bebida:", error);
      mostrarPopup("Error", "No se pudo guardar la bebida. Intenta nuevamente.", "error");
    }
  };

  const handleEliminarBebida = async (id?: number) => {
    if (id == null) return;

    try {
      await deleteBebida(id);
      setBebidas((prev) => prev.filter((bebida) => bebida.id !== id));
      mostrarPopup("Bebida eliminada", "La bebida se eliminó correctamente.", "success");
    } catch (error) {
      console.error("Error eliminando bebida:", error);
      mostrarPopup("Error", "No se pudo eliminar la bebida. Intenta nuevamente.", "error");
    }
  };

  return (
    <div className="bebida-dashboard">
      <div className="bebida-dashboard-header">
        <h1 className="bebida-dashboard-title">Gestión de Bebidas</h1>
        <Button onClick={abrirFormularioNuevo} className="bebida-dashboard-button">
          + Agregar
        </Button>
      </div>

      <Grid cols={1} gap={4} className="bebida-dashboard-grid">
        <div>
          <BebidaStats bebidas={bebidas} />
        </div>
      </Grid>

      <AgregarBebida
        open={mostrarFormulario}
        onClose={cerrarFormulario}
        onSubmit={handleGuardarBebida}
        bebidaInicial={bebidaParaEditar ?? undefined}
      />

      <Popup
        open={popupOpen}
        title={popupTitle}
        message={popupMessage}
        type={popupType}
        onClose={() => setPopupOpen(false)}
      />

      <hr className="bebida-dashboard-hr" />
      
      {/* Barra de búsqueda */}
      <div className="bebida-dashboard-search">
        <input
          type="text"
          placeholder="Buscar bebida..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="bebida-dashboard-search-input"
        />
      </div>

      {/* Lista de bebidas usando Grid en lugar de tabla para mejor diseño responsivo */}
      <h3 className="bebida-dashboard-inventory-title">Inventario</h3>
      
      {cargando ? (
        <p className="bebida-dashboard-no-results">Cargando bebidas...</p>
      ) : (
        <Grid cols={3} gap={4}>
          {bebidasFiltradas.map((bebida, index) => (
            <div 
              key={bebida.id ?? index} 
              className="bebida-dashboard-card"
            >
              <div className="bebida-dashboard-card-header">
                <h4 className="bebida-dashboard-card-title">{bebida.nombre}</h4>
                <div className="bebida-dashboard-card-actions">
                  <button
                    type="button"
                    className="bebida-dashboard-card-action"
                    aria-label="Editar bebida"
                    onClick={() => abrirFormularioEdicion(bebida)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    className="bebida-dashboard-card-action"
                    aria-label="Eliminar bebida"
                    onClick={() => handleEliminarBebida(bebida.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="bebida-dashboard-card-details">
                <p className="bebida-dashboard-card-detail">Precio: <strong>${bebida.precio}</strong></p>
                <p className="bebida-dashboard-card-detail">Alcohol: {bebida.alcohol === 1 ? "Sí" : "No"}</p>
                <p className="bebida-dashboard-card-detail">Stock: <span className="bebida-dashboard-stock" style={{ color: bebida.stock === 0 ? "#ff4d4d" : "#4dff4d" }}>{bebida.stock} unidades</span></p>
              </div>
            </div>
          ))}
        </Grid>
      )}

      {!cargando && bebidasFiltradas.length === 0 && (
        <p className="bebida-dashboard-no-results">No se encontraron bebidas.</p>
      )}
    </div>
  );
}