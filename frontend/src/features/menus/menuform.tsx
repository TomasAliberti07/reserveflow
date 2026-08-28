import { useState, useEffect, type FormEvent } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import ValidationPopup from "../../components/ui/validationPopup";
import type { MenusDTO } from "../../api/menus.api";
import { getProveedores } from "../../api/proveedores.api";
import type { Proveedor } from "../../api/proveedores.api";
import { useValidationPopup } from "../../hooks/useValidationPopup";
import { validateName, validatePositiveNumber, normalizeString } from "../../utils/validations";

interface MenuFormProps {
  onSubmit: (menu: Partial<MenusDTO>) => Promise<void>;
  onCancel: () => void;
  menuInicial?: Partial<MenusDTO>;
}

const opcionesCategorias = [
  "Entrada",
  "Principal",
  "Postre",
  "Bebida",
  "Especial",
] as const;

const opcionesDieta = [
  "Celiaco",
  "Diabetico",
  "Vegano",
  "Vegetariano",
] as const;

export default function MenuForm({ onSubmit, onCancel, menuInicial }: MenuFormProps) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState<string>(opcionesCategorias[0]);
  const [descripcion, setDescripcion] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [precio, setPrecio] = useState("");
  const [dietaEspecifica, setDietaEspecifica] = useState("");
  
  // Estados para asociar el proveedor de insumos de cocina
  const [proveedorId, setProveedorId] = useState<number | string>("");
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const { popup, fieldError, showError, closePopup } = useValidationPopup();

  const esEdicion = Boolean(menuInicial?.id != null);

  // Cargar datos iniciales del menú si estamos editando
  useEffect(() => {
    setNombre(menuInicial?.nombre ?? "");
    setCategoria(menuInicial?.categoria ?? opcionesCategorias[0]);
    setDescripcion(menuInicial?.descripcion ?? "");
    setDisponible(menuInicial?.disponible === 1 || menuInicial?.disponible === undefined);
    setPrecio(menuInicial?.precio ? String(menuInicial.precio) : "");
    setDietaEspecifica(menuInicial?.dieta_especifica ?? "");
    setProveedorId(menuInicial?.proveedor_id || "");
  }, [menuInicial]);

  // Cargar los proveedores al montar el componente
  useEffect(() => {
    const cargarProveedoresMenu = async () => {
      try {
        const todosLosProveedores = await getProveedores();
        const soloMenus = todosLosProveedores.filter(p => p.tipo === "MENU");
        setProveedores(soloMenus);
      } catch (error) {
        console.error("Error obteniendo proveedores para menú:", error);
      }
    };

    cargarProveedoresMenu();
  }, []);

  const manejarSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nameValidation = validateName(nombre);
    if (!nameValidation.isValid) {
      showError(nameValidation.error || "El nombre no es válido", "Error", "nombre");
      return;
    }

    const precioValidation = validatePositiveNumber(precio, "El precio");
    if (!precioValidation.isValid) {
      showError(precioValidation.error || "El precio no es válido", "Error", "precio");
      return;
    }

    if (categoria === "Especial" && !dietaEspecifica) {
      showError("Por favor selecciona una dieta especial", "Error");
      return;
    }

    const menu = {
      nombre: normalizeString(nombre),
      categoria: normalizeString(categoria),
      descripcion: descripcion ? normalizeString(descripcion) : null,
      disponible: esEdicion ? (disponible ? 1 : 0) : 1, // 1 por defecto al crear
      precio: String(precio),
      dieta_especifica: categoria === "Especial" && dietaEspecifica ? normalizeString(dietaEspecifica) : null,
      proveedor_id: proveedorId ? Number(proveedorId) : null
    };

    await onSubmit(menu);
  };

  return (
    <>
      <ValidationPopup popup={popup} closePopup={closePopup} />
      <form onSubmit={manejarSubmit} className="menu-form">
        <Input
          label="Nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          error={fieldError?.field === "nombre"}
          errorMessage={fieldError?.field === "nombre" ? fieldError.message : undefined}
        />

        <div className="form-group">
          <label>Categoría</label>
          <select
            className="menu-select"
            value={categoria}
            onChange={(e) => {
              const newCategoria = e.target.value;
              setCategoria(newCategoria);
              if (newCategoria !== "Especial") {
                setDietaEspecifica("");
              }
            }}
          >
            {opcionesCategorias.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>

        {categoria === "Especial" && (
          <div className="form-group">
            <label>Dieta Especial</label>
            <select
              className="menu-select"
              value={dietaEspecifica}
              onChange={(e) => setDietaEspecifica(e.target.value)}
            >
              <option value="">Selecciona una dieta especial</option>
              {opcionesDieta.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Proveedor de Insumos</label>
          <select
            className="menu-select"
            value={proveedorId}
            onChange={(e) => setProveedorId(e.target.value)}
          >
            <option value="">Sin Proveedor asignado</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.rubro ? `(${p.rubro})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="menu-textarea"
            rows={2}
            placeholder="Describe el menú..."
          />
        </div>

        <Input
          label="Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          error={fieldError?.field === "precio"}
          errorMessage={fieldError?.field === "precio" ? fieldError.message : undefined}
        />

        {/* Checkbox visible únicamente en modo edición */}
        {esEdicion && (
          <label className="checkbox-label" style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
            />
            <span>Disponible</span>
          </label>
        )}

        <div className="menu-form-actions">
          <Button type="button" onClick={onCancel} className="menu-cancel-button">Cancelar</Button>
          <Button type="submit" className="menu-submit-button">Guardar</Button>
        </div>
      </form>
    </>
  );
}