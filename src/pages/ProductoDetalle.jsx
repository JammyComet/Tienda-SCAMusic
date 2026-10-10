import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { obtenerNombreCategoria, obtenerProductoPorCodigo } from "../data/storage";
import { useCart } from "../hooks/useCart";
import { formatearPrecio, precioConDescuento, rutaImagen } from "../utils/format";

export default function ProductoDetalle() {
  const { codigo: parametro } = useParams();
  const [searchParams] = useSearchParams();
  const codigo = parametro || searchParams.get("codigo");
  const producto = obtenerProductoPorCodigo(codigo);
  const { agregar } = useCart();

  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <h1>Producto no encontrado</h1>
        <p>El disco solicitado no existe.</p>
        <Button as={Link} to="/productos" variant="dark">Volver a productos</Button>
      </Container>
    );
  }

  const enOferta = Number(producto.descuento) > 0;
  const precioFinal = precioConDescuento(producto);

  function add() {
    const resultado = agregar(producto.codigo);
    Swal.fire({
      icon: resultado.ok ? "success" : "warning",
      title: resultado.ok ? "Producto agregado" : resultado.mensaje,
    });
  }

  return (
    <Container className="py-5">
      <Row className="g-5 align-items-center">
        <Col md={5} className="text-center">
          <img src={rutaImagen(producto.imagen)} className="img-fluid rounded shadow producto-detalle-img" alt={producto.nombre} />
        </Col>
        <Col md={7}>
          <h1>{producto.nombre}</h1>
          <p className="lead">{producto.artista}</p>
          <p><span className="badge bg-dark">{obtenerNombreCategoria(producto.categoriaId)}</span></p>
          <p><strong>Formato:</strong> {producto.formato} · <strong>Año:</strong> {producto.anio}</p>
          <p><strong>Stock:</strong> {producto.stock}</p>
          <h2 className="h4">
            {enOferta && <span className="badge bg-danger me-2">{producto.descuento}% OFF</span>}
            {enOferta && <del className="text-secondary me-2">{formatearPrecio(producto.precio)}</del>}
            {formatearPrecio(precioFinal)}
          </h2>
          <p>{producto.descripcion}</p>
          <div className="d-flex gap-2">
            <Button variant="dark" onClick={add}>Añadir al carrito</Button>
            <Button as={Link} variant="outline-dark" to="/productos">Volver</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
