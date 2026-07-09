import MenuForm from "./menuform";
import type { MenusDTO } from "../../api/menus.api";
import "../../styles/menusdashboard.css";

interface AgregarMenuProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (menu: Partial<MenusDTO>) => Promise<void>;
  menuInicial?: Partial<MenusDTO>;
}

export default function AgregarMenu({ open, onClose, onSubmit, menuInicial }: AgregarMenuProps) {
  if (!open) return null;

  return (
    <div className="menu-modal-overlay" onClick={onClose}>
      <div className="menu-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{menuInicial ? "Editar Menú" : "Nuevo Menú"}</h2>
        
        <MenuForm 
          onSubmit={onSubmit}
          onCancel={onClose}
          menuInicial={menuInicial}
        />
      </div>
    </div>
  );
}