import { Button, Col, Form, Row } from "react-bootstrap";
import ImagenProducto from "../atoms/ImagenProducto.jsx";
import Precio from "../atoms/Precio.jsx";
import BotonAccion from "../atoms/BotonAccion.jsx";
import { formatearPrecio } from "../../utils/format.js";

export default function ItemCarrito({ producto, cambiarCantidad, eliminar }) {
  return (
    <Row className="carrito-producto align-items-center g-3">
      <Col xs={4} sm={3} className="text-center">
        <ImagenProducto imagen={producto.imagen} alt={producto.nombre} className="carrito-producto-img img-fluid" />
      </Col>
      <Col xs={8} sm={9}>
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
          <div>
            <h2 className="h5 mb-1 text-dark">{producto.nombre}</h2>
            <p className="text-secondary mb-1">{producto.artista}</p>
            <p className="small text-secondary">Stock: {producto.stock}</p>
          </div>
          <div className="d-flex flex-column align-items-start align-items-lg-end gap-2">
            <div className="text-lg-end">
              {Number(producto.descuento) > 0 && (
                <p className="small text-secondary mb-0">
                  <del>{formatearPrecio(producto.precioOriginal)}</del>
                  {" "}· {producto.descuento}% de descuento
                </p>
              )}
              <Precio valor={producto.subtotal} className="atomic-price" />
            </div>
            <div className="d-flex gap-1 align-items-center">
              <Button size="sm" variant="outline-dark" onClick={() => cambiarCantidad(producto.codigo, producto.cantidad - 1)}>−</Button>
              <Form.Control type="number" min="1" max={producto.stock} value={producto.cantidad} onChange={(event) => cambiarCantidad(producto.codigo, Number(event.target.value))} className="text-center carrito-input" />
              <Button size="sm" variant="outline-dark" onClick={() => cambiarCantidad(producto.codigo, producto.cantidad + 1)}>+</Button>
            </div>
            <BotonAccion
              size="sm"
              variant="link"
              className="text-danger p-0"
              etiqueta="Eliminar"
              onClick={() => eliminar(producto.codigo)}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}
