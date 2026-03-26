import { useState } from "react";
import { Button } from "../../components/ui/button";
import Grid from "../../components/ui/grid"; 

import BebidaStats from "./bebidastats";
import AgregarBebida from "./agregarbebida";
import "../../styles/bebidadashboard.css";

export default function BebidaDashboard() {
  const [bebidas, setBebidas] = useState([
    { id: 1, nombre: "Coca Cola", alcohol: 0, precio: 1500, stock: 20 },
    { id: 2, nombre: "Cerveza", alcohol: 1, precio: 2500, stock: 5 },
    { id: 3, nombre: "Vino Tinto", alcohol: 1, precio: 5000, stock: 0 },
    { id: 4, nombre: "Jugo Naranja", alcohol: 0, precio: 1200, stock: 15 },
    { id: 5, nombre: "Agua Mineral", alcohol: 0, precio: 800, stock: 50 },
    { id: 6, nombre: "Whisky", alcohol: 1, precio: 8000, stock: 3 },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const bebidasFiltradas = bebidas.filter((bebida) =>
    bebida.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarBebida = (nuevaBebida: any) => {
    setBebidas((prev) => [
      ...prev,
      { ...nuevaBebida, id: prev.length + 1 }
    ]);
    setMostrarFormulario(false);
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
      <Grid cols={3} gap={4}>
        {bebidasFiltradas.map((bebida) => (
          <div 
            key={bebida.id} 
            className="bebida-dashboard-card"
          >
            <h4 className="bebida-dashboard-card-title">{bebida.nombre}</h4>
            <div className="bebida-dashboard-card-details">
              <p className="bebida-dashboard-card-detail">Precio: <strong>${bebida.precio}</strong></p>
              <p className="bebida-dashboard-card-detail">Alcohol: {bebida.alcohol === 1 ? "Sí" : "No"}</p>
              <p className="bebida-dashboard-card-detail">Stock: <span className="bebida-dashboard-stock" style={{ color: bebida.stock === 0 ? "#ff4d4d" : "#4dff4d" }}>{bebida.stock} unidades</span></p>
            </div>
          </div>
        ))}
      </Grid>

      {bebidasFiltradas.length === 0 && (
        <p className="bebida-dashboard-no-results">No se encontraron bebidas.</p>
      )}
    </div>
  );
}