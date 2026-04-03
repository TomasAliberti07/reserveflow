interface Props {
  menus: any[];
}

export default function MenusStats({ menus }: Props) {
  const total = menus.length;
  const noDisponibles = menus.filter(m => m.disponible === 0).length;
  const disponibles = menus.filter(m => m.disponible === 1).length;

  return (
    <div className="menu-stats">
      <div className="card">
        <h3>Total</h3>
        <p>{total}</p>
      </div>

      <div className="card">
        <h3>Disponibles</h3>
        <p>{disponibles}</p>
      </div>

      <div className="card">
        <h3>No Disponibles</h3>
        <p>{noDisponibles}</p>
      </div>
    </div>
  );
}
