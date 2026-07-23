interface Props {
  bebidas: any[];
}

export default function BebidasStats({ bebidas }: Props) {
  const total = bebidas.length;


  const bebidasConStock = bebidas.filter(b => b.tieneStock ?? b.manejaStock ?? (b.stock > 0));


  const sinStock = bebidasConStock.filter(b => b.stock === 0).length;


  const stockBajo = bebidasConStock.filter(b => b.stock > 0 && b.stock <= 5).length;


  const bajoPedido = bebidas.filter(b => !(b.tieneStock ?? b.manejaStock ?? (b.stock > 0))).length;

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

      <div className="card">
        <h3>Bajo Pedido</h3>
        <p>{bajoPedido}</p>
      </div>
    </div>
  );
}