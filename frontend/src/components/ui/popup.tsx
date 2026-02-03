import "../../styles/popup.css";
import { Button } from "./button";

interface PopupProps {
  open: boolean;
  title?: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export default function Popup({
  open,
  title,
  message,
  type = "info",
  onClose,
}: PopupProps) {
  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className={`popup-card ${type}`}>
        {title && <h3 className="popup-title">{title}</h3>}
        <p className="popup-message">{message}</p>

        <Button onClick={onClose}>
          Aceptar
        </Button>
      </div>
    </div>
  );
}
