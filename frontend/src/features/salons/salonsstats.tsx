import type { SalonsDTO } from "../../api/salons.api";

interface Props {
  salons: SalonsDTO[];
}

export default function SalonsStats({ salons }: Props) {
  const total = salons.length;
  const activos = salons.filter((s) => s.estado === 1).length;
  const inactivos = salons.filter((s) => s.estado === 0).length;

  return (
    <div className="salons-stats">
      <div className="card">
        <h3>Total de Salones</h3>
        <p>{total}</p>
      </div>

      <div className="card">
        <h3>Activos</h3>
        <p>{activos}</p>
      </div>

      <div className="card">
        <h3>Inactivos</h3>
        <p>{inactivos}</p>
      </div>
    </div>
  );
}
