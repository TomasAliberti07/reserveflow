import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import type { BebidaDTO } from "../../api/bebida.api";
import "../../styles/bebidadashboard.css";

interface AgregarBebidaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bebida: Partial<BebidaDTO>) => void;
}

export default function AgregarBebida({ open, onClose, onSubmit }: AgregarBebidaProps) {
  const [nombre, setNombre] = useState("");
  const [alcohol, setAlcohol] = useState(false);
  const [precio, setPrecio] = useState(""); // Cambiado a string para el input
  const [stock, setStock] = useState("");  // Cambiado a string para el input

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica antes de enviar
    if (!nombre || precio === "" || stock === "") {
      alert("Por favor completa todos los campos");
      return;
    }

    const bebida = {
      nombre: nombre.trim(),
      alcohol: alcohol ? 1 : 0,
      precio: precio, // Ya es un string, coincide con tu DTO y Entity Decimal
      stock: Number(stock) // Se convierte a número para la DB
    };

    onSubmit(bebida);
    
    // Limpieza y cierre
    setNombre("");
    setAlcohol(false);
    setPrecio("");
    setStock("");
    onClose(); // Es buena práctica cerrar el modal al terminar
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="bebida-agregar-card">
        <h2 className="bebida-agregar-title">Nueva Bebida</h2>
        <form onSubmit={manejarSubmit} className="bebida-agregar-form">
          <Input
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Fernet"
          />

          <Input
            label="Precio"
            type="number"
          
            value={precio}
            onChange={(e) => setPrecio(e.target.value)} // Guardamos el string del input
            placeholder="0.00"
          />

          <Input
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)} // Guardamos el string del input
            placeholder="Cantidad disponible"
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