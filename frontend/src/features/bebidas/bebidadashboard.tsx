import { useState } from "react";
import {Button} from "../../components/ui/button";
import Grid from "../../components/ui/grid";

import BebidaStats from "./bebidastats";
import BebidaForm from "./bebidaform";

export default function BebidaDashboard() {
  const [bebidas, setBebidas] = useState([
    { id: 1, nombre: "Coca Cola", alcohol: 0, precio: 1500, stock: 20 },
    { id: 2, nombre: "Cerveza", alcohol: 1, precio: 2500, stock: 5 },
    { id: 3, nombre: "Vino", alcohol: 1, precio: 5000, stock: 0 },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const agregarBebida = (nuevaBebida: any) => {
    setBebidas((prev) => [
      ...prev,
      { ...nuevaBebida, id: prev.length + 1 }
    ]);
    setMostrarFormulario(false);
  };

  return (
    <div>
      <h1>Gestión de Bebidas</h1>

      {/* Estadísticas */}
      <BebidaStats bebidas={bebidas} />

      {/* Botón Agregar */}
      <div style={{ margin: "1rem 0" }}>
        <Button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? "Cancelar" : "Agregar Bebida"}
        </Button>
      </div>

      {/* Formulario visible directamente */}
      {mostrarFormulario && (
        <div style={{ marginBottom: "2rem" }}>
          <BebidaForm onSubmit={agregarBebida} />
        </div>
      )}

      {/* Grid */}
      <Grid>
        {bebidas.map((bebida) => (
          <div key={bebida.id} className="grid-item">
            <p><strong>{bebida.nombre}</strong></p>
            <p>Precio: ${bebida.precio}</p>
            <p>Alcohol: {bebida.alcohol === 1 ? "Sí" : "No"}</p>
            <p>Stock: {bebida.stock}</p>
          </div>
        ))}
      </Grid>
    </div>
  );
}