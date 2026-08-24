import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import "../../styles/login.card.css";
import { registerUser } from "../../api/auth.api";
import Popup from "../../components/ui/popup";

interface CrearCuentaModalProps {
  open: boolean;
  onClose: () => void;
}

const onlyLetters = (value: string) =>
  value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");

const onlyNumbers = (value: string) => value.replace(/\D/g, "");

// Agregamos el # y otros símbolos habituales (!@#$%^&*()_+-=[]{}|;:',.<>/?)
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

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
  const [errors, setErrors] = useState<{
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState<string | undefined>(undefined);
  const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    if (!nombre || nombre.length < 2) {
      newErrors.nombre = "Ingrese un nombre válido";
    }

    if (!apellido || apellido.length < 2) {
      newErrors.apellido = "Ingrese un apellido válido";
    }

    if (!email) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!telefono) {
      newErrors.telefono = "El teléfono es obligatorio";
    }

    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Mínimo 8 caracteres, una mayúscula, un número y un símbolo";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await registerUser({
        nombre,
        apellido,
        email,
        telefono,
        password,
      });

      setPopupTitle("Cuenta creada");
      setPopupMessage("Tu cuenta se creó correctamente");
      setPopupType("success");
      setPopupOpen(true);
    } catch (error: any) {
      setPopupTitle("Error");
      setPopupMessage(
        error.response?.data?.message || "Error al crear la cuenta"
      );
      setPopupType("error");
      setPopupOpen(true);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="login-form-title">Crear cuenta</h2>

        <div className="form-group">
          <Input
            label="Nombre"
            type="text"
            placeholder="Ingrese su nombre"
            value={nombre}
            maxLength={20}
            onChange={(e) => setNombre(onlyLetters(e.target.value))}
          />
          {errors.nombre && (
            <span className="input-error">{errors.nombre}</span>
          )}
        </div>

        <div className="form-group">
          <Input
            label="Apellido"
            type="text"
            placeholder="Ingrese su apellido"
            value={apellido}
            maxLength={20}
            onChange={(e) => setApellido(onlyLetters(e.target.value))}
          />
          {errors.apellido && (
            <span className="input-error">{errors.apellido}</span>
          )}
        </div>

        <div className="form-group">
          <Input
            label="Email"
            type="email"
            placeholder="Ingrese su correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <span className="input-error">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <Input
            label="Teléfono"
            type="text"
            placeholder="Ingrese su número de teléfono"
            value={telefono}
            maxLength={15}
            onChange={(e) => setTelefono(onlyNumbers(e.target.value))}
          />
          {errors.telefono && (
            <span className="input-error">{errors.telefono}</span>
          )}
        </div>

        <div className="form-group">
          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres, mayúscula, número y símbolo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className="input-error">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repita su contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <span className="input-error">{errors.confirmPassword}</span>
          )}
        </div>

        <small style={{ color: "#94a3b8", fontSize: "0.75rem", display: "block", marginBottom: "1rem" }}>
          La cuenta se crea activa por defecto
        </small>

        <div className="modal-actions">
          <Button type="button" className="btn-primary" onClick={handleSubmit}>
            Crear cuenta
          </Button>

          <button type="button" className="link-button" onClick={onClose}>
            Cancelar
          </button>
        </div>

        <Popup
          open={popupOpen}
          title={popupTitle}
          message={popupMessage}
          type={popupType}
          onClose={() => {
            setPopupOpen(false);
            if (popupType === "success") {
              onClose();
            }
          }}
        />
      </div>
    </div>
  );
}

// Siguen sin verse los placeholders y no se limitian la cantidad de caracteres en nombre,apellido y telefono