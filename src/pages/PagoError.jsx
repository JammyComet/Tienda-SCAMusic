import { Button, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PagoError() {
  return (
    <Container className="py-5 text-center">
      <div className="display-1 text-danger fw-bold">×</div>
      <h1 className="display-6 fw-bold mt-2">Error en el pago</h1>
      <p className="lead">La transacción fue rechazada y la compra no fue registrada.</p>

      <Card className="text-start mx-auto pago-exitoso-card">
        <Card.Body>
          <p className="mb-2"><strong>No se realizó ningún cobro.</strong></p>
          <p className="mb-0">Tu carrito se mantiene intacto para que puedas volver a intentarlo.</p>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-center gap-2 mt-4">
        <Button as={Link} to="/carrito" variant="danger">Volver al carrito</Button>
        <Button as={Link} to="/productos" variant="outline-dark">Seguir comprando</Button>
      </div>
    </Container>
  );
}
