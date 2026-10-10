import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { guardarProducto, obtenerCategorias, obtenerProductoPorCodigo, obtenerProductos } from "../../data/storage";

const vacio = {
  codigo: "",
  nombre: "",
  artista: "",
  categoriaId: "",
  descripcion: "",
  precio: "",
  descuento: "0",
  stock: "",
  stockCritico: "",
  formato: "",
  anio: "",
  estado: "Activo",
  imagen: "",
};

export default function AdminProductoForm() {
  const { codigo } = useParams();
  const original = codigo ? obtenerProductoPorCodigo(decodeURIComponent(codigo)) : null;
  const [f, setF] = useState(original || vacio);
  const [validado, setValidado] = useState(false);
  const [codigoRepetido, setCodigoRepetido] = useState(false);
  const nav = useNavigate();
  const set = (k, v) => {
    setF((x) => ({ ...x, [k]: v }));
    if (k === "codigo") setCodigoRepetido(false);
  };

  const descuento = Number(f.descuento ?? 0);
  const errores = {
    codigo: !f.codigo.trim() || f.codigo.trim().length < 3,
    nombre: !f.nombre.trim(),
    artista: !f.artista.trim(),
    categoriaId: !f.categoriaId,
    precio: f.precio === "" || Number(f.precio) < 0,
    descuento: f.descuento === "" || !Number.isInteger(descuento) || descuento < 0 || descuento > 100,
    stock: f.stock === "" || !Number.isInteger(Number(f.stock)) || Number(f.stock) < 0,
    stockCritico: f.stockCritico !== "" && (!Number.isInteger(Number(f.stockCritico)) || Number(f.stockCritico) < 0),
    formato: !f.formato,
    anio: f.anio !== "" && (!Number.isInteger(Number(f.anio)) || Number(f.anio) < 1),
  };

  function submit(e) {
    e.preventDefault();
    setValidado(true);
    setCodigoRepetido(false);

    if (Object.values(errores).some(Boolean)) {
      Swal.fire("Revisa el formulario", "Existen campos obligatorios o inválidos.", "error");
      return;
    }

    if (obtenerProductos().some((p) => p.codigo.toUpperCase() === f.codigo.trim().toUpperCase() && p.codigo !== original?.codigo)) {
      setCodigoRepetido(true);
      Swal.fire("Código repetido", "Ya existe un producto con ese código.", "error");
      return;
    }

    const p = {
      ...f,
      codigo: f.codigo.trim().toUpperCase(),
      nombre: f.nombre.trim(),
      artista: f.artista.trim(),
      categoriaId: Number(f.categoriaId),
      precio: Number(f.precio),
      descuento,
      stock: Number(f.stock),
      stockCritico: f.stockCritico === "" ? null : Number(f.stockCritico),
      anio: f.anio === "" ? null : Number(f.anio),
      descripcion: f.descripcion.trim(),
      imagen: f.imagen.trim(),
    };
    guardarProducto(p, original?.codigo);
    Swal.fire("Producto guardado", "Los datos fueron almacenados correctamente.", "success").then(() => nav("/admin/productos"));
  }

  return (
    <section>
      <div className="mb-4">
        <p className="text-secondary mb-1">Administración / Productos</p>
        <h2 className="fw-bold">{original ? "Editar producto" : "Nuevo producto"}</h2>
      </div>
      <Card>
        <Card.Body>
          <Form onSubmit={submit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Código</Form.Label>
                <Form.Control
                  value={f.codigo}
                  onChange={(e) => set("codigo", e.target.value)}
                  isInvalid={(validado && errores.codigo) || codigoRepetido}
                />
                <Form.Control.Feedback type="invalid">
                  {codigoRepetido ? "Ya existe un producto con ese código." : "Ingresa un código de al menos 3 caracteres."}
                </Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={f.nombre} onChange={(e) => set("nombre", e.target.value)} isInvalid={validado && errores.nombre} />
                <Form.Control.Feedback type="invalid">Ingresa el nombre del producto.</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Artista</Form.Label>
                <Form.Control value={f.artista} onChange={(e) => set("artista", e.target.value)} isInvalid={validado && errores.artista} />
                <Form.Control.Feedback type="invalid">Ingresa el artista.</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Categoría</Form.Label>
                <Form.Select value={f.categoriaId} onChange={(e) => set("categoriaId", e.target.value)} isInvalid={validado && errores.categoriaId}>
                  <option value="">Seleccione</option>
                  {obtenerCategorias().map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">Selecciona una categoría.</Form.Control.Feedback>
              </Col>

              <Col xs={12}>
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={4} maxLength={500} value={f.descripcion} onChange={(e) => set("descripcion", e.target.value)} />
              </Col>

              <Col md={4}>
                <Form.Label>Precio</Form.Label>
                <Form.Control type="number" min="0" value={f.precio} onChange={(e) => set("precio", e.target.value)} isInvalid={validado && errores.precio} />
                <Form.Control.Feedback type="invalid">Ingresa un precio válido.</Form.Control.Feedback>
              </Col>

              <Col md={4}>
                <Form.Label>Descuento (%)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={f.descuento ?? 0}
                  onChange={(e) => set("descuento", e.target.value)}
                  isInvalid={validado && errores.descuento}
                />
                <Form.Control.Feedback type="invalid">Ingresa un descuento entero entre 0 y 100.</Form.Control.Feedback>
                <Form.Text>Usa 0 si el producto no está en oferta.</Form.Text>
              </Col>

              <Col md={4}>
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" min="0" value={f.stock} onChange={(e) => set("stock", e.target.value)} isInvalid={validado && errores.stock} />
                <Form.Control.Feedback type="invalid">Ingresa un stock válido.</Form.Control.Feedback>
              </Col>

              <Col md={4}>
                <Form.Label>Stock crítico</Form.Label>
                <Form.Control type="number" min="0" value={f.stockCritico ?? ""} onChange={(e) => set("stockCritico", e.target.value)} isInvalid={validado && errores.stockCritico} />
                <Form.Control.Feedback type="invalid">Ingresa un número entero mayor o igual a 0.</Form.Control.Feedback>
              </Col>

              <Col md={4}>
                <Form.Label>Formato</Form.Label>
                <Form.Select value={f.formato} onChange={(e) => set("formato", e.target.value)} isInvalid={validado && errores.formato}>
                  <option value="">Seleccione</option>
                  <option>Vinilo</option>
                  <option>CD</option>
                  <option>Cassette</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">Selecciona un formato.</Form.Control.Feedback>
              </Col>

              <Col md={4}>
                <Form.Label>Año</Form.Label>
                <Form.Control type="number" min="1" value={f.anio ?? ""} onChange={(e) => set("anio", e.target.value)} isInvalid={validado && errores.anio} />
                <Form.Control.Feedback type="invalid">Ingresa un año válido.</Form.Control.Feedback>
              </Col>

              <Col md={4}>
                <Form.Label>Estado</Form.Label>
                <Form.Select value={f.estado} onChange={(e) => set("estado", e.target.value)}>
                  <option>Activo</option>
                  <option>Inactivo</option>
                </Form.Select>
              </Col>

              <Col xs={12}>
                <Form.Label>Imagen</Form.Label>
                <Form.Control placeholder="Ej: discos/mi-disco.jpg" value={f.imagen} onChange={(e) => set("imagen", e.target.value)} />
                <Form.Text>Ruta dentro de public/imagenes.</Form.Text>
              </Col>
            </Row>
            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="dark">Guardar producto</Button>
              <Button as={Link} to="/admin/productos" variant="outline-secondary">Cancelar</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </section>
  );
}
