import Card from "../../components/ui/card";
import Grid from "../../components/ui/grid";

const DashboardStats: React.FC = () => {
  return (
    <Grid columns={4}>
      <Card title="Salones">
        <p className="stat-value">0</p>
      </Card>

      <Card title="Eventos Activos">
        <p className="stat-value">0</p>
      </Card>

      <Card title="Reservas">
        <p className="stat-value">0</p>
      </Card>

      <Card title="Ingresos">
        <p className="stat-value">$0</p>
      </Card>
    </Grid>
  );
};

export default DashboardStats;
