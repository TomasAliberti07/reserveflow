import ProveedorForm from "./proveedorform";
import type { CreateProveedorDto, Proveedor } from "../../api/proveedores.api";

interface AgregarProveedorProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProveedorDto) => void;
  proveedorInicial?: Proveedor;
}

export default function AgregarProveedor({ open, onClose, onSubmit, proveedorInicial }: AgregarProveedorProps) {
  if (!open) return null;

  return (
    <div className="proveedor-modal-overlay">
      <div className="proveedor-agregar-card">
        <h2 className="proveedor-agregar-title">
          {proveedorInicial ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h2>
        
        <ProveedorForm
          onSubmit={onSubmit}
          onCancel={onClose}
          proveedorInicial={proveedorInicial}
        />
      </div>
    </div>
  );
}