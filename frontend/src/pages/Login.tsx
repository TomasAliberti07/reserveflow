import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import CrearCuentaModal from "../features/auth/Crearcuentamodal";
import axios from "axios"; 
import "../styles/login.card.css";

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
      // 2. Llamada real al backend
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: email,
        password: password,
      });

      // 3. Guardamos el token que nos da NestJS
      // Asegúrate de que tu backend devuelva 'access_token'
      const token = response.data.access_token; 
      
      if (token) {
        localStorage.setItem("token", token); // <--- AQUÍ SE GUARDA LA LLAVE
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
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          
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