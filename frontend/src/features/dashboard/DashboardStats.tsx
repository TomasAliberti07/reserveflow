import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/card";
import Grid from "../../components/ui/grid";
import type {
  SalonesStatsDTO,
  EventosStatsDTO,
  PedidosStatsDTO,
} from "../../api/dashboard.api";
import {
  getSalonesStats,
  getEventosStats,
  getPedidosStats,
} from "../../api/dashboard.api";
import { FaSpinner } from "react-icons/fa";
import "../../styles/dashboardstats.css";

const DashboardStats: React.FC = () => {
  const [salonesStats, setSalonesStats] = useState<SalonesStatsDTO | null>(null);
  const [eventosStats, setEventosStats] = useState<EventosStatsDTO | null>(null);
  const [pedidosStats, setPedidosStats] = useState<PedidosStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const quickActions = [
    { label: "Gestionar Eventos", path: "/events" },
    { label: "Gestionar Proveedores y Pedidos", path: "/proveedores" },
    { label: "Gestionar Salones", path: "/salons" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [salones, eventos, pedidos] = await Promise.all([
          getSalonesStats(),
          getEventosStats(),
          getPedidosStats(),
        ]);
        setSalonesStats(salones);
        setEventosStats(eventos);
        setPedidosStats(pedidos);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Error al cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Grid cols={4} gap={4}>
        {/* Card de Salones */}
        <Card title="Salones">
          <div className="card-content">
            <div className="stat-value">{salonesStats?.totalSalones || 0}</div>
            <div className="stat-label">Total de salones</div>
            <div className="stat-details">
              <div className="stat-item">
                <span className="stat-item-label">Activos:</span>
                <span className="stat-item-value">{salonesStats?.salonesActivos || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item-label">Inactivos:</span>
                <span className="stat-item-value">{salonesStats?.salonesInactivos || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item-label">Capacidad Promedio:</span>
                <span className="stat-item-value">{salonesStats?.capacidadPromedio || 0} pax</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card de Próximos Eventos */}
        <Card title="Próximos Eventos">
          <div className="card-content">
            <div className="stat-value">{eventosStats?.eventosProximos7Dias || 0}</div>
            <div className="stat-label">Próximos 7 días</div>
            <div className="stat-details">
              <div className="stat-item">
                <span className="stat-item-label">Confirmados:</span>
                <span className="stat-item-value">{eventosStats?.eventosConfirmados || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item-label">Pendientes:</span>
                <span className="stat-item-value">{eventosStats?.eventosPendientes || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item-label">Hoy:</span>
                <span className="stat-item-value">{eventosStats?.eventosHoy || 0}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card de Estado de Eventos */}
        <Card title="Estado de Eventos">
          <div className="card-content">
            <div className="stat-value">{eventosStats?.totalEventos || 0}</div>
            <div className="stat-label">Total de eventos</div>
            <div className="stat-details">
              <div className="stat-item">
                <span className="stat-item-label">Confirmados:</span>
                <span className="stat-item-value">{eventosStats?.eventosConfirmados || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item-label">Finalizados:</span>
                <span className="stat-item-value">{eventosStats?.eventosFinalizados || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item-label">Cancelados:</span>
                <span className="stat-item-value">{eventosStats?.eventosCancelados || 0}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card de Pedidos */}
        <Card title="Pedidos a Proveedores">
          <div className="card-content">
            <div className="stat-value">{pedidosStats?.totalPedidos || 0}</div>
            <div className="stat-label">Total de pedidos</div>
            <div className="stat-details">
              <div className="stat-item">
                <span className="stat-item-label">Pendientes:</span>
                <span className="stat-item-value alert">{pedidosStats?.pedidosPendientes || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item-label">Confirmados:</span>
                <span className="stat-item-value">{pedidosStats?.pedidosConfirmados || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item-label">Entregados:</span>
                <span className="stat-item-value">{pedidosStats?.pedidosEntregados || 0}</span>
              </div>
            </div>
          </div>
        </Card>
      </Grid>

      <div className="quick-access-section">
        <h3 className="quick-access-title">Accesos Rápidos</h3>
        <div className="quick-access-actions">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="quick-access-button"
              onClick={() => navigate(action.path)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardStats;
