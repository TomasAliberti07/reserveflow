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
      <div className="navbar-left">
        ReserveFlow
      </div>

      <div className="navbar-right">
        <div className="navbar-icon" data-label="Inicio">
          <FaHome />
        </div>

        <div className="navbar-icon" data-label="Eventos">
          <FaCalendarAlt />
        </div>

        <div className="navbar-icon" data-label="Salones">
          <FaCocktail />
        </div>

        <div className="navbar-icon" data-label="Estadísticas">
          <FaChartBar />
        </div>

        <div className="navbar-icon" data-label="Configuración">
          <FaCog />
        </div>
      </div>
    </nav>
  );
}
