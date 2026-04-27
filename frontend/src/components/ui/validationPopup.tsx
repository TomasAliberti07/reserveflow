import Popup from "./popup";
import { useValidationPopup } from "../../hooks/useValidationPopup";

interface ValidationPopupProps {
  popup: ReturnType<typeof useValidationPopup>["popup"];
  closePopup: () => void;
}

export default function ValidationPopup({ popup, closePopup }: ValidationPopupProps) {
  return (
    <Popup
      open={popup.open}
      title={popup.title}
      message={popup.message}
      type={popup.type}
      onClose={closePopup}
    />
  );
}
