import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import CrearCuentaModal from "../features/auth/Crearcuentamodal";
import axios from "axios"; 
import "../styles/login.card.css";

// Uso de variable de entorno dinámico
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openCrearCuenta, setOpenCrearCuenta] = useState(false);
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); 

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: email,
        password: password,
      });

      const token = response.data.access_token; 
      
      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Error en el login:", err);
      setError("Credenciales incorrectas. Reintentá.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">ReserveFlow</h1>

      <div className="login-card">
        <h2 className="login-form-title">Inicio de sesión</h2>

        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "1rem" }}>{error}</p>}
          
          <div className="form-group">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-group">
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button type="submit" className="btn-primary">Ingresar</Button>
        </form>

        <button
          type="button"
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