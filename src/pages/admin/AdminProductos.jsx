import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import TablaDatos from "../../components/organisms/TablaDatos";
import { eliminarProducto, obtenerNombreCategoria, obtenerProductos } from "../../data/storage";
import { formatearPrecio } from "../../utils/format";

export default function AdminProductos() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const actualizar = () => setVersion((version) => version + 1);
    window.addEventListener("scamusic-data", actualizar);
    return () => window.removeEventListener("scamusic-data", actualizar);
  }, []);

  async function eliminar(codigo) {
    const resultado = await Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      eliminarProducto(codigo);
    }
  }

  const productos = obtenerProductos();

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-secondary mb-1">Administración</p>
          <h2 className="fw-bold">Productos</h2>
          <p className="text-secondary mb-0">Listado de productos registrados en la tienda.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Button as={Link} to="/admin/reportes" variant="outline-dark">Reportes</Button>
          <Button as={Link} to="/admin/productos/nuevo" variant="dark">
            Nuevo producto
          </Button>
        </div>
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
                <td>
                  {producto.stock <= producto.stockCritico ? (
                    <span className="badge bg-danger">{producto.stock} - Stock crítico</span>
                  ) : (
                    producto.stock
                  )}
                </td>
                <td>{obtenerNombreCategoria(producto.categoriaId)}</td>
                <td>{producto.estado}</td>
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    <Button
                      as={Link}
                      to={`/admin/productos/editar/${encodeURIComponent(producto.codigo)}`}
                      size="sm"
                      variant="outline-dark"
                    >
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => eliminar(producto.codigo)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          />
        </Card.Body>
      </Card>
    </section>
  );
}
