import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import Grid from "../../components/ui/grid";

import MenusStats from "./menustats";
import AgregarMenu from "./agregarMenu";
import Popup from "../../components/ui/popup";
import { getMenus, createMenu, updateMenu, deleteMenu } from "../../api/menus.api";
import type { MenuDTO } from "../../api/menus.api";
import "../../styles/menusdashboard.css";

export default function MenuDashboard() {
  const [menus, setMenus] = useState<MenuDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [menuParaEditar, setMenuParaEditar] = useState<MenuDTO | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState<string | undefined>(undefined);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");

  // Cargar menus de la API al montar el componente
  useEffect(() => {
    cargarMenus();
  }, []);

  const cargarMenus = async () => {
    try {
      setCargando(true);
      const datos = await getMenus();
      setMenus(datos);
    } catch (error) {
      console.error("Error cargando menus:", error);
    } finally {
      setCargando(false);
    }
  };

  const menusFiltrados = menus.filter((menu) =>
    menu.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormularioNuevo = () => {
    setMenuParaEditar(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEdicion = (menu: MenuDTO) => {
    setMenuParaEditar(menu);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setMenuParaEditar(null);
  };

  const mostrarPopup = (title: string, message: string, type: "success" | "error" | "info") => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupType(type);
    setPopupOpen(true);
  };

  const handleGuardarMenu = async (menuData: Partial<MenuDTO>) => {
    try {
      if (menuParaEditar?.id != null) {
        const menuActualizado = await updateMenu(menuParaEditar.id, menuData);
        setMenus((prev) => prev.map((item) => (item.id === menuParaEditar.id ? menuActualizado : item)));
        cerrarFormulario();
        mostrarPopup("Menú actualizado", "Los datos del menú se guardaron correctamente.", "success");
      } else {
        const menuCreado = await createMenu(menuData);
        setMenus((prev) => [...prev, menuCreado]);
        cerrarFormulario();
        mostrarPopup("Menú agregado", "El menú se guardó correctamente.", "success");
      }
    } catch (error) {
      console.error("Error guardando menu:", error);
      mostrarPopup("Error", "No se pudo guardar el menú. Intenta nuevamente.", "error");
    }
  };

  const handleEliminarMenu = async (id?: number) => {
    if (id == null) return;

    try {
      await deleteMenu(id);
      setMenus((prev) => prev.filter((menu) => menu.id !== id));
      mostrarPopup("Menú eliminado", "El menú se eliminó correctamente.", "success");
    } catch (error) {
      console.error("Error eliminando menu:", error);
      mostrarPopup("Error", "No se pudo eliminar el menú. Intenta nuevamente.", "error");
    }
  };

  return (
    <div className="menu-dashboard">
      <div className="menu-dashboard-header">
        <h1 className="menu-dashboard-title">Gestión de Menús</h1>
        <Button onClick={abrirFormularioNuevo} className="menu-dashboard-button">
          + Agregar
        </Button>
      </div>

      <Grid cols={1} gap={4} className="menu-dashboard-grid">
        <div>
          <MenusStats menus={menus} />
        </div>
      </Grid>

      <AgregarMenu
        open={mostrarFormulario}
        onClose={cerrarFormulario}
        onSubmit={handleGuardarMenu}
        menuInicial={menuParaEditar ?? undefined}
      />

      <Popup
        open={popupOpen}
        title={popupTitle}
        message={popupMessage}
        type={popupType}
        onClose={() => setPopupOpen(false)}
      />

      <hr className="menu-dashboard-hr" />
      
      {/* Barra de búsqueda */}
      <div className="menu-dashboard-search">
        <input
          type="text"
          placeholder="Buscar menú..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="menu-dashboard-search-input"
        />
      </div>

      {/* Lista de menus usando Grid para mejor diseño responsivo */}
      <h3 className="menu-dashboard-inventory-title">Menús Disponibles</h3>
      
      {cargando ? (
        <p className="menu-dashboard-no-results">Cargando menús...</p>
      ) : (
        <Grid cols={3} gap={4}>
          {menusFiltrados.map((menu, index) => (
            <div 
              key={menu.id ?? index} 
              className="menu-dashboard-card"
            >
              <div className="menu-dashboard-card-header">
                <h4 className="menu-dashboard-card-title">{menu.nombre}</h4>
                <div className="menu-dashboard-card-actions">
                  <button
                    type="button"
                    className="menu-dashboard-card-action"
                    aria-label="Editar menú"
                    onClick={() => abrirFormularioEdicion(menu)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    className="menu-dashboard-card-action"
                    aria-label="Eliminar menú"
                    onClick={() => handleEliminarMenu(menu.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="menu-dashboard-card-details">
                <p className="menu-dashboard-card-detail">
                  <strong>Descripción:</strong> {menu.descripcion}
                </p>
                <p className="menu-dashboard-card-detail">Precio: <strong>${menu.precio}</strong></p>
                <p className="menu-dashboard-card-detail">
                  Estado: 
                  <span 
                    className="menu-dashboard-status" 
                    style={{ color: menu.disponible === 1 ? "#4dff4d" : "#ff4d4d" }}
                  >
                    {menu.disponible === 1 ? " Disponible" : " No disponible"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </Grid>
      )}

      {!cargando && menusFiltrados.length === 0 && (
        <p className="menu-dashboard-no-results">No se encontraron menús.</p>
      )}
    </div>
  );
}
