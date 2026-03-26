import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import "../../styles/bebidadashboard.css";

interface AgregarBebidaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bebida: any) => void;
}

export default function AgregarBebida({ open, onClose, onSubmit }: AgregarBebidaProps) {
  const [nombre, setNombre] = useState("");
  const [alcohol, setAlcohol] = useState(false);
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bebida = {
      nombre,
      alcohol: alcohol ? 1 : 0,
      precio: Number(precio),
      stock: Number(stock)
    };

    onSubmit(bebida);
    setNombre("");
    setAlcohol(false);
    setPrecio(0);
    setStock(0);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="bebida-agregar-card">
        <h2 className="bebida-agregar-title">Nueva Bebida</h2>

        <form onSubmit={manejarSubmit} className="bebida-agregar-form">
          <Input
            label="Nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingrese el nombre de la bebida"
          />

          <Input
            label="Precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            placeholder="Ingrese el precio"
          />

          <Input
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            placeholder="Ingrese la cantidad en stock"
          />

          <label className="bebida-agregar-checkbox">
            <input
              type="checkbox"
              checked={alcohol}
              onChange={(e) => setAlcohol(e.target.checked)}
            />
            Contiene alcohol
          </label>

          <div className="bebida-agregar-actions">
            <Button type="submit">Guardar</Button>
            <button type="button" className="bebida-cancel-button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}