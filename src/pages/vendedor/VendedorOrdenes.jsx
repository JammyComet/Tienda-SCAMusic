import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import TablaDatos from "../../components/organisms/TablaDatos";
import { obtenerOrdenes } from "../../data/storage";
import { formatearFecha, formatearPrecio } from "../../utils/format";

export default function VendedorOrdenes() {
  const ordenes = obtenerOrdenes();

  return (
    <section>
      <div className="mb-4">
        <p className="text-secondary mb-1">Vendedor</p>
        <h2 className="fw-bold">Órdenes</h2>
        <p className="text-secondary">Listado de todas las compras registradas desde el carrito.</p>
      </div>
      <Card>
        <Card.Body>
          <TablaDatos
            columnas={["Orden", "Fecha", "Cliente", "Productos", "Total", "Estado", "Acciones"]}
            filas={ordenes}
            renderFila={(orden) => (
              <tr key={orden.codigo}>
                <td>{orden.codigo}</td>
                <td>{formatearFecha(orden.fecha)}</td>
                <td>{orden.cliente?.nombre}</td>
                <td>{orden.productos.reduce((total, producto) => total + producto.cantidad, 0)}</td>
                <td>{formatearPrecio(orden.total)}</td>
                <td><span className="badge bg-success">{orden.estado}</span></td>
                <td>
                  <Button
                    as={Link}
                    size="sm"
                    to={`/vendedor/ordenes/${encodeURIComponent(orden.codigo)}`}
                    variant="outline-dark"
                  >
                    Ver detalle
                  </Button>
                </td>
              </tr>
            )}
          />
        </Card.Body>
      </Card>
    </section>
  );
}
