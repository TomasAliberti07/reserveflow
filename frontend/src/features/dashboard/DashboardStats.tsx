import Card from "../../components/ui/card";
import Grid from "../../components/ui/grid";

const DashboardStats: React.FC = () => {
  return (
    <Grid>
      <Card title="Salones">
        <p className="card-content">Proximamente</p>
      </Card>

      <Card title="Próximos eventos">
        <p className="card-content">Proximamente</p>
      </Card>

      <Card title="Faltantes del evento">
        <p className="card-content">Proximamente</p>
      </Card>

      <Card title="Stock bajo">
        <p className="card-content">Proximamente</p>
      </Card>
    </Grid>
  );
};

export default DashboardStats;
