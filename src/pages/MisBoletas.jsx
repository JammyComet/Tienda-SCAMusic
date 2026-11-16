import { Button, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import TablaDatos from "../components/organisms/TablaDatos";
import { obtenerBoletasUsuario } from "../data/storage";
import { useAuth } from "../hooks/useAuth";
import { formatearFecha, formatearPrecio } from "../utils/format";

export default function MisBoletas() {
  const { usuario } = useAuth();
  const boletas = obtenerBoletasUsuario(usuario.correo);

  return (
    <Container className="py-5">
      <div className="mb-4">
        <p className="text-secondary mb-1">Mi cuenta</p>
        <h1 className="fw-bold">Mis boletas</h1>
        <p className="text-secondary mb-0">Aquí puedes revisar las boletas de tus compras realizadas.</p>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <TablaDatos
            columnas={["Boleta", "Orden", "Fecha", "Total", "Detalle"]}
            filas={boletas}
            mensajeVacio="Todavía no tienes boletas de compra."
            renderFila={(orden) => (
              <tr key={orden.boletaNumero}>
                <td><strong>{orden.boletaNumero}</strong></td>
                <td>{orden.codigo}</td>
                <td>{formatearFecha(orden.fecha)}</td>
                <td>{formatearPrecio(orden.total)}</td>
                <td>
                  <Button as={Link} to={`/mis-boletas/${encodeURIComponent(orden.boletaNumero)}`} size="sm" variant="outline-dark">
                    Ver boleta
                  </Button>
                </td>
              </tr>
            )}
          />
        </Card.Body>
      </Card>
    </Container>
  );
}
