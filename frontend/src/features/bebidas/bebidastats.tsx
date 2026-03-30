interface Props {
  bebidas: any[];
}

export default function BebidasStats({ bebidas }: Props) {
  const total = bebidas.length;
  const sinStock = bebidas.filter(b => b.stock === 0).length;
  const stockBajo = bebidas.filter(b => b.stock > 0 && b.stock <= 5).length;

  return (
    <div className="bebida-stats">
      <div className="card">
        <h3>Total</h3>
        <p>{total}</p>
      </div>

      <div className="card">
        <h3>Stock Bajo</h3>
        <p>{stockBajo}</p>
      </div>

      <div className="card">
        <h3>Sin Stock</h3>
        <p>{sinStock}</p>
      </div>
    </div>
  );
}