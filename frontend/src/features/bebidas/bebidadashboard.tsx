import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import Grid from "../../components/ui/grid"; 

import BebidaStats from "./bebidastats";
import AgregarBebida from "./agregarbebida";
import { getBebidas, createBebida } from "../../api/bebida.api";
import type { BebidaDTO } from "../../api/bebida.api";
import "../../styles/bebidadashboard.css";

export default function BebidaDashboard() {
  const [bebidas, setBebidas] = useState<BebidaDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");

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

  const agregarBebida = async (nuevaBebida: Partial<BebidaDTO>) => {
    try {
      const bebidaCreada = await createBebida(nuevaBebida);
      setBebidas((prev) => [...prev, bebidaCreada]);
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error creando bebida:", error);
    }
  };

  return (
    <div className="bebida-dashboard">
      <div className="bebida-dashboard-header">
        <h1 className="bebida-dashboard-title">Gestión de Bebidas</h1>
        <Button onClick={() => setMostrarFormulario(true)} className="bebida-dashboard-button">
          + Agregar
        </Button>
      </div>

      <Grid cols={1} gap={4} className="bebida-dashboard-grid">
        <div>
          <BebidaStats bebidas={bebidas} />
        </div>
      </Grid>

      <AgregarBebida open={mostrarFormulario} onClose={() => setMostrarFormulario(false)} onSubmit={agregarBebida} />

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
                  <button type="button" className="bebida-dashboard-card-action" aria-label="Editar bebida">
                    <FaEdit />
                  </button>
                  <button type="button" className="bebida-dashboard-card-action" aria-label="Eliminar bebida">
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