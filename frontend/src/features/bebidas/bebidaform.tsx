import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import ValidationPopup from "../../components/ui/validationPopup";
import { getProveedores } from "../../api/proveedores.api";
import type { Proveedor } from "../../api/proveedores.api";
import { useValidationPopup } from "../../hooks/useValidationPopup";
import { validateName, validatePositiveNumber, normalizeString } from "../../utils/validations";

interface BebidaFormProps {
  onSubmit: (bebida: any) => void;
  onCancel: () => void;
  bebidaInicial?: any;
}

export default function BebidaForm({ onSubmit, onCancel, bebidaInicial }: BebidaFormProps) {
  const [nombre, setNombre] = useState("");
  const [alcohol, setAlcohol] = useState(false);
  const [precio, setPrecio] = useState("");
  
  // Feature de Stock Dinámico (manejo local en React)
  const [tieneStock, setTieneStock] = useState<boolean>(false);
  const [stock, setStock] = useState("");

  // Relación con Proveedores
  const [proveedorId, setProveedorId] = useState<number | string>("");
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const { popup, fieldError, showError, closePopup } = useValidationPopup();

  // Función helper para obtener de forma segura el ID del proveedor según venga de la API
  const obtenerProveedorIdInical = (bebida: any) => {
    const idEncontrado = bebida?.proveedor_id ?? bebida?.proveedorId ?? bebida?.proveedor?.id;
    return idEncontrado ? String(idEncontrado) : "";
  };

  // Sincronizar estados si estamos editando
  useEffect(() => {
    setNombre(bebidaInicial?.nombre ?? "");
    setAlcohol(bebidaInicial?.alcohol === 1);
    setPrecio(bebidaInicial?.precio ? String(bebidaInicial.precio) : "");
    
    // Determinamos si maneja stock evaluando si tiene stock > 0
    const stockInicial = bebidaInicial?.stock ?? 0;
    setTieneStock(stockInicial > 0);
    setStock(stockInicial > 0 ? String(stockInicial) : "");
    
    // Asignamos el ID capturado
    setProveedorId(obtenerProveedorIdInical(bebidaInicial));
  }, [bebidaInicial]);

  // Cargar proveedores filtrados al montar
  useEffect(() => {
    const cargarProveedoresBebida = async () => {
      try {
        const todosLosProveedores = await getProveedores();
        const soloBebidas = todosLosProveedores.filter(p => p.tipo === "BEBIDA");
        setProveedores(soloBebidas);

        // Si re-cargamos proveedores y ya había un objeto a editar, nos aseguramos de setear su valor
        if (bebidaInicial) {
          setProveedorId(obtenerProveedorIdInical(bebidaInicial));
        }
      } catch (error) {
        console.error("Error obteniendo proveedores para bebidas:", error);
      }
    };
    cargarProveedoresBebida();
  }, [bebidaInicial]);

  const manejarSubmit = async (e: React.FormEvent) => {
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

    // Validar stock únicamente si el checkbox está activo
    if (tieneStock) {
      const stockValidation = validatePositiveNumber(stock, "El stock");
      if (!stockValidation.isValid) {
        showError(stockValidation.error || "El stock no es válido", "Error", "stock");
        return;
      }
    }

    // Objeto estrictamente alineado con CreateBebidaDto de NestJS
    const bebida = {
      nombre: normalizeString(nombre),
      alcohol: alcohol ? 1 : 0,
      precio: String(precio), // Cumple con @IsString()
      stock: tieneStock ? Number(stock) : 0, // Cumple con @IsInt() y @Min(0)
      proveedor_id: proveedorId ? Number(proveedorId) : undefined // undefined para @IsOptional()
    };

    await onSubmit(bebida);
  };

  return (
    <>
      <ValidationPopup popup={popup} closePopup={closePopup} />
      <h2 className="bebida-agregar-title">{bebidaInicial ? "Editar Bebida" : "Nueva Bebida"}</h2>
      
      <form onSubmit={manejarSubmit} className="bebida-agregar-form">
        <Input
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Fernet"
          error={fieldError?.field === "nombre"}
          errorMessage={fieldError?.field === "nombre" ? fieldError.message : undefined}
        />

        <Input
          label="Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)} 
          placeholder="0.00"
          error={fieldError?.field === "precio"}
          errorMessage={fieldError?.field === "precio" ? fieldError.message : undefined}
        />

        {/* Checkbox Dinámico de Stock */}
        <label className="bebida-agregar-checkbox" style={{ marginBottom: "0.5rem" }}>
          <input
            type="checkbox"
            checked={tieneStock}
            onChange={(e) => {
              setTieneStock(e.target.checked);
              if (!e.target.checked) setStock(""); // Limpia el estado del input de stock si se desmarca
            }}
          />
          ¿Esta bebida tiene stock?
        </label>

        {tieneStock && (
          <Input
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)} 
            placeholder="Cantidad disponible"
            error={fieldError?.field === "stock"}
            errorMessage={fieldError?.field === "stock" ? fieldError.message : undefined}
          />
        )}

        {/* Selector de Proveedor de Bebidas */}
        <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          <label style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Proveedor de Bebida</label>
          <select
            className="menu-select"
            value={String(proveedorId)}
            onChange={(e) => setProveedorId(e.target.value)}
          >
            <option value="">Sin Proveedor asignado</option>
            {proveedores.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <label className="bebida-agregar-checkbox">
          <input
            type="checkbox"
            checked={alcohol}
            onChange={(e) => setAlcohol(e.target.checked)}
          />
          Contiene alcohol
        </label>

        <div className="bebida-agregar-actions">
          <Button type="submit">Guardar</Button>
          <button type="button" className="bebida-cancel-button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}