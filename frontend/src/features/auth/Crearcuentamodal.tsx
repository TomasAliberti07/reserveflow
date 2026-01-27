import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import "../../styles/login.card.css";

interface CrearCuentaModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CrearCuentaModal({
  open,
  onClose,
}: CrearCuentaModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">Crear cuenta</h2>

        <Input label="Nombre" type="text" />
        <Input label="Apellido" type="text" />
        <Input label="Email" type="email" />
        <Input label="Teléfono" type="tel" /> 
        <Input label="Contraseña" type="password" />
        <Input label="Confirmar contraseña" type="password" />

        <small style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          La cuenta se crea activa por defecto
        </small>

        <div className="modal-actions">
          <Button type="submit">Crear cuenta</Button>

          <button className="link-button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}