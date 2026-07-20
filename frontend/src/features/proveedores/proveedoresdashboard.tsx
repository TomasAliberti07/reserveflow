import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTruck, FaFileInvoice, FaHistory } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import Grid from "../../components/ui/grid";
import AgregarProveedor from "./agregarproveedor";
import Popup from "../../components/ui/popup";
import PedidosFeature from "./pedidos";
import PedidoHistorial from "./pedidohistorial"; // <-- Importamos el historial
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from "../../api/proveedores.api";
import type { Proveedor, CreateProveedorDto } from "../../api/proveedores.api";
import "../../styles/proveedoresdashboard.css"; 

export default function ProveedoresDashboard() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Ampliamos el estado para incluir "HISTORIAL"
  const [vistaActiva, setVistaActiva] = useState<"PROVEEDORES" | "PEDIDOS" | "HISTORIAL">("PROVEEDORES");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedorParaEditar, setProveedorParaEditar] = useState<Proveedor | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState<string | undefined>(undefined);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setCargando(true);
      const datos = await getProveedores();
      setProveedores(datos);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
    } finally {
      setCargando(false);
    }
  };

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.rubro && p.rubro.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const abrirFormularioNuevo = () => {
    setProveedorParaEditar(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEdicion = (proveedor: Proveedor) => {
    setProveedorParaEditar(proveedor);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProveedorParaEditar(null);
  };

  const mostrarPopup = (title: string, message: string, type: "success" | "error" | "info") => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupType(type);
    setPopupOpen(true);
  };

  const handleGuardarProveedor = async (proveedorData: CreateProveedorDto) => {
    try {
      if (proveedorParaEditar?.id != null) {
        const proveedorActualizado = await updateProveedor(proveedorParaEditar.id, proveedorData);
        setProveedores((prev) =>
          prev.map((item) => (item.id === proveedorParaEditar.id ? proveedorActualizado : item))
        );
        cerrarFormulario();
        mostrarPopup("Proveedor actualizado", "Los datos se guardaron correctamente.", "success");
      } else {
        const proveedorCreado = await createProveedor(proveedorData);
        setProveedores((prev) => [...prev, proveedorCreado]);
        cerrarFormulario();
        mostrarPopup("Proveedor agregado", "El proveedor se guardó correctamente.", "success");
      }
    } catch (error) {
      console.error("Error guardando proveedor:", error);
      mostrarPopup("Error", "No se pudo guardar el proveedor. Intenta nuevamente.", "error");
    }
  };

  const handleEliminarProveedor = async (id?: number) => {
    if (id == null) return;
    try {
      await deleteProveedor(id);
      setProveedores((prev) => prev.filter((p) => p.id !== id));
      mostrarPopup("Proveedor eliminado", "El proveedor se eliminó correctamente.", "success");
    } catch (error) {
      console.error("Error eliminando proveedor:", error);
      mostrarPopup("Error", "No se pudo eliminar el proveedor. Intenta nuevamente.", "error");
    }
  };

  return (
    <div className="proveedor-dashboard"> 
      <div className="proveedor-dashboard-header">
        <h1 className="proveedor-dashboard-title">Gestión de Proveedores</h1>
        {vistaActiva === "PROVEEDORES" && (
          <Button onClick={abrirFormularioNuevo} className="proveedor-dashboard-button">
            + Agregar
          </Button>
        )}
      </div>

      {/* --- SUBMENÚ DE SECCIONES INTERNAS --- */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button 
          type="button"
          onClick={() => setVistaActiva("PROVEEDORES")}
          style={{
            padding: "10px 15px",
            backgroundColor: vistaActiva === "PROVEEDORES" ? "#4dc3ff" : "#334155",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "bold"
          }}
        >
          <FaTruck /> Lista Proveedores
        </button>

        <button 
          type="button"
          onClick={() => setVistaActiva("PEDIDOS")}
          style={{
            padding: "10px 15px",
            backgroundColor: vistaActiva === "PEDIDOS" ? "#4dc3ff" : "#334155",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "bold"
          }}
        >
          <FaFileInvoice /> Generar Pedidos
        </button>

        <button 
          type="button"
          onClick={() => setVistaActiva("HISTORIAL")}
          style={{
            padding: "10px 15px",
            backgroundColor: vistaActiva === "HISTORIAL" ? "#4dc3ff" : "#334155",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "bold"
          }}
        >
          <FaHistory /> Historial Pedidos
        </button>
      </div>

      <AgregarProveedor
        open={mostrarFormulario}
        onClose={cerrarFormulario}
        onSubmit={handleGuardarProveedor}
        proveedorInicial={proveedorParaEditar ?? undefined}
      />

      <Popup
        open={popupOpen}
        title={popupTitle}
        message={popupMessage}
        type={popupType}
        onClose={() => setPopupOpen(false)}
      />

      <hr className="proveedor-dashboard-hr" />
      
      {/* RENDERIZADO CONDICIONAL DE ACUERDO A LA SELECCIÓN DEL SUBMENÚ */}
      {vistaActiva === "PROVEEDORES" && (
        <>
          <div className="proveedor-dashboard-search">
            <input
              type="text"
              placeholder="Buscar proveedor por nombre o rubro..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="proveedor-dashboard-search-input"
            />
          </div>

          <h3 className="proveedor-dashboard-inventory-title">Lista de Proveedores</h3>
          
          {cargando ? (
            <p className="proveedor-dashboard-no-results">Cargando proveedores...</p>
          ) : (
            <Grid cols={3} gap={4}>
              {proveedoresFiltrados.map((p, index) => (
                <div key={p.id ?? index} className="proveedor-dashboard-card">
                  <div className="proveedor-dashboard-card-header">
                    <h4 className="proveedor-dashboard-card-title">{p.nombre}</h4>
                    <div className="proveedor-dashboard-card-actions">
                      <button
                        type="button"
                        className="proveedor-dashboard-card-action"
                        onClick={() => abrirFormularioEdicion(p)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="proveedor-dashboard-card-action"
                        onClick={() => handleEliminarProveedor(p.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="proveedor-dashboard-card-details">
                    <p className="proveedor-dashboard-card-detail">Celular: <strong>{p.cel}</strong></p>
                    <p className="proveedor-dashboard-card-detail">Rubro: {p.rubro || "Sin especificar"}</p>
                    <p className="proveedor-dashboard-card-detail">
                      Tipo: <span className="proveedor-tipo-tag" style={{ color: p.tipo === "BEBIDA" ? "#4dff4d" : "#4dc3ff" }}>{p.tipo}</span>
                    </p>
                  </div>
                </div>
              ))}
            </Grid>
          )}

          {!cargando && proveedoresFiltrados.length === 0 && (
            <p className="proveedor-dashboard-no-results">No se encontraron proveedores.</p>
          )}
        </>
      )}

      {vistaActiva === "PEDIDOS" && (
        <PedidosFeature proveedores={proveedores} onMostrarPopup={mostrarPopup} />
      )}

      {vistaActiva === "HISTORIAL" && (
        <PedidoHistorial onMostrarPopup={mostrarPopup} />
      )}
    </div>
  );
}