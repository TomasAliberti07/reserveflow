import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import ValidationPopup from "../../components/ui/validationPopup";
import type { SalonsDTO } from "../../api/salons.api";
import { useValidationPopup } from "../../hooks/useValidationPopup";
import {
  validateName,
  validatePositiveNumber,
  normalizeString,
} from "../../utils/validations";
import "../../styles/salonsdashboard.css";

interface AgregarSalonProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (salon: Partial<SalonsDTO>) => Promise<void>;
  salonInicial?: Partial<SalonsDTO>;
}

export default function AgregarSalon({
  open,
  onClose,
  onSubmit,
  salonInicial,
}: AgregarSalonProps) {
  const [nombre, setNombre] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [mincapacidad, setMincapacidad] = useState("");
  const [maxcapacidad, setMaxcapacidad] = useState("");
  const [estado, setEstado] = useState(1);
  const { popup, fieldError, showError, closePopup } = useValidationPopup();

  useEffect(() => {
    if (open) {
      setNombre(salonInicial?.nombre ?? "");
      setLocalizacion(salonInicial?.localizacion ?? "");
      setMincapacidad(
        salonInicial?.mincapacidad != null
          ? String(salonInicial.mincapacidad)
          : ""
      );
      setMaxcapacidad(
        salonInicial?.maxcapacidad != null
          ? String(salonInicial.maxcapacidad)
          : ""
      );
      setEstado(salonInicial?.estado ?? 1);
    } else {
      setNombre("");
      setLocalizacion("");
      setMincapacidad("");
      setMaxcapacidad("");
      setEstado(1);
    }
  }, [open, salonInicial]);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar nombre
    const nameValidation = validateName(nombre);
    if (!nameValidation.isValid) {
      showError(nameValidation.error || "El nombre no es válido", "Error", "nombre");
      return;
    }

    // Validar localización
    if (!localizacion.trim()) {
      showError(
        "La localización es obligatoria",
        "Error",
        "localizacion"
      );
      return;
    }

    // Validar capacidad mínima
    const minCapValidation = validatePositiveNumber(
      mincapacidad,
      "La capacidad mínima"
    );
    if (!minCapValidation.isValid) {
      showError(
        minCapValidation.error || "La capacidad mínima no es válida",
        "Error",
        "mincapacidad"
      );
      return;
    }

    // Validar capacidad máxima
    const maxCapValidation = validatePositiveNumber(
      maxcapacidad,
      "La capacidad máxima"
    );
    if (!maxCapValidation.isValid) {
      showError(
        maxCapValidation.error || "La capacidad máxima no es válida",
        "Error",
        "maxcapacidad"
      );
      return;
    }

    // Validar que maxcapacidad sea mayor que mincapacidad
    const minCap = Number(mincapacidad);
    const maxCap = Number(maxcapacidad);
    if (maxCap <= minCap) {
      showError(
        "La capacidad máxima debe ser mayor que la mínima",
        "Error",
        "maxcapacidad"
      );
      return;
    }

    const salon = {
      nombre: normalizeString(nombre),
      localizacion: localizacion.trim(),
      mincapacidad: minCap,
      maxcapacidad: maxCap,
      estado,
    };

    await onSubmit(salon);
  };

  if (!open) return null;

  return (
    <>
      <ValidationPopup popup={popup} closePopup={closePopup} />
      <div className="modal-overlay">
        <div className="salons-agregar-card">
          <h2 className="salons-agregar-title">
            {salonInicial ? "Editar Salón" : "Nuevo Salón"}
          </h2>
          <form onSubmit={manejarSubmit} className="salons-agregar-form">
            <Input
              label="Nombre del Salón"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Salón Principal"
              error={fieldError?.field === "nombre"}
              errorMessage={
                fieldError?.field === "nombre"
                  ? fieldError.message
                  : undefined
              }
            />

            <Input
              label="Localización"
              value={localizacion}
              onChange={(e) => setLocalizacion(e.target.value)}
              placeholder="Ej: Planta Baja, Ala Este"
              error={fieldError?.field === "localizacion"}
              errorMessage={
                fieldError?.field === "localizacion"
                  ? fieldError.message
                  : undefined
              }
            />

            <Input
              label="Capacidad Mínima"
              type="number"
              value={mincapacidad}
              onChange={(e) => setMincapacidad(e.target.value)}
              placeholder="0"
              error={fieldError?.field === "mincapacidad"}
              errorMessage={
                fieldError?.field === "mincapacidad"
                  ? fieldError.message
                  : undefined
              }
            />

            <Input
              label="Capacidad Máxima"
              type="number"
              value={maxcapacidad}
              onChange={(e) => setMaxcapacidad(e.target.value)}
              placeholder="0"
              error={fieldError?.field === "maxcapacidad"}
              errorMessage={
                fieldError?.field === "maxcapacidad"
                  ? fieldError.message
                  : undefined
              }
            />

            <label style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <input
                type="checkbox"
                checked={estado === 1}
                onChange={(e) => setEstado(e.target.checked ? 1 : 0)}
              />
              Salón Activo
            </label>

            <div className="salons-agregar-buttons">
              <Button type="submit" className="salons-agregar-submit">
                Guardar
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="salons-agregar-cancel"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
