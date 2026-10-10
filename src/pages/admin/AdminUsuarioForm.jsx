import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { existeCorreo, existeRun, guardarUsuario, obtenerUsuarios } from "../../data/storage";
import { REGIONES } from "../../data/regiones";
import { textoRequerido, validarCorreo, validarNombre, validarPassword, validarRut, validarTelefono } from "../../utils/validaciones";

const vacio = {
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
  direccion: "",
  rol: "Cliente",
};

export default function AdminUsuarioForm() {
  const { correo } = useParams();
  const original = correo ? obtenerUsuarios().find((usuario) => usuario.correo === decodeURIComponent(correo)) : null;
  const [formulario, setFormulario] = useState(original ? { ...vacio, ...original, confirmar: original.contrasena } : vacio);
  const [validado, setValidado] = useState(false);
  const [duplicado, setDuplicado] = useState({ correo: false, run: false });
  const navigate = useNavigate();
  const esCliente = formulario.rol === "Cliente";

  function set(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor, ...(campo === "region" ? { comuna: "" } : {}) }));
    if (campo === "correo" || campo === "run") setDuplicado((actual) => ({ ...actual, [campo]: false }));
  }

  const errores = {
    run: !validarRut(formulario.run),
    nombre: !validarNombre(formulario.nombre, 50),
    apellidos: !validarNombre(formulario.apellidos, 100),
    correo: !validarCorreo(formulario.correo),
    fechaNacimiento: !formulario.fechaNacimiento,
    contrasena: !validarPassword(formulario.contrasena),
    confirmar: formulario.confirmar !== formulario.contrasena || !formulario.confirmar,
    telefono: !validarTelefono(formulario.telefono),
    rol: !["Cliente", "Vendedor", "Administrador"].includes(formulario.rol),
    region: esCliente && !formulario.region,
    comuna: esCliente && (!formulario.comuna || !(REGIONES[formulario.region] || []).includes(formulario.comuna)),
    direccion: esCliente && !textoRequerido(formulario.direccion, 300),
  };

  function submit(evento) {
    evento.preventDefault();
    setValidado(true);
    setDuplicado({ correo: false, run: false });

    if (Object.values(errores).some(Boolean)) {
      Swal.fire("Revisa el formulario", "Existen campos obligatorios o inválidos.", "error");
      return;
    }

    const correoNormalizado = formulario.correo.trim().toLowerCase();
    if (existeCorreo(correoNormalizado, original?.correo)) {
      setDuplicado((actual) => ({ ...actual, correo: true }));
      Swal.fire("Correo registrado", "Este correo ya está registrado.", "error");
      return;
    }
    if (existeRun(formulario.run, original?.run)) {
      setDuplicado((actual) => ({ ...actual, run: true }));
      Swal.fire("RUN registrado", "Este RUN ya está registrado.", "error");
      return;
    }

    const usuario = { ...formulario, correo: correoNormalizado };
    delete usuario.confirmar;
    guardarUsuario(usuario, original?.correo);
    Swal.fire("Usuario guardado", "Los datos fueron almacenados.", "success").then(() => navigate("/admin/usuarios"));
  }

  return (
    <section>
      <div className="mb-4">
        <p className="text-secondary mb-1">Administración / Usuarios</p>
        <h2 className="fw-bold">{original ? "Editar usuario" : "Nuevo usuario"}</h2>
      </div>
      <Card>
        <Card.Body>
          <Form onSubmit={submit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>RUN</Form.Label>
                <Form.Control value={formulario.run} onChange={(e) => set("run", e.target.value)} isInvalid={(validado && errores.run) || duplicado.run} />
                <Form.Control.Feedback type="invalid">{duplicado.run ? "Este RUN ya está registrado." : "Ingresa un RUN válido de 7 a 9 dígitos."}</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Rol</Form.Label>
                <Form.Select value={formulario.rol} onChange={(e) => set("rol", e.target.value)} isInvalid={validado && errores.rol}>
                  <option>Cliente</option>
                  <option>Vendedor</option>
                  <option>Administrador</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">Selecciona un rol válido.</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={formulario.nombre} onChange={(e) => set("nombre", e.target.value)} isInvalid={validado && errores.nombre} />
                <Form.Control.Feedback type="invalid">Ingresa un nombre válido.</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Apellidos</Form.Label>
                <Form.Control value={formulario.apellidos} onChange={(e) => set("apellidos", e.target.value)} isInvalid={validado && errores.apellidos} />
                <Form.Control.Feedback type="invalid">Ingresa apellidos válidos.</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Correo</Form.Label>
                <Form.Control type="email" value={formulario.correo} onChange={(e) => set("correo", e.target.value)} isInvalid={(validado && errores.correo) || duplicado.correo} />
                <Form.Control.Feedback type="invalid">{duplicado.correo ? "Este correo ya está registrado." : "Ingresa un correo válido."}</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Fecha nacimiento</Form.Label>
                <Form.Control type="date" value={formulario.fechaNacimiento || ""} onChange={(e) => set("fechaNacimiento", e.target.value)} isInvalid={validado && errores.fechaNacimiento} />
                <Form.Control.Feedback type="invalid">Selecciona la fecha de nacimiento.</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" value={formulario.contrasena} onChange={(e) => set("contrasena", e.target.value)} isInvalid={validado && errores.contrasena} />
                <Form.Control.Feedback type="invalid">La contraseña debe tener entre 4 y 10 caracteres.</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Confirmar contraseña</Form.Label>
                <Form.Control type="password" value={formulario.confirmar} onChange={(e) => set("confirmar", e.target.value)} isInvalid={validado && errores.confirmar} />
                <Form.Control.Feedback type="invalid">Las contraseñas deben coincidir.</Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control value={formulario.telefono} onChange={(e) => set("telefono", e.target.value)} isInvalid={validado && errores.telefono} />
                <Form.Control.Feedback type="invalid">Ingresa un teléfono válido de 9 dígitos.</Form.Control.Feedback>
              </Col>
            </Row>

            {esCliente && (
              <>
                <hr className="my-4" />
                <h3 className="h5 fw-bold mb-3">Datos de compra</h3>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Región</Form.Label>
                    <Form.Select value={formulario.region} onChange={(e) => set("region", e.target.value)} isInvalid={validado && errores.region}>
                      <option value="">Seleccione</option>
                      {Object.keys(REGIONES).map((region) => <option key={region}>{region}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Selecciona una región.</Form.Control.Feedback>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Comuna</Form.Label>
                    <Form.Select value={formulario.comuna} onChange={(e) => set("comuna", e.target.value)} disabled={!formulario.region} isInvalid={validado && errores.comuna}>
                      <option value="">Seleccione</option>
                      {(REGIONES[formulario.region] || []).map((comuna) => <option key={comuna}>{comuna}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Selecciona una comuna válida.</Form.Control.Feedback>
                  </Col>

                  <Col xs={12}>
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control value={formulario.direccion} onChange={(e) => set("direccion", e.target.value)} isInvalid={validado && errores.direccion} />
                    <Form.Control.Feedback type="invalid">Ingresa una dirección.</Form.Control.Feedback>
                  </Col>
                </Row>
              </>
            )}

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="dark">Guardar usuario</Button>
              <Button as={Link} to="/admin/usuarios" variant="outline-secondary">Cancelar</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </section>
  );
}
