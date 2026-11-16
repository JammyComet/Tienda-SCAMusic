import { Button, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import BoletaCompra from "../components/organisms/BoletaCompra";
import { obtenerBoletaPorNumero } from "../data/storage";
import { useAuth } from "../hooks/useAuth";

export default function MiBoletaDetalle() {
  const { numero } = useParams();
  const { usuario } = useAuth();
  const orden = obtenerBoletaPorNumero(decodeURIComponent(numero));
  const perteneceAlUsuario = orden && String(orden.cliente?.correo || "").toLowerCase() === usuario.correo.toLowerCase();

  if (!perteneceAlUsuario) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">No fue posible encontrar esta boleta en tu cuenta.</div>
        <Button as={Link} to="/mis-boletas" variant="dark">Volver a mis boletas</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-secondary mb-1">Mi cuenta / Mis boletas</p>
          <h1 className="fw-bold mb-0">Detalle de boleta</h1>
        </div>
        <Button as={Link} to="/mis-boletas" variant="outline-dark">Volver</Button>
      </div>
      <BoletaCompra orden={orden} />
    </Container>
  );
}
