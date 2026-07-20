import { useState, useEffect } from "react";
import { FaSyncAlt, FaClock, FaCheckCircle, FaTruck, FaTimesCircle } from "react-icons/fa";
import { getPedidos, updateEstadoPedido, type Pedido, type EstadoPedido } from "../../api/pedidos.api";
import "../../styles/pedidosdashboard.css";

interface Props {
  onMostrarPopup: (title: string, message: string, type: "success" | "error" | "info") => void;
}

export default function PedidoHistorial({ onMostrarPopup }: Props) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarHistorial = async () => {
    try {
      setCargando(true);
      const data = await getPedidos();
      setPedidos(data);
    } catch (error) {
      console.error(error);
      onMostrarPopup("Error", "No se pudo obtener el historial de pedidos.", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const handleStatusChange = async (pedidoId: string, nuevoEstado: EstadoPedido) => {
    try {
      await updateEstadoPedido(pedidoId, nuevoEstado);
      
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      );

      onMostrarPopup("Estado Actualizado", `El pedido cambió a ${nuevoEstado}.`, "success");
    } catch (error) {
      console.error(error);
      onMostrarPopup("Error", "No se pudo actualizar el estado del pedido.", "error");
    }
  };

  const getIconoEstado = (estado: EstadoPedido) => {
    switch (estado) {
      case "PENDIENTE":
        return <FaClock style={{ color: "#f59e0b" }} />;
      case "CONFIRMADO":
        return <FaCheckCircle style={{ color: "#3b82f6" }} />;
      case "ENTREGADO":
        return <FaTruck style={{ color: "#10b981" }} />;
      case "CANCELADO":
        return <FaTimesCircle style={{ color: "#ef4444" }} />;
    }
  };

  return (
    <div className="pedidos-container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 className="proveedor-dashboard-inventory-title" style={{ margin: 0 }}>
          Historial de Pedidos
        </h3>
        <button
          type="button"
          onClick={cargarHistorial}
          disabled={cargando}
          className="pedidos-btn-add"
          style={{ marginTop: 0, padding: "8px 12px" }}
        >
          <FaSyncAlt className={cargando ? "animate-spin" : ""} /> Refrescar
        </button>
      </div>

      <div className="pedidos-form-card" style={{ padding: "0px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #334155", backgroundColor: "#1e293b" }}>
              <th style={{ padding: "12px 16px" }}>Fecha</th>
              <th style={{ padding: "12px 16px" }}>ID Pedido</th>
              <th style={{ padding: "12px 16px" }}>Proveedor</th>
              <th style={{ padding: "12px 16px" }}>Artículos</th>
              <th style={{ padding: "12px 16px" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                  {cargando ? "Cargando historial..." : "No se encontraron pedidos registrados."}
                </td>
              </tr>
            ) : (
              pedidos.map((pedido) => {
                const fechaFormateada = pedido.fechaCreacion
                  ? new Date(pedido.fechaCreacion).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "---";

                return (
                  <tr key={pedido.id} style={{ borderBottom: "1px solid #334155", backgroundColor: "#0f172a" }}>
                    <td style={{ padding: "12px 16px", color: "#cbd5e1" }}>
                      {fechaFormateada}
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#38bdf8" }}>
                      {pedido.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: "500" }}>
                      {pedido.proveedor?.nombre || "No asignado"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "14px", color: "#cbd5e1" }}>
                        {pedido.items?.map((it, idx) => {
                          const tagTipo = it.bebidaId ? "(Bebida)" : it.menuId ? "(Menú)" : "";
                          return (
                            <li key={it.id || idx}>
                              {it.cantidad}x {tagTipo ? `Artículo ${tagTipo}` : "Artículo"}
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {getIconoEstado(pedido.estado)}
                        <select
                          value={pedido.estado}
                          onChange={(e) => handleStatusChange(pedido.id, e.target.value as EstadoPedido)}
                          className="pedidos-select"
                          style={{
                            padding: "4px 8px",
                            fontSize: "14px",
                            width: "140px",
                            backgroundColor: "#1e293b",
                            border: "1px solid #475569",
                          }}
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="CONFIRMADO">CONFIRMADO</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}