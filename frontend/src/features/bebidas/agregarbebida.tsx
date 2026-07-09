import BebidaForm from "./bebidaform";
import type { BebidaDTO } from "../../api/bebida.api";
import "../../styles/bebidadashboard.css";

interface AgregarBebidaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bebida: Partial<BebidaDTO>) => Promise<void>;
  bebidaInicial?: Partial<BebidaDTO>;
}

export default function AgregarBebida({ open, onClose, onSubmit, bebidaInicial }: AgregarBebidaProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="bebida-agregar-card">
        <BebidaForm 
          onSubmit={onSubmit}
          onCancel={onClose}
          bebidaInicial={bebidaInicial}
        />
      </div>
    </div>
  );
}