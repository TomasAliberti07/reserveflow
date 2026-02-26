import { useState } from "react";
import {Input} from "../../components/ui/input";
import {Button} from "../../components/ui/button";

interface Props {
  onSubmit: (bebida: any) => void;
  bebidaInicial?: any;
}

export default function BebidaForm({ onSubmit, bebidaInicial }: Props) {
  const [nombre, setNombre] = useState(bebidaInicial?.nombre || "");
  const [alcohol, setAlcohol] = useState<boolean>(
    bebidaInicial?.alcohol ?? false
  );
  const [precio, setPrecio] = useState(
    bebidaInicial?.precio || 0
  );

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bebida = {
      nombre,
      alcohol: alcohol ? 1 : 0, // importante para MySQL tinyint(1)
      precio: Number(precio)
    };

    onSubmit(bebida);
  };

  return (
    <form onSubmit={manejarSubmit}>
      <h2>{bebidaInicial ? "Editar Bebida" : "Nueva Bebida"}</h2>

      <Input
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <Input
        label="Precio"
        type="number"
        value={precio}
        onChange={(e) => setPrecio(Number(e.target.value))}
      />

      <label style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <input
          type="checkbox"
          checked={alcohol}
          onChange={(e) => setAlcohol(e.target.checked)}
        />
        Contiene alcohol
      </label>

      <Button type="submit">
        Guardar
      </Button>
    </form>
  );
}