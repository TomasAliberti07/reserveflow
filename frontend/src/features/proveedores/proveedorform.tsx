import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type { CreateProveedorDto, Proveedor } from "../../api/proveedores.api";

interface ProveedorFormProps {
  onSubmit: (data: CreateProveedorDto) => void;
  onCancel: () => void;
  proveedorInicial?: Proveedor;
}

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
      nombre,
      cel,
      rubro: rubro.trim() ? rubro : undefined, // Si queda vacío viaja como undefined (el backend lo procesa null)
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
        placeholder="Ej: Distribuidora Quilmes"
        required
      />

      <Input
        label="Celular / Teléfono *"
        type="text"
        value={cel}
        onChange={(e) => setCel(e.target.value)}
        placeholder="Ej: +54 9 3541 XXXXXX"
        required
      />

      <Input
        label="Rubro / Descripción (Opcional)"
        type="text"
        value={rubro}
        onChange={(e) => setRubro(e.target.value)}
        placeholder="Ej: Cervezas, gaseosas, fiambres..."
      />

      {/* Select adaptado al layout oscuro usando tu clase de inputs para uniformidad */}
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