import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import TablaDatos from "./TablaDatos";
import { formatearFecha, formatearPrecio } from "../../utils/format";

export default function ResumenOrdenes({ ordenes, baseRuta }) {
  const recientes = [...ordenes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
  return (
    <Card className="border-0 shadow-sm mt-4">
      <Card.Body>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 className="h5 fw-bold text-dark mb-1">Órdenes recientes</h3>
          </div>
          <Button as={Link} to={`${baseRuta}/ordenes`} size="sm" variant="outline-dark">Ver todas</Button>
        </div>
        <TablaDatos
          columnas={["Orden", "Cliente", "Fecha", "Total", "Estado"]}
          filas={recientes}
          mensajeVacio="Todavía no hay compras registradas."
          renderFila={(orden) => (
            <tr key={orden.codigo}>
              <td><Link to={`${baseRuta}/ordenes/${encodeURIComponent(orden.codigo)}`} className="text-dark fw-semibold">{orden.codigo}</Link></td>
              <td>{orden.cliente?.nombre || "Cliente"}</td>
              <td>{formatearFecha(orden.fecha)}</td>
              <td>{formatearPrecio(orden.total)}</td>
              <td><span className="badge bg-success">{orden.estado}</span></td>
            </tr>
          )}
        />
      </Card.Body>
    </Card>
  );
}
