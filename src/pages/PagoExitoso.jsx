import { Button, Container } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import BoletaCompra from "../components/organisms/BoletaCompra";
import { obtenerOrdenPorCodigo } from "../data/storage";

export default function PagoExitoso() {
  const [searchParams] = useSearchParams();
  const orden = obtenerOrdenPorCodigo(searchParams.get("orden"));

  if (!orden) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">No fue posible encontrar la orden de compra.</div>
        <Button as={Link} to="/productos" variant="dark">Volver a productos</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <div className="pago-exitoso-icono">✓</div>
        <h1 className="display-6 fw-bold mt-3">¡Pago exitoso!</h1>
        <p className="lead mb-0">Tu compra fue registrada correctamente. Esta es tu boleta.</p>
      </div>

      <BoletaCompra orden={orden} />

      <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
        <Button as={Link} to="/productos" variant="dark">Seguir comprando</Button>
        <Button as={Link} to="/" variant="outline-secondary">Volver al inicio</Button>
      </div>
    </Container>
  );
}
