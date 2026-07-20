import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type{ Pedido } from '../../api/pedidos.api';

// Maquetación profesional con el StyleSheet de react-pdf (basado en Flexbox)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    color: '#333333',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b', // Color gris azulado corporativo
    paddingBottom: 15,
    marginBottom: 25,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  title: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  metaContainer: {
    textAlign: 'right',
  },
  metaText: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    backgroundColor: '#f1f5f9',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    color: '#475569',
  },
  value: {
    flex: 1,
  },
  // Estructura limpia para la tabla de ítems
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 6,
  },
  colProducto: { 
    flex: 3 
  },
  colCantidad: { 
    flex: 1, 
    textAlign: 'center' 
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    fontSize: 9,
    color: '#94a3b8',
  }
});

interface Props {
  pedido: Pedido;
}

export const PedidoPdf = ({ pedido }: Props) => {
  // Formateo de fecha local (es-AR)
  const fecha = new Date(pedido.fechaCreacion).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Encabezado del Remito */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.companyName}>RESERVEFLOW</Text>
            <Text style={styles.title}>Comprobante de Pedido Interno</Text>
          </View>
          <View style={styles.metaContainer}>
            <Text style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: 4 }}>
              Nº: {pedido.id.substring(0, 8).toUpperCase()}
            </Text>
            <Text style={styles.metaText}>Fecha: {fecha}</Text>
            <Text style={styles.metaText}>Estado: {pedido.estado}</Text>
          </View>
        </View>

        {/* Sección del Proveedor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Proveedor Destinatario</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Razón Social:</Text>
            <Text style={styles.value}>{pedido.proveedor.nombre}</Text>
          </View>
        </View>

        {/* Tabla de Artículos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de Artículos Solicitados</Text>
          <View style={styles.table}>
            
            {/* Cabecera Tabla */}
            <View style={styles.tableHeader}>
              <Text style={styles.colProducto}>Descripción del Recurso</Text>
              <Text style={styles.colCantidad}>Cantidad</Text>
            </View>

            {/* Filas Dinámicas */}
            {pedido.items.map((item, index) => (
              <View key={item.id || index} style={styles.tableRow}>
                <Text style={styles.colProducto}>
                  {item.menuId ? `Menú Asociado (ID: ${item.menuId})` : `Bebida Asociada (ID: ${item.bebidaId})`}
                </Text>
                <Text style={styles.colCantidad}>{item.cantidad}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pie de página corporativo */}
        <Text style={styles.footer}>
          Este documento es un comprobante automático de pedido generado por ReserveFlow.
        </Text>
        
      </Page>
    </Document>
  );
};