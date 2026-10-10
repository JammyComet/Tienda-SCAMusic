import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import TablaDatos from "../../components/organisms/TablaDatos";
import { obtenerNombreCategoria, obtenerProductos } from "../../data/storage";
import { formatearPrecio } from "../../utils/format";

export default function VendedorProductos() {
  const productos = obtenerProductos();

  return (
    <section>
      <div className="mb-4">
        <p className="text-secondary mb-1">Vendedor</p>
        <h2 className="fw-bold">Productos</h2>
        <p className="text-secondary">Vista solo de consulta.</p>
      </div>
      <Card>
        <Card.Body>
          <TablaDatos
            columnas={["Código", "Producto", "Precio", "Stock", "Categoría", "Estado", "Acciones"]}
            filas={productos}
            renderFila={(producto) => (
              <tr key={producto.codigo}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>{formatearPrecio(producto.precio)}</td>
                <td>{producto.stock}</td>
                <td>{obtenerNombreCategoria(producto.categoriaId)}</td>
                <td>{producto.estado}</td>
                <td>
                  <Button as={Link} to={`/productos/${producto.codigo}`} size="sm" variant="outline-dark">
                    Ver
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
