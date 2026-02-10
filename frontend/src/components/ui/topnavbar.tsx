// components/TopNavbar.tsx
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
      <FaHome />
      <FaCalendarAlt />
      <FaCocktail />
      <FaChartBar />
      <FaCog />
    </nav>
  );
}
