import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaCocktail,
  FaUtensils,
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

        <Link to="/menus" className="navbar-icon" aria-label="Menus">
          <FaUtensils />
        </Link>

        <Link to="/salons" className="navbar-icon" aria-label="Salones">
          <FaCog />
        </Link>
      </div>
    </nav>
  );
}
