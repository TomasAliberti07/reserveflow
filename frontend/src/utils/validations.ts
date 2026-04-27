/**
 * Validaciones personalizadas para formularios
 */

/**
 * Normaliza un string:
 * - Convierte a minúsculas
 * - Elimina espacios al inicio y final
 * - No permite espacios vacíos como contenido válido
 */
export const normalizeString = (value: string): string => {
  return value.trim().toLowerCase();
};

/**
 * Valida que un campo no esté vacío
 * Considera espacios vacíos como campos vacíos
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida que un campo contenga solo letras (sin números)
 * Permite espacios entre palabras DESPUÉS de la primera letra
 */
export const onlyLetters = (value: string): boolean => {
  const regex = /^[a-záéíóúñ\s]*$/i;
  return regex.test(value);
};

/**
 * Valida que el campo no comience con espacios
 * No permite: "   sanguche de miga"
 * Permite: "sanguche de miga"
 */
export const noLeadingSpaces = (value: string): boolean => {
  return !value.startsWith(" ");
};

/**
 * Valida un campo de nombre (bebida o menú)
 * - No vacío
 * - Solo letras
 * - No comienza con espacios (solo en la primera letra)
 * - Permite espacios entre palabras después de la primera letra
 */
export const validateName = (value: string): { isValid: boolean; error?: string } => {
  if (!isNotEmpty(value)) {
    return { isValid: false, error: "El nombre no puede estar vacío" };
  }

  if (!noLeadingSpaces(value)) {
    return { isValid: false, error: "El nombre no puede comenzar con espacios" };
  }

  if (!onlyLetters(value)) {
    return { isValid: false, error: "El nombre solo puede contener letras" };
  }

  return { isValid: true };
};

/**
 * Valida que un campo de texto no esté vacío
 */
export const validateTextField = (value: string): { isValid: boolean; error?: string } => {
  if (!isNotEmpty(value)) {
    return { isValid: false, error: "Este campo es obligatorio" };
  }

  return { isValid: true };
};

/**
 * Valida un número
 */
export const validateNumber = (value: string, fieldName: string = "El valor"): { isValid: boolean; error?: string } => {
  if (!isNotEmpty(value)) {
    return { isValid: false, error: `${fieldName} es obligatorio` };
  }

  if (isNaN(Number(value))) {
    return { isValid: false, error: `${fieldName} debe ser un número válido` };
  }

  return { isValid: true };
};

/**
 * Valida que un número sea mayor a cero
 */
export const validatePositiveNumber = (value: string, fieldName: string = "El valor"): { isValid: boolean; error?: string } => {
  const numberValidation = validateNumber(value, fieldName);
  if (!numberValidation.isValid) {
    return numberValidation;
  }

  if (Number(value) <= 0) {
    return { isValid: false, error: `${fieldName} debe ser mayor a 0` };
  }

  return { isValid: true };
};
