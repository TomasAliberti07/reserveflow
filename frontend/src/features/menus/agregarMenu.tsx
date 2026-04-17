import { useState, useEffect, type FormEvent } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import type { MenusDTO } from "../../api/menus.api";
import "../../styles/menusdashboard.css";

interface AgregarMenuProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (menu: Partial<MenusDTO>) => Promise<void>;
  menuInicial?: Partial<MenusDTO>;
}

const opcionesCategorias = [
  "Entrada",
  "Plato principal",
  "Postre",
] as const;

export default function AgregarMenu({ open, onClose, onSubmit, menuInicial }: AgregarMenuProps) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState<string>(opcionesCategorias[0]);
  const [descripcion, setDescripcion] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    if (open) {
      setNombre(menuInicial?.nombre ?? "");
      setCategoria(menuInicial?.categoria ?? opcionesCategorias[0]);
      setDescripcion(menuInicial?.descripcion ?? "");
      setDisponible(menuInicial?.disponible === 1);
      setPrecio(menuInicial?.precio ? String(menuInicial.precio) : "");
    } else {
      setNombre("");
      setCategoria(opcionesCategorias[0]);
      setDescripcion("");
      setDisponible(true);
      setPrecio("");
    }
  }, [open, menuInicial]);

  const manejarSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nombre || !categoria || !descripcion || precio === "") {
      alert("Por favor completa todos los campos");
      return;
    }

    const menu = {
      nombre: nombre.trim(),
      categoria,
      descripcion: descripcion.trim(),
      disponible: disponible ? 1 : 0,
      precio: precio,
    };

    await onSubmit(menu);
  };

  if (!open) return null;

  return (
    <div className="menu-modal-overlay" onClick={onClose}>
      <div className="menu-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{menuInicial ? "Editar Menú" : "Nuevo Menú"}</h2>
        <form onSubmit={manejarSubmit} className="menu-form">
          <Input
            label="Nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <div className="form-group">
            <label>Categoría</label>
            <select
              className="menu-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {opcionesCategorias.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="menu-textarea"
              rows={3}
              placeholder="Describe el menú..."
            />
          </div>

          <Input
            label="Precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
            />
            <span>Disponible</span>
          </label>

          <div className="menu-form-actions">
            <Button type="button" onClick={onClose} className="menu-cancel-button">Cancelar</Button>
            <Button type="submit" className="menu-submit-button">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}