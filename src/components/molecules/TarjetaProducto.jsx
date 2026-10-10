import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { obtenerNombreCategoria } from "../../data/storage";
import { useCart } from "../../hooks/useCart";
import { precioConDescuento } from "../../utils/format";
import ImagenProducto from "../atoms/ImagenProducto";
import Precio from "../atoms/Precio";

export default function TarjetaProducto({ producto }) {
  const { agregar } = useCart();
  const enOferta = Number(producto.descuento) > 0;
  const precioFinal = precioConDescuento(producto);

  function agregarAlCarrito() {
    const resultado = agregar(producto.codigo);
    Swal.fire({
      icon: resultado.ok ? "success" : "warning",
      title: resultado.ok ? "Producto agregado" : resultado.mensaje,
      showConfirmButton: true,
    });
  }

  return (
    <Card className="product-card h-100 shadow-sm">
      <ImagenProducto imagen={producto.imagen} alt={producto.nombre} className="card-img-top atomic-product-image" />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h5">{producto.nombre}</Card.Title>
        <Card.Text>{producto.artista}</Card.Text>
        <div><span className="badge bg-dark">{obtenerNombreCategoria(producto.categoriaId)}</span></div>
        <p className="mt-3 mb-1">
          {enOferta && <span className="badge bg-danger me-2">{producto.descuento}% OFF</span>}
          {enOferta && <del className="text-secondary me-2"><Precio valor={producto.precio} /></del>}
          <Precio valor={precioFinal} className="atomic-price" />
        </p>
        <p className="small text-secondary">Stock: {producto.stock}</p>
        <div className="mt-auto d-flex gap-2 flex-wrap">
          <Button as={Link} to={`/productos/${encodeURIComponent(producto.codigo)}`} variant="outline-dark">Ver detalle</Button>
          <Button variant="dark" onClick={agregarAlCarrito}>Añadir al carrito</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
