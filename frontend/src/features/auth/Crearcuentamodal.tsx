import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import "../../styles/login.card.css";
import { registerUser } from "../../api/auth.api";

interface CrearCuentaModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CrearCuentaModal({
  open,
  onClose,
}: CrearCuentaModalProps) {
  if (!open) return null;

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async () => {
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    await registerUser({
      nombre,
      apellido,
      email,
      telefono,
      password,
    });

    alert("Cuenta creada correctamente");
    onClose();
  } catch (error: any) {
    alert(
      error.response?.data?.message || "Error al crear la cuenta"
    );
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">Crear cuenta</h2>

        <Input
          label="Nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <Input
          label="Apellido"
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Teléfono"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <small style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          La cuenta se crea activa por defecto
        </small>

        <div className="modal-actions">
          <Button type="button" onClick={handleSubmit}>
           Crear cuenta
          </Button>

          <button className="link-button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}