import { useState } from "react";

interface ValidationMessage {
  title?: string;
  message: string;
  type: "success" | "error" | "info";
}

export interface ValidationError {
  field?: string;
  message: string;
}

export const useValidationPopup = () => {
  const [popup, setPopup] = useState<ValidationMessage & { open: boolean }>({
    open: false,
    message: "",
    type: "info",
  });

  const [fieldError, setFieldError] = useState<ValidationError | null>(null);

  const showPopup = (message: string, type: "success" | "error" | "info" = "info", title?: string) => {
    setPopup({
      open: true,
      message,
      type,
      title,
    });
  };

  const showError = (message: string, title: string = "Error", field?: string) => {
    setFieldError(field ? { field, message } : null);
    showPopup(message, "error", title);
  };

  const showSuccess = (message: string, title: string = "Éxito") => {
    setFieldError(null);
    showPopup(message, "success", title);
  };

  const closePopup = () => {
    setPopup({ ...popup, open: false });
    setFieldError(null);
  };

  return {
    popup,
    fieldError,
    showPopup,
    showError,
    showSuccess,
    closePopup,
  };
};
