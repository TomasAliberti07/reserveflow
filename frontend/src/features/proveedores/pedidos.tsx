import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaFilePdf } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { createPedido } from "../../api/pedidos.api";
import { PedidoPdf } from "../../components/ui/PedidoPdf"; 
import { pdf } from "@react-pdf/renderer";
import type { Proveedor } from "../../api/proveedores.api";
import { getBebidas } from "../../api/bebida.api"; 
import { getMenus } from "../../api/menus.api";   
import "../../styles/pedidosdashboard.css";

interface Props {
  proveedores: Proveedor[];
  onMostrarPopup: (title: string, message: string, type: "success" | "error" | "info") => void;
}

interface ItemSeleccionado {
  cantidad: number;
  productoId: string | number;
  tipo: "BEBIDA" | "MENU" | ""; 
}

export default function PedidosFeature({ proveedores, onMostrarPopup }: Props) {
  const [proveedorId, setProveedorId] = useState<string>("");
  const [items, setItems] = useState<ItemSeleccionado[]>([{ cantidad: 1, productoId: "", tipo: "" }]);
  const [procesando, setProcesando] = useState(false);

  const [catalogoBebidas, setCatalogoBebidas] = useState<any[]>([]);
  const [catalogoMenus, setCatalogoMenus] = useState<any[]>([]);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [bebidas, menus] = await Promise.all([getBebidas(), getMenus()]);
        setCatalogoBebidas(bebidas);
        setCatalogoMenus(menus);
      } catch (error) {
        console.error(error);
      }
    };
    cargarCatalogos();
  }, []);

  useEffect(() => {
    setItems([{ cantidad: 1, productoId: "", tipo: "" }]);
  }, [proveedorId]);

  const agregarArticulo = () => {
    setItems([...items, { cantidad: 1, productoId: "", tipo: "" }]);
  };

  const eliminarArticulo = (index: number) => {
    if (items.length === 1) {
      setItems([{ cantidad: 1, productoId: "", tipo: "" }]);
    } else {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleProductoChange = (index: number, valorRaw: string) => {
    if (!valorRaw) {
      handleItemChange(index, "productoId", "");
      handleItemChange(index, "tipo", "");
      return;
    }

    const [tipo, id] = valorRaw.split("-");
    const nuevosItems = [...items];
    nuevosItems[index] = {
      ...nuevosItems[index],
      productoId: Number(id),
      tipo: tipo as "BEBIDA" | "MENU"
    };
    setItems(nuevosItems);
  };

  const handleItemChange = (index: number, campo: keyof ItemSeleccionado, valor: any) => {
    const nuevosItems = [...items];
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };
    setItems(nuevosItems);
  };

  const bebidasFiltradas = catalogoBebidas
    .filter((b: any) => {
      if (!proveedorId) return true;
      const idBebidaProv = b.proveedor_id ?? b.proveedorId ?? b.id_proveedor ?? (b.proveedor && b.proveedor.id);
      return String(idBebidaProv) === String(proveedorId);
    })
    .map((b: any) => ({ id: b.id, nombre: b.nombre, tipo: "BEBIDA" }));

  const menusFiltrados = catalogoMenus
    .filter((m: any) => {
      if (!proveedorId) return true;
      const idMenuProv = m.proveedor_id ?? m.proveedorId ?? m.id_proveedor ?? (m.proveedor && m.proveedor.id);
      return String(idMenuProv) === String(proveedorId);
    })
    .map((m: any) => ({ id: m.id, nombre: m.nombre, tipo: "MENU" }));

  const todoElCatalogoFiltrado = [...bebidasFiltradas, ...menusFiltrados];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proveedorId) {
      onMostrarPopup("Validación", "Por favor, selecciona un proveedor.", "info");
      return;
    }

    if (items.some(it => !it.productoId)) {
      onMostrarPopup("Validación", "Asegúrate de seleccionar un producto en cada fila.", "info");
      return;
    }

    const proveedorSeleccionado = proveedores.find(p => p.id === Number(proveedorId));
    if (!proveedorSeleccionado) {
      onMostrarPopup("Error", "No se encontró la información del proveedor seleccionado.", "error");
      return;
    }

    try {
      setProcesando(true);
      
      const dtoItems = items.map(it => ({
        cantidad: Number(it.cantidad),
        bebidaId: it.tipo === "BEBIDA" ? Number(it.productoId) : undefined,
        menuId: it.tipo === "MENU" ? Number(it.productoId) : undefined,
      }));

      const nuevoPedido = await createPedido({
        proveedorId: Number(proveedorId),
        items: dtoItems
      });

      const itemsConDatosCompletos = items.map(it => {
        const encontrado = todoElCatalogoFiltrado.find(
          p => p.id === Number(it.productoId) && p.tipo === it.tipo
        );
        return {
          cantidad: Number(it.cantidad),
          id: it.productoId,
          nombre: encontrado ? encontrado.nombre : "Artículo",
          tipo: it.tipo
        };
      });

      const pedidoParaPdf = {
        ...nuevoPedido,
        items: itemsConDatosCompletos,
        proveedor: proveedorSeleccionado
      } as any;

      const doc = <PedidoPdf pedido={pedidoParaPdf} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Pedido-${nuevoPedido.id.substring(0, 8).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProveedorId("");
      setItems([{ cantidad: 1, productoId: "", tipo: "" }]);
      onMostrarPopup("Pedido Enviado", "El pedido se registró con éxito y se descargó el comprobante.", "success");
    } catch (error) {
      console.error(error);
      onMostrarPopup("Error", "Ocurrió un problema al procesar la orden.", "error");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="pedidos-container">
      <h3 className="proveedor-dashboard-inventory-title">Generar Nuevo Pedido</h3>
      <form onSubmit={handleSubmit} className="pedidos-form-card">
        
        <div className="pedidos-form-group">
          <label>Seleccionar Proveedor</label>
          <select 
            value={proveedorId} 
            onChange={(e) => setProveedorId(e.target.value)}
            className="pedidos-select"
          >
            <option value="">-- Elija un proveedor --</option>
            {proveedores.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        {proveedorId && (
          <div className="pedidos-items-section">
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px', color: '#94a3b8' }}>
              Artículos del Pedido
            </label>
            
            {items.map((item, index) => {
              const valorSelect = item.productoId ? `${item.tipo}-${item.productoId}` : "";

              return (
                <div key={index} className="pedidos-item-row">
                  <input 
                    type="number" 
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(index, "cantidad", e.target.value)}
                    className="pedidos-input"
                    style={{ width: '90px' }}
                    required
                  />

                  <select
                    value={valorSelect}
                    onChange={(e) => handleProductoChange(index, e.target.value)}
                    className="pedidos-select"
                    style={{ flex: 1 }}
                    required
                  >
                    <option value="">-- Seleccionar Artículo --</option>
                    {todoElCatalogoFiltrado.map((prod) => (
                      <option key={`${prod.tipo}-${prod.id}`} value={`${prod.tipo}-${prod.id}`}>
                        {prod.nombre} ({prod.tipo === "BEBIDA" ? "Bebida" : "Menú/Comida"})
                      </option>
                    ))}
                  </select>

                  <button type="button" onClick={() => eliminarArticulo(index)} className="pedidos-btn-remove">
                    <FaTrash />
                  </button>
                </div>
              );
            })}

            <button type="button" onClick={agregarArticulo} className="pedidos-btn-add" style={{ marginTop: '10px' }}>
              <FaPlus /> Agregar Artículo
            </button>
          </div>
        )}

        <Button type="submit" disabled={procesando || !proveedorId} style={{ marginTop: '25px', width: '100%' }}>
          <FaFilePdf style={{ marginRight: '8px' }} /> 
          {procesando ? "Procesando..." : "Emitir Pedido y Descargar PDF"}
        </Button>
      </form>
    </div>
  );
}