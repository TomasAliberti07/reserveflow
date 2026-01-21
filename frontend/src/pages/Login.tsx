import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import "../styles/login.card.css";

export default function Login() {
  return (
    <div className="login-container">
      <h1 className="login-title">ReserveFlow</h1>

      <div className="login-card">
        <h2 className="login-form-title">Inicio de sesión</h2>
        <Input label="Email" type="email" />
        <Input label="Contraseña" type="password" />

        <Button type="submit">Ingresar</Button>
      </div>
    </div>
  );
}
