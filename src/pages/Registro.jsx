import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { existeCorreo, existeRun, guardarUsuario } from "../data/storage";
import { textoRequerido, validarCorreo, validarNombre, validarPassword, validarRut, validarTelefono } from "../utils/validaciones";
import { REGIONES } from "../data/regiones";

const inicial = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  fechaNacimiento: "",
  contrasena: "",
  confirmar: "",
  telefono: "",
  region: "",
  comuna: "",
  direccion: ""
};

export default function Registro() {
  const [f, setF] = useState(inicial);
  const [validado, setValidado] = useState(false);

  const set = (k, v) => setF((x) => ({ ...x, [k]: v, ...(k === "region" ? { comuna: "" } : {}) }));

  const errores = {
    run: !validarRut(f.run),
    nombre: !validarNombre(f.nombre, 50),
    apellidos: !validarNombre(f.apellidos, 100),
    correo: !validarCorreo(f.correo),
    fechaNacimiento: !f.fechaNacimiento,
    telefono: !validarTelefono(f.telefono),
    contrasena: !validarPassword(f.contrasena),
    confirmar: !f.confirmar || f.confirmar !== f.contrasena,
    region: !f.region,
    comuna: !f.comuna || !(REGIONES[f.region] || []).includes(f.comuna),
    direccion: !textoRequerido(f.direccion, 300)
  };

  function submit(e) {
    e.preventDefault();
    setValidado(true);

    if (Object.values(errores).some(Boolean)) {
      Swal.fire("Revisa el formulario", "Existen campos obligatorios o inválidos.", "error");
      return;
    }

    const correo = f.correo.trim().toLowerCase();

    if (existeRun(f.run)) {
      Swal.fire("RUN registrado", "Este RUN ya está registrado.", "error");
      return;
    }

    if (existeCorreo(correo)) {
      Swal.fire("Correo registrado", "Este correo ya está registrado.", "error");
      return;
    }

    guardarUsuario({
      run: f.run.trim(),
      nombre: f.nombre.trim(),
      apellidos: f.apellidos.trim(),
      correo,
      fechaNacimiento: f.fechaNacimiento,
      contrasena: f.contrasena,
      telefono: f.telefono.trim(),
      region: f.region,
      comuna: f.comuna,
      direccion: f.direccion.trim(),
      rol: "Cliente"
    });

    Swal.fire("Registro exitoso", "El usuario fue registrado correctamente.", "success");
    setF(inicial);
    setValidado(false);
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xl={8}>
          <div className="auth-card p-4 shadow-sm">
            <h2 className="text-center fw-bold mb-4">Registro de Usuario</h2>
            <Form onSubmit={submit} noValidate>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>RUN</Form.Label>
                  <Form.Control
                    value={f.run}
                    onChange={(e) => set("run", e.target.value)}
                    placeholder="Sin puntos ni guion"
                    isInvalid={validado && errores.run}
                  />
                  <Form.Control.Feedback type="invalid">Ingresa un RUN válido de 7 a 9 dígitos.</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    value={f.nombre}
                    onChange={(e) => set("nombre", e.target.value)}
                    isInvalid={validado && errores.nombre}
                  />
                  <Form.Control.Feedback type="invalid">Ingresa un nombre válido.</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    value={f.apellidos}
                    onChange={(e) => set("apellidos", e.target.value)}
                    isInvalid={validado && errores.apellidos}
                  />
                  <Form.Control.Feedback type="invalid">Ingresa apellidos válidos.</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    value={f.correo}
                    onChange={(e) => set("correo", e.target.value)}
                    isInvalid={validado && errores.correo}
                  />
                  <Form.Control.Feedback type="invalid">Ingresa un correo válido.</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    value={f.fechaNacimiento}
                    onChange={(e) => set("fechaNacimiento", e.target.value)}
                    isInvalid={validado && errores.fechaNacimiento}
                  />
                  <Form.Control.Feedback type="invalid">Selecciona tu fecha de nacimiento.</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    value={f.telefono}
                    onChange={(e) => set("telefono", e.target.value)}
                    placeholder="9XXXXXXXX"
                    isInvalid={validado && errores.telefono}
                  />
                  <Form.Control.Feedback type="invalid">Ingresa un teléfono válido de 9 dígitos.</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={f.contrasena}
                    onChange={(e) => set("contrasena", e.target.value)}
                    isInvalid={validado && errores.contrasena}
                  />
                  <Form.Control.Feedback type="invalid">La contraseña debe tener entre 4 y 10 caracteres.</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={f.confirmar}
                    onChange={(e) => set("confirmar", e.target.value)}
                    isInvalid={validado && errores.confirmar}
                  />
                  <Form.Control.Feedback type="invalid">Las contraseñas deben coincidir.</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Región</Form.Label>
                  <Form.Select
                    value={f.region}
                    onChange={(e) => set("region", e.target.value)}
                    isInvalid={validado && errores.region}
                  >
                    <option value="">Seleccione</option>
                    {Object.keys(REGIONES).map((r) => <option key={r}>{r}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">Selecciona una región.</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Comuna</Form.Label>
                  <Form.Select
                    value={f.comuna}
                    onChange={(e) => set("comuna", e.target.value)}
                    disabled={!f.region}
                    isInvalid={validado && errores.comuna}
                  >
                    <option value="">Seleccione</option>
                    {(REGIONES[f.region] || []).map((c) => <option key={c}>{c}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">Selecciona una comuna.</Form.Control.Feedback>
                </Col>

                <Col xs={12}>
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    value={f.direccion}
                    onChange={(e) => set("direccion", e.target.value)}
                    isInvalid={validado && errores.direccion}
                  />
                  <Form.Control.Feedback type="invalid">Ingresa una dirección.</Form.Control.Feedback>
                </Col>
              </Row>

              <Button type="submit" variant="dark" className="w-100 mt-4">Registrar usuario</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
