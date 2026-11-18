import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import TablaDatos from "../../components/organisms/TablaDatos";
import { editarCategoria, eliminarCategoria, guardarCategoria, obtenerCategorias, obtenerProductos } from "../../data/storage";

export default function AdminCategorias() {
  const [nombre, setNombre] = useState("");
  const [validado, setValidado] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
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

    const resultado = editandoId === null
      ? await guardarCategoria(nombre)
      : await editarCategoria(editandoId, nombre);
    if (!resultado.ok) {
      Swal.fire("No se pudo guardar", resultado.mensaje, "warning");
      return;
    }

    Swal.fire(editandoId === null ? "Categoría creada" : "Categoría actualizada", "Los cambios se guardaron correctamente.", "success");
    cancelarEdicion();
  }

  function cancelarEdicion() {
    setNombre("");
    setValidado(false);
    setEditandoId(null);
  }

  function comenzarEdicion(categoria) {
    const asociados = obtenerProductos().some((producto) => Number(producto.categoriaId) === Number(categoria.id));
    if (asociados) return;
    setNombre(categoria.nombre);
    setEditandoId(categoria.id);
    setValidado(false);
  }

  async function eliminar(id) {
    const categoria = obtenerCategorias().find((item) => Number(item.id) === Number(id));
    if (obtenerProductos().some((producto) => Number(producto.categoriaId) === Number(id))) {
      Swal.fire("No se puede eliminar", "Esta categoría tiene productos asociados.", "warning");
      return;
    }
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
    if (editandoId === id) cancelarEdicion();
    Swal.fire("Categoría eliminada", "La categoría fue eliminada.", "success");
  }

  const categorias = obtenerCategorias();
  const productos = obtenerProductos();

  return (
    <section>
      <div className="mb-4">
        <p className="text-secondary mb-1">Administración</p>
        <h2 className="fw-bold">Categorías</h2>
        <p className="text-secondary mb-0">Organiza las categorías de tu tienda.</p>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h3 className="h5 fw-bold text-dark">{editandoId === null ? "Nueva categoría" : "Editar categoría"}</h3>
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
                <Button type="submit" variant="dark" className="w-100">
                  {editandoId === null ? "Crear categoría" : "Guardar cambios"}
                </Button>
                {editandoId !== null && (
                  <Button type="button" variant="outline-secondary" className="w-100 mt-2" onClick={cancelarEdicion}>
                    Cancelar edición
                  </Button>
                )}
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
                        <div className="d-flex gap-2 flex-wrap">
                          <span title={asociados ? "Esta categoría tiene productos asociados" : "Editar categoría"}>
                            <Button size="sm" variant="outline-primary" disabled={asociados > 0} onClick={() => comenzarEdicion(categoria)}>
                              Editar
                            </Button>
                          </span>
                          <span title={asociados ? "Esta categoría tiene productos asociados" : "Eliminar categoría"}>
                            <Button size="sm" variant="outline-danger" disabled={asociados > 0} onClick={() => eliminar(categoria.id)}>
                              Eliminar
                            </Button>
                          </span>
                        </div>
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
