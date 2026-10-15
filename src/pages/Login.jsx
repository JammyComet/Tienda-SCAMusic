import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/useAuth.js";
import { validarCorreo, validarPassword } from "../utils/validaciones.js";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [validado, setValidado] = useState(false);
  const [credencialesInvalidas, setCredencialesInvalidas] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const errores = {
    correo: !validarCorreo(correo),
    pass: !validarPassword(pass),
  };

  function submit(e) {
    e.preventDefault();
    setValidado(true);
    setCredencialesInvalidas(false);

    if (errores.correo || errores.pass) {
      Swal.fire("Revisa los datos", "El correo o la contraseña no tienen un formato válido.", "error");
      return;
    }

    const u = login(correo, pass);
    if (!u) {
      setCredencialesInvalidas(true);
      Swal.fire("Datos incorrectos", "El correo o la contraseña no coinciden.", "error");
      return;
    }

    Swal.fire("Inicio de sesión", "Los datos son válidos.", "success").then(() =>
      nav(loc.state?.desde || (u.rol === "Administrador" ? "/admin" : u.rol === "Vendedor" ? "/vendedor" : "/"))
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7} lg={5}>
          <div className="auth-card p-4 shadow-sm">
            <h2 className="text-center fw-bold mb-4">Inicio de Sesión</h2>
            <Form onSubmit={submit}>
              <Form.Group className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    setCredencialesInvalidas(false);
                  }}
                  placeholder="usuario@gmail.com"
                  isInvalid={(validado && errores.correo) || credencialesInvalidas}
                />
                <Form.Control.Feedback type="invalid">
                  {credencialesInvalidas ? "El correo o la contraseña no coinciden." : "Ingresa un correo válido."}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                    setCredencialesInvalidas(false);
                  }}
                  isInvalid={(validado && errores.pass) || credencialesInvalidas}
                />
                <Form.Control.Feedback type="invalid">
                  {credencialesInvalidas ? "El correo o la contraseña no coinciden." : "La contraseña debe tener entre 4 y 10 caracteres."}
                </Form.Control.Feedback>
                <Form.Text>Entre 4 y 10 caracteres.</Form.Text>
              </Form.Group>

              <Button type="submit" variant="dark" className="w-100">Iniciar sesión</Button>
            </Form>
            <p className="text-center mt-3 mb-0">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
