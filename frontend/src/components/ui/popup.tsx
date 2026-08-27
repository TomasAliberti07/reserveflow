import "../../styles/popup.css";
import { Button } from "./button";

interface PopupProps {
  open: boolean;
  title?: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  onConfirm?: () => void;
}

export default function Popup({
  open,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
}: PopupProps) {
  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className={`popup-card ${type}`}>
        {title && <h3 className="popup-title">{title}</h3>}
        <p className="popup-message">{message}</p>

        <div className="popup-actions" style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {onConfirm ? (
            <>
              <Button onClick={onConfirm} className="btn-primary">
                Sí
              </Button>
              <Button onClick={onClose} className="btn-secondary">
                No
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>
              Aceptar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}