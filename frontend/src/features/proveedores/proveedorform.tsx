import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type { CreateProveedorDto, Proveedor } from "../../api/proveedores.api";

interface ProveedorFormProps {
  onSubmit: (data: CreateProveedorDto) => void;
  onCancel: () => void;
  proveedorInicial?: Proveedor;
}

// Función helper para descartar cualquier carácter que no sea número
const onlyNumbers = (value: string) => value.replace(/\D/g, "");

export default function ProveedorForm({ onSubmit, onCancel, proveedorInicial }: ProveedorFormProps) {
  const [nombre, setNombre] = useState("");
  const [cel, setCel] = useState("");
  const [rubro, setRubro] = useState("");
  const [tipo, setTipo] = useState<"BEBIDA" | "MENU">("BEBIDA");

  useEffect(() => {
    if (proveedorInicial) {
      setNombre(proveedorInicial.nombre);
      setCel(proveedorInicial.cel);
      setRubro(proveedorInicial.rubro || "");
      setTipo(proveedorInicial.tipo);
    } else {
      setNombre("");
      setCel("");
      setRubro("");
      setTipo("BEBIDA");
    }
  }, [proveedorInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !cel.trim()) return;

    onSubmit({
      // Punto 3: Normalización a minúsculas limpia de espacios extras
      nombre: nombre.trim().toLowerCase(),
      cel: cel.trim(),
      rubro: rubro.trim() ? rubro.trim().toLowerCase() : undefined,
      tipo,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="proveedor-agregar-form">
      <Input
        label="Nombre del Proveedor *"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej: distribuidora quilmes"
        required
      />

      <Input
        label="Celular / Teléfono *"
        type="text"
        value={cel}
        // Punto 2: Remueve cualquier letra o símbolo al instante y limita la extensión
        onChange={(e) => setCel(onlyNumbers(e.target.value))}
        maxLength={15}
        placeholder="Ej: 3541123456"
        required
      />

      <Input
        label="Rubro / Descripción (Opcional)"
        type="text"
        value={rubro}
        onChange={(e) => setRubro(e.target.value)}
        placeholder="Ej: cervezas, gaseosas, fiambres..."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ color: "#f8fafc", fontSize: "0.9rem" }}>Tipo de Proveedor *</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as "BEBIDA" | "MENU")}
          className="proveedor-dashboard-search-input" 
          style={{ width: "100%", height: "46px" }}
        >
          <option value="BEBIDA">Insumos de Bebida</option>
          <option value="MENU">Insumos de Menú (Cocina)</option>
        </select>
      </div>

      <div className="proveedor-agregar-actions">
        <button type="button" onClick={onCancel} className="proveedor-cancel-button">
          Cancelar
        </button>
        <Button type="submit">
          {proveedorInicial ? "Guardar Cambios" : "Agregar Proveedor"}
        </Button>
      </div>
    </form>
  );
}