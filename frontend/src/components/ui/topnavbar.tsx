import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaCocktail,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import "../../styles/topnavbar.css";

export default function TopNavbar() {
  return (
    <nav className="top-navbar">
      <div className="navbar-left">ReserveFlow</div>

      <div className="navbar-right">
        <Link to="/dashboard" className="navbar-icon" aria-label="Inicio">
          <FaHome />
        </Link>

        <Link to="/events" className="navbar-icon" aria-label="Eventos">
          <FaCalendarAlt />
        </Link>

        <Link to="/bebidas" className="navbar-icon" aria-label="Bebidas">
          <FaCocktail />
        </Link>

        <Link to="/salons" className="navbar-icon" aria-label="Salones">
          <FaChartBar />
        </Link>

        <div className="navbar-icon" aria-label="Configuración">
          <FaCog />
        </div>
      </div>
    </nav>
  );
}
