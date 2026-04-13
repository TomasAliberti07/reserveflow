import { useState, useEffect } from "react";
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

export default function AgregarMenu({ open, onClose, onSubmit, menuInicial }: AgregarMenuProps) {
  const [entrada, setEntrada] = useState("");
  const [platprincipal, setPlatPrincipal] = useState("");
  const [postre, setPostre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    if (open) {
      setEntrada(menuInicial?.nombre ?? "");
      setPlatPrincipal(menuInicial?.plaprincipal ?? "");
      setPostre(menuInicial?.postre ?? "");
      setDescripcion(menuInicial?.descripcion ?? "");
      setDisponible(menuInicial?.disponible === 1);
      setPrecio(menuInicial?.precio ? String(menuInicial.precio) : "");
    } else {
      setEntrada("");
      setPlatPrincipal("");
      setPostre("");
      setDescripcion("");
      setDisponible(true);
      setPrecio("");
    }
  }, [open, menuInicial]);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!entrada || !platprincipal || !postre || !descripcion || precio === "") {
      alert("Por favor completa todos los campos");
      return;
    }

    // Único cambio: Mapear los nombres de los estados a los que espera el DTO/Entity
    const menu = {
      nombre: entrada.trim(),           // 'entrada' viaja como 'nombre'
      plaprincipal: platprincipal.trim(), // 'platprincipal' viaja como 'plaprincipal'
      postre: postre.trim(),
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
            label="Entrada"
            type="text"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
          />

          <Input
            label="Plato Principal"
            type="text"
            value={platprincipal}
            onChange={(e) => setPlatPrincipal(e.target.value)}
          />

          <Input
            label="Postre"
            type="text"
            value={postre}
            onChange={(e) => setPostre(e.target.value)}
          />

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