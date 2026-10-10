import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { guardarContacto } from "../data/storage";
import { textoRequerido, validarCorreo, validarNombre } from "../utils/validaciones";

export default function Contacto() {
  const [f, setF] = useState({ nombre: "", correo: "", comentario: "" });
  const [validado, setValidado] = useState(false);

  const errores = {
    nombre: !validarNombre(f.nombre, 100),
    correo: Boolean(f.correo) && !validarCorreo(f.correo),
    comentario: !textoRequerido(f.comentario, 500),
  };

  function submit(e) {
    e.preventDefault();
    setValidado(true);

    if (Object.values(errores).some(Boolean)) {
      Swal.fire("Revisa el formulario", "Existen campos obligatorios o inválidos.", "error");
      return;
    }

    guardarContacto({
      nombre: f.nombre.trim(),
      correo: f.correo.trim().toLowerCase(),
      comentario: f.comentario.trim(),
      fecha: new Date().toISOString().slice(0, 10),
    });
    Swal.fire("Mensaje enviado", "Gracias por escribirnos, te responderemos pronto.", "success");
    setF({ nombre: "", correo: "", comentario: "" });
    setValidado(false);
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={7}>
          <h2 className="text-center fw-bold mb-4">Formulario de Contacto</h2>
          <Form onSubmit={submit} className="auth-card p-4 shadow-sm">
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={f.nombre}
                onChange={(e) => setF({ ...f, nombre: e.target.value })}
                isInvalid={validado && errores.nombre}
              />
              <Form.Control.Feedback type="invalid">Ingresa un nombre válido.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo (opcional)</Form.Label>
              <Form.Control
                type="email"
                value={f.correo}
                onChange={(e) => setF({ ...f, correo: e.target.value })}
                isInvalid={validado && errores.correo}
              />
              <Form.Control.Feedback type="invalid">Ingresa un correo válido o deja este campo vacío.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                maxLength={500}
                value={f.comentario}
                onChange={(e) => setF({ ...f, comentario: e.target.value })}
                isInvalid={validado && errores.comentario}
              />
              <Form.Control.Feedback type="invalid">Ingresa un comentario.</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="dark" className="w-100">Enviar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
