import { Button, Card, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { obtenerNombreCategoria, obtenerProductoPorCodigo } from "../../data/storage";
import { formatearPrecio, precioConDescuento, rutaImagen } from "../../utils/format";

// Los vendedores consultan los detalles del catálogo sin entrar a la tienda
// ni disponer de acciones para modificar productos o comprar.
export default function VendedorDetalleProducto() {
  const { codigo } = useParams();
  const producto = obtenerProductoPorCodigo(decodeURIComponent(codigo || ""));

  if (!producto) {
    return (
      <section>
        <h2 className="fw-bold">Producto no encontrado</h2>
        <p>No encontramos el disco que buscas.</p>
        <Button as={Link} to="/vendedor/productos" variant="dark">Volver a productos</Button>
      </section>
    );
  }

  const descuento = Number(producto.descuento) || 0;
  const campos = [
    ["Código", producto.codigo],
    ["Artista", producto.artista || "—"],
    ["Categoría", obtenerNombreCategoria(producto.categoriaId)],
    ["Formato", producto.formato || "—"],
    ["Año", producto.anio || "—"],
    ["Stock disponible", producto.stock],
    ["Estado", producto.estado || "—"],
  ];

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-secondary mb-1">Productos</p>
          <h2 className="fw-bold mb-0">{producto.nombre}</h2>
        </div>
        <Button as={Link} to="/vendedor/productos" variant="outline-dark">Volver a productos</Button>
      </div>
      <Card>
        <Card.Body className="p-4">
          <Row className="g-4 align-items-start">
            <Col md={4} className="text-center">
              <img
                src={rutaImagen(producto.imagen)}
                alt={producto.nombre}
                className="img-fluid rounded producto-detalle-img"
              />
            </Col>
            <Col md={8}>
              <h3 className="h4 fw-bold mb-3">Información del producto</h3>
              <Row className="g-3 mb-4">
                {campos.map(([nombre, valor]) => (
                  <Col sm={6} key={nombre}>
                    <div className="text-secondary small">{nombre}</div>
                    <div className="fw-semibold">{valor}</div>
                  </Col>
                ))}
              </Row>
              <div className="mb-3">
                <div className="text-secondary small">Precio</div>
                <div className="h4 fw-bold mb-1">{formatearPrecio(precioConDescuento(producto))}</div>
                {descuento > 0 && (
                  <p className="mb-0 text-secondary">
                    <del>{formatearPrecio(producto.precio)}</del> · {descuento}% de descuento
                  </p>
                )}
              </div>
              {producto.descripcion && (
                <div>
                  <h4 className="h6 fw-bold">Descripción</h4>
                  <p className="mb-0">{producto.descripcion}</p>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </section>
  );
}
