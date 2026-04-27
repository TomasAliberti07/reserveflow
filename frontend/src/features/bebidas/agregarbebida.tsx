import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import ValidationPopup from "../../components/ui/validationPopup";
import type { BebidaDTO } from "../../api/bebida.api";
import { useValidationPopup } from "../../hooks/useValidationPopup";
import { validateName, validatePositiveNumber, normalizeString } from "../../utils/validations";
import "../../styles/bebidadashboard.css";

interface AgregarBebidaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bebida: Partial<BebidaDTO>) => Promise<void>;
  bebidaInicial?: Partial<BebidaDTO>;
}

export default function AgregarBebida({ open, onClose, onSubmit, bebidaInicial }: AgregarBebidaProps) {
  const [nombre, setNombre] = useState("");
  const [alcohol, setAlcohol] = useState(false);
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const { popup, fieldError, showError, closePopup } = useValidationPopup();

  useEffect(() => {
    if (open) {
      setNombre(bebidaInicial?.nombre ?? "");
      setAlcohol(bebidaInicial?.alcohol === 1);
      setPrecio(bebidaInicial?.precio ?? "");
      setStock(bebidaInicial?.stock != null ? String(bebidaInicial.stock) : "");
    } else {
      setNombre("");
      setAlcohol(false);
      setPrecio("");
      setStock("");
    }
  }, [open, bebidaInicial]);

  const manejarSubmit = async (e: React.FormEvent) => {
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

    // Validar stock
    const stockValidation = validatePositiveNumber(stock, "El stock");
    if (!stockValidation.isValid) {
      showError(stockValidation.error || "El stock no es válido", "Error", "stock");
      return;
    }

    const bebida = {
      nombre: normalizeString(nombre),
      alcohol: alcohol ? 1 : 0,
      precio,
      stock: Number(stock),
    };

    await onSubmit(bebida);
  };

  if (!open) return null;

  return (
    <>
      <ValidationPopup popup={popup} closePopup={closePopup} />
      <div className="modal-overlay">
        <div className="bebida-agregar-card">
          <h2 className="bebida-agregar-title">{bebidaInicial ? "Editar Bebida" : "Nueva Bebida"}</h2>
          <form onSubmit={manejarSubmit} className="bebida-agregar-form">
            <Input
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Fernet"
              error={fieldError?.field === "nombre"}
              errorMessage={fieldError?.field === "nombre" ? fieldError.message : undefined}
            />

            <Input
              label="Precio"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)} 
              placeholder="0.00"
              error={fieldError?.field === "precio"}
              errorMessage={fieldError?.field === "precio" ? fieldError.message : undefined}
            />

            <Input
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)} 
              placeholder="Cantidad disponible"
              error={fieldError?.field === "stock"}
              errorMessage={fieldError?.field === "stock" ? fieldError.message : undefined}
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
    </>
  );
}