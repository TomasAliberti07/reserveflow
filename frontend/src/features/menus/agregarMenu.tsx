import { useState, useEffect, type FormEvent } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import ValidationPopup from "../../components/ui/validationPopup";
import type { MenusDTO } from "../../api/menus.api";
import { useValidationPopup } from "../../hooks/useValidationPopup";
import { validateName, validatePositiveNumber, normalizeString } from "../../utils/validations";
import "../../styles/menusdashboard.css";

interface AgregarMenuProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (menu: Partial<MenusDTO>) => Promise<void>;
  menuInicial?: Partial<MenusDTO>;
}

const opcionesCategorias = [
  "Entrada",
  "Principal",
  "Postre",
  "Bebida",
  "Especial",
] as const;

const opcionesDieta = [
  "Celiaco",
  "Diabetico",
  "Vegano",
  "Vegetariano",
] as const;

export default function AgregarMenu({ open, onClose, onSubmit, menuInicial }: AgregarMenuProps) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState<string>(opcionesCategorias[0]);
  const [descripcion, setDescripcion] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [precio, setPrecio] = useState("");
  const [dietaEspecifica, setDietaEspecifica] = useState("");
  const { popup, fieldError, showError, closePopup } = useValidationPopup();

  useEffect(() => {
    if (open) {
      setNombre(menuInicial?.nombre ?? "");
      setCategoria(menuInicial?.categoria ?? opcionesCategorias[0]);
      setDescripcion(menuInicial?.descripcion ?? "");
      setDisponible(menuInicial?.disponible === 1);
      setPrecio(menuInicial?.precio ? String(menuInicial.precio) : "");
      setDietaEspecifica(menuInicial?.dieta_especifica ?? "");
    } else {
      setNombre("");
      setCategoria(opcionesCategorias[0]);
      setDescripcion("");
      setDisponible(true);
      setPrecio("");
      setDietaEspecifica("");
    }
  }, [open, menuInicial]);

  const manejarSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar nombre
    const nameValidation = validateName(nombre);
    if (!nameValidation.isValid) {
      showError(nameValidation.error || "El nombre no es válido", "Error", "nombre");
      return;
    }

    // Validar precio
    const precioValidation = validatePositiveNumber(precio, "El precio");
    if (!precioValidation.isValid) {
      showError(precioValidation.error || "El precio no es válido", "Error", "precio");
      return;
    }

    // Validar que si la categoría es 'Especial', dieta_especifica esté seleccionado
    if (categoria === "Especial" && !dietaEspecifica) {
      showError("Por favor selecciona una dieta especial", "Error");
      return;
    }

    const menu = {
      nombre: normalizeString(nombre),
      categoria,
      descripcion: descripcion ? normalizeString(descripcion) : null,
      disponible: disponible ? 1 : 0,
      precio: String(precio),
      dieta_especifica: categoria === "Especial" && dietaEspecifica ? dietaEspecifica : null,
    };

    await onSubmit(menu);
  };

  if (!open) return null;

  return (
    <>
      <ValidationPopup popup={popup} closePopup={closePopup} />
      <div className="menu-modal-overlay" onClick={onClose}>
        <div className="menu-modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{menuInicial ? "Editar Menú" : "Nuevo Menú"}</h2>
          <form onSubmit={manejarSubmit} className="menu-form">
            <Input
              label="Nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={fieldError?.field === "nombre"}
              errorMessage={fieldError?.field === "nombre" ? fieldError.message : undefined}
            />

            <div className="form-group">
              <label>Categoría</label>
              <select
                className="menu-select"
                value={categoria}
                onChange={(e) => {
                  const newCategoria = e.target.value;
                  setCategoria(newCategoria);
                  // Resetear dieta_especifica si la nueva categoría no es 'Especial'
                  if (newCategoria !== "Especial") {
                    setDietaEspecifica("");
                  }
                }}
              >
                {opcionesCategorias.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>

            {categoria === "Especial" && (
              <div className="form-group">
                <label>Dieta Especial</label>
                <select
                  className="menu-select"
                  value={dietaEspecifica}
                  onChange={(e) => setDietaEspecifica(e.target.value)}
                >
                  <option value="">Selecciona una dieta especial</option>
                  {opcionesDieta.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
              error={fieldError?.field === "precio"}
              errorMessage={fieldError?.field === "precio" ? fieldError.message : undefined}
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
    </>
  );
}