import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { guardarUsuario } from "../data/storage";
import { REGIONES } from "../data/regiones";
import { useAuth } from "../hooks/useAuth";
import { textoRequerido, validarNombre, validarPassword, validarTelefono } from "../utils/validaciones";

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const navegar = useNavigate();
  const [f, setF] = useState(() => ({ ...usuario }));
  const [passwords, setPasswords] = useState({ actual: "", nueva: "", confirmar: "" });
  const [validado, setValidado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (usuario) setF({ ...usuario });
  }, [usuario]);

  function set(campo, valor) {
    setF((actual) => ({ ...actual, [campo]: valor, ...(campo === "region" ? { comuna: "" } : {}) }));
  }

  const quiereCambiarPassword = Boolean(passwords.actual || passwords.nueva || passwords.confirmar);
  const errores = {
    nombre: !validarNombre(f.nombre, 50),
    apellidos: !validarNombre(f.apellidos, 100),
    fechaNacimiento: !f.fechaNacimiento,
    telefono: !validarTelefono(f.telefono),
    region: !f.region,
    comuna: !f.comuna || !(REGIONES[f.region] || []).includes(f.comuna),
    direccion: !textoRequerido(f.direccion, 300),
    actual: quiereCambiarPassword && !passwords.actual,
    nueva: quiereCambiarPassword && !validarPassword(passwords.nueva),
    confirmar: quiereCambiarPassword && (passwords.confirmar !== passwords.nueva || !passwords.confirmar),
  };

  async function submit(evento) {
    evento.preventDefault();
    if (guardando) return;
    setValidado(true);

    if (Object.values(errores).some(Boolean)) {
      Swal.fire("Revisa el formulario", "Hay datos obligatorios o inválidos.", "error");
      return;
    }

    const actualizado = {
      ...usuario,
      nombre: f.nombre.trim(),
      apellidos: f.apellidos.trim(),
      fechaNacimiento: f.fechaNacimiento,
      telefono: f.telefono.trim(),
      region: f.region,
      comuna: f.comuna,
      direccion: f.direccion.trim(),
      contrasena: quiereCambiarPassword ? passwords.nueva : undefined,
      contrasenaActual: quiereCambiarPassword ? passwords.actual : undefined,
    };

    setGuardando(true);
    try {
      await guardarUsuario(actualizado, usuario.correo);
      setPasswords({ actual: "", nueva: "", confirmar: "" });
      setValidado(false);
      if(quiereCambiarPassword){
        await logout();
        await Swal.fire("Contraseña cambiada", "Por seguridad debes iniciar sesión nuevamente.", "success");
        navegar('/login');
      } else {
        Swal.fire("Perfil actualizado", "Tus datos fueron guardados correctamente.", "success");
      }
    } catch (error) {
      const mensaje = error.status === 401
        ? "Tu sesión expiró. Inicia sesión nuevamente e inténtalo otra vez."
        : error.message;
      Swal.fire(quiereCambiarPassword ? "No se pudo cambiar la contraseña" : "No se pudo actualizar", mensaje, "error");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <p className="text-secondary mb-1">Mi cuenta</p>
        <h1 className="fw-bold">Mi perfil</h1>
        <p className="text-secondary">Puedes actualizar tus datos personales y tu contraseña.</p>
      </div>

      <Form onSubmit={submit} className="auth-card p-4 shadow-sm">
        <Row className="g-3">
          <Col md={6}>
            <Form.Label>RUN</Form.Label>
            <Form.Control value={f.run || ""} disabled />
            <Form.Text>El RUN no se puede modificar desde el perfil.</Form.Text>
          </Col>
          <Col md={6}>
            <Form.Label>Correo</Form.Label>
            <Form.Control value={f.correo || ""} disabled />
            <Form.Text>El correo identifica tu cuenta y no se modifica desde aquí.</Form.Text>
          </Col>
          <Col md={6}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control value={f.nombre || ""} onChange={(e) => set("nombre", e.target.value)} isInvalid={validado && errores.nombre} />
            <Form.Control.Feedback type="invalid">Ingresa un nombre válido.</Form.Control.Feedback>
          </Col>
          <Col md={6}>
            <Form.Label>Apellidos</Form.Label>
            <Form.Control value={f.apellidos || ""} onChange={(e) => set("apellidos", e.target.value)} isInvalid={validado && errores.apellidos} />
            <Form.Control.Feedback type="invalid">Ingresa apellidos válidos.</Form.Control.Feedback>
          </Col>
          <Col md={6}>
            <Form.Label>Fecha de nacimiento</Form.Label>
            <Form.Control type="date" value={f.fechaNacimiento || ""} onChange={(e) => set("fechaNacimiento", e.target.value)} isInvalid={validado && errores.fechaNacimiento} />
            <Form.Control.Feedback type="invalid">Selecciona tu fecha de nacimiento.</Form.Control.Feedback>
          </Col>
          <Col md={6}>
            <Form.Label>Teléfono</Form.Label>
            <Form.Control value={f.telefono || ""} onChange={(e) => set("telefono", e.target.value)} isInvalid={validado && errores.telefono} />
            <Form.Control.Feedback type="invalid">Ingresa un teléfono válido de 9 dígitos.</Form.Control.Feedback>
          </Col>
          <Col md={6}>
            <Form.Label>Región</Form.Label>
            <Form.Select value={f.region || ""} onChange={(e) => set("region", e.target.value)} isInvalid={validado && errores.region}>
              <option value="">Seleccione</option>
              {Object.keys(REGIONES).map((region) => <option key={region}>{region}</option>)}
            </Form.Select>
            <Form.Control.Feedback type="invalid">Selecciona una región.</Form.Control.Feedback>
          </Col>
          <Col md={6}>
            <Form.Label>Comuna</Form.Label>
            <Form.Select value={f.comuna || ""} onChange={(e) => set("comuna", e.target.value)} disabled={!f.region} isInvalid={validado && errores.comuna}>
              <option value="">Seleccione</option>
              {(REGIONES[f.region] || []).map((comuna) => <option key={comuna}>{comuna}</option>)}
            </Form.Select>
            <Form.Control.Feedback type="invalid">Selecciona una comuna.</Form.Control.Feedback>
          </Col>
          <Col xs={12}>
            <Form.Label>Dirección</Form.Label>
            <Form.Control value={f.direccion || ""} onChange={(e) => set("direccion", e.target.value)} isInvalid={validado && errores.direccion} />
            <Form.Control.Feedback type="invalid">Ingresa una dirección.</Form.Control.Feedback>
          </Col>
        </Row>

        <hr className="my-4" />
        <h2 className="h5 fw-bold">Cambiar contraseña</h2>
        <p className="text-secondary small">Déjalo en blanco si no quieres cambiarla.</p>
        <Row className="g-3">
          <Col md={4}>
            <Form.Label>Contraseña actual</Form.Label>
            <Form.Control type="password" value={passwords.actual} onChange={(e) => setPasswords({ ...passwords, actual: e.target.value })} isInvalid={validado && errores.actual} />
            <Form.Control.Feedback type="invalid">Ingresa la contraseña actual para verificar el cambio.</Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Label>Nueva contraseña</Form.Label>
            <Form.Control type="password" value={passwords.nueva} onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })} isInvalid={validado && errores.nueva} />
            <Form.Control.Feedback type="invalid">Debe tener entre 8 y 72 caracteres.</Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Label>Confirmar nueva contraseña</Form.Label>
            <Form.Control type="password" value={passwords.confirmar} onChange={(e) => setPasswords({ ...passwords, confirmar: e.target.value })} isInvalid={validado && errores.confirmar} />
            <Form.Control.Feedback type="invalid">Las contraseñas deben coincidir.</Form.Control.Feedback>
          </Col>
        </Row>

        <Button type="submit" variant="dark" className="mt-4" disabled={guardando}>{guardando ? "Guardando..." : "Guardar cambios"}</Button>
      </Form>
    </Container>
  );
}
