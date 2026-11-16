import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import TablaDatos from "../../components/organisms/TablaDatos";
import { eliminarCategoria, guardarCategoria, obtenerCategorias, obtenerProductos } from "../../data/storage";

export default function AdminCategorias() {
  const [nombre, setNombre] = useState("");
  const [validado, setValidado] = useState(false);
  const [, setVersion] = useState(0);

  useEffect(() => {
    const actualizar = () => setVersion((version) => version + 1);
    window.addEventListener("scamusic-data", actualizar);
    return () => window.removeEventListener("scamusic-data", actualizar);
  }, []);

  async function submit(evento) {
    evento.preventDefault();
    setValidado(true);
    if (!nombre.trim()) return;

    const resultado = await guardarCategoria(nombre);
    if (!resultado.ok) {
      Swal.fire("No se pudo guardar", resultado.mensaje, "warning");
      return;
    }

    Swal.fire("Categoría creada", "La categoría quedó disponible para los productos.", "success");
    setNombre("");
    setValidado(false);
  }

  async function eliminar(id) {
    const categoria = obtenerCategorias().find((item) => item.id === id);
    const confirmacion = await Swal.fire({
      title: `¿Eliminar ${categoria?.nombre || "categoría"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirmacion.isConfirmed) return;

    const resultado = await eliminarCategoria(id);
    if (!resultado.ok) {
      Swal.fire("No se puede eliminar", resultado.mensaje, "warning");
      return;
    }
    Swal.fire("Categoría eliminada", "La categoría fue eliminada.", "success");
  }

  const categorias = obtenerCategorias();
  const productos = obtenerProductos();

  return (
    <section>
      <div className="mb-4">
        <p className="text-secondary mb-1">Administración</p>
        <h2 className="fw-bold">Categorías</h2>
        <p className="text-secondary mb-0">Crea categorías para organizar los productos de la tienda.</p>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h3 className="h5 fw-bold text-dark">Nueva categoría</h3>
              <Form onSubmit={submit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    isInvalid={validado && !nombre.trim()}
                    maxLength={60}
                  />
                  <Form.Control.Feedback type="invalid">Ingresa un nombre para la categoría.</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" variant="dark" className="w-100">Crear categoría</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <TablaDatos
                columnas={["ID", "Categoría", "Productos asociados", "Acciones"]}
                filas={categorias}
                mensajeVacio="No hay categorías registradas."
                renderFila={(categoria) => {
                  const asociados = productos.filter((producto) => Number(producto.categoriaId) === Number(categoria.id)).length;
                  return (
                    <tr key={categoria.id}>
                      <td>{categoria.id}</td>
                      <td><strong>{categoria.nombre}</strong></td>
                      <td>{asociados}</td>
                      <td>
                        <Button size="sm" variant="outline-danger" onClick={() => eliminar(categoria.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  );
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
}
