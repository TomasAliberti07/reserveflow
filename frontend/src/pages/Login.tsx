import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import CrearCuentaModal from "../features/auth/Crearcuentamodal";
import "../styles/login.card.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openCrearCuenta, setOpenCrearCuenta] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email.trim() && password.trim()) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">ReserveFlow</h1>

      <div className="login-card">
        <h2 className="login-form-title">Inicio de sesión</h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button type="submit">Ingresar</Button>
        </form>

        <button
          className="link-button"
          onClick={() => setOpenCrearCuenta(true)}
        >
          Crear cuenta
        </button>
      </div>

      <CrearCuentaModal
        open={openCrearCuenta}
        onClose={() => setOpenCrearCuenta(false)}
      />
    </div>
  );
}