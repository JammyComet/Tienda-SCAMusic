import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import TablaDatos from "../../components/organisms/TablaDatos";
import { obtenerBoletas } from "../../data/storage";
import { formatearFecha, formatearPrecio } from "../../utils/format";

export default function AdminBoletas() {
  const boletas = [...obtenerBoletas()].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <section>
      <div className="mb-4">
        <p className="text-secondary mb-1">Administración</p>
        <h2 className="fw-bold">Historial de boletas</h2>
      </div>
      <Card>
        <Card.Body>
          <TablaDatos
            columnas={["Boleta", "Fecha", "Orden", "Cliente", "Comuna", "Total", "Acciones"]}
            filas={boletas}
            renderFila={(orden) => (
              <tr key={orden.boletaNumero}>
                <td><strong>{orden.boletaNumero}</strong></td>
                <td>{formatearFecha(orden.fecha)}</td>
                <td>{orden.codigo}</td>
                <td>{orden.cliente?.nombre || "Cliente"}</td>
                <td>{orden.entrega?.comuna || orden.cliente?.comuna || "-"}</td>
                <td>{formatearPrecio(orden.total)}</td>
                <td>
                  <Button
                    as={Link}
                    size="sm"
                    to={`/admin/boletas/${encodeURIComponent(orden.boletaNumero)}`}
                    variant="outline-dark"
                  >
                    Ver boleta
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
