import { Col, Row } from "react-bootstrap";
import TarjetaProducto from "../molecules/TarjetaProducto";

export default function ListaProductos({ productos }) {
  if (!productos.length) return <p className="text-center">No se encontraron productos.</p>;
  return (
    <Row className="g-4">
      {productos.map((producto) => (
        <Col md={6} lg={4} key={producto.codigo}>
          <TarjetaProducto producto={producto} />
        </Col>
      ))}
    </Row>
  );
}
