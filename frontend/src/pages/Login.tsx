import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import "../styles/login.card.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar sesión</h2>

        <Input label="Email" type="email" />
        <Input label="Contraseña" type="password" />

        <Button type="submit">Ingresar</Button>
      </div>
    </div>
  );
}
