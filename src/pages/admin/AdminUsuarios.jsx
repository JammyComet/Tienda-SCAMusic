import { useEffect, useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import TablaDatos from "../../components/organisms/TablaDatos";
import {
  cambiarEstadoUsuario,
  eliminarUsuario,
  esAdministradorPrincipal,
  obtenerNombreUsuario,
  obtenerUsuarios,
  usuarioTieneCompras,
} from "../../data/storage";
import { useAuth } from "../../hooks/useAuth";

export default function AdminUsuarios() {
  const [, setVersion] = useState(0);
  const { usuario } = useAuth();

  useEffect(() => {
    const actualizar = () => setVersion((version) => version + 1);
    window.addEventListener("scamusic-data", actualizar);
    return () => window.removeEventListener("scamusic-data", actualizar);
  }, []);

  async function eliminar(item) {
    if (item.correo === usuario.correo) {
      Swal.fire("Acción no permitida", "No puedes eliminar tu propia cuenta mientras estás usando la administración.", "warning");
      return;
    }
    if (esAdministradorPrincipal(item.correo)) {
      Swal.fire("Acción no permitida", "El administrador principal no puede eliminarse.", "warning");
      return;
    }
    if (usuarioTieneCompras(item.correo)) {
      Swal.fire("Usuario con compras", "No se puede eliminar un usuario que tiene compras registradas. Puedes desactivar su cuenta.", "warning");
      return;
    }

    const resultado = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `${obtenerNombreUsuario(item)} será eliminado de forma permanente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return;
    const respuesta = await eliminarUsuario(item.correo);
    if (!respuesta.ok) Swal.fire("No se pudo eliminar", respuesta.mensaje, "warning");
  }

  async function cambiarEstado(item) {
    const activar = item.activo === false;
    if (item.correo === usuario.correo && !activar) {
      Swal.fire("Acción no permitida", "No puedes desactivar tu propia cuenta mientras estás usando la administración.", "warning");
      return;
    }
    if (esAdministradorPrincipal(item.correo) && !activar) {
      Swal.fire("Acción no permitida", "El administrador principal debe permanecer activo.", "warning");
      return;
    }

    const confirmacion = await Swal.fire({
      title: activar ? "¿Activar cuenta?" : "¿Desactivar cuenta?",
      text: activar
        ? "El usuario podrá volver a iniciar sesión."
        : "El usuario no podrá iniciar sesión mientras la cuenta esté desactivada.",
      icon: activar ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: activar ? "Activar" : "Desactivar",
      cancelButtonText: "Cancelar",
    });
    if (!confirmacion.isConfirmed) return;

    const respuesta = await cambiarEstadoUsuario(item.correo, activar);
    if (!respuesta.ok) {
      Swal.fire("No se pudo cambiar el estado", respuesta.mensaje, "warning");
      return;
    }
    Swal.fire(activar ? "Cuenta activada" : "Cuenta desactivada", activar ? "El usuario puede iniciar sesión nuevamente." : "El usuario quedó bloqueado para iniciar sesión.", "success");
  }

  const usuarios = obtenerUsuarios();

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-secondary mb-1">Administración</p>
          <h2 className="fw-bold">Usuarios</h2>
          <p className="text-secondary mb-0">Administra datos, estado de cuenta y acceso de los usuarios.</p>
        </div>
        <Button as={Link} to="/admin/usuarios/nuevo" variant="dark">Nuevo usuario</Button>
      </div>
      <Card>
        <Card.Body>
          <TablaDatos
            columnas={["RUN", "Nombre", "Correo", "Rol", "Estado", "Región", "Comuna", "Acciones"]}
            filas={usuarios}
            renderFila={(item) => (
              <tr key={item.correo}>
                <td>{item.run || "-"}</td>
                <td>{obtenerNombreUsuario(item)}</td>
                <td>
                  {item.correo}
                  {esAdministradorPrincipal(item.correo) && <div><Badge bg="dark">Principal</Badge></div>}
                </td>
                <td>{item.rol}</td>
                <td><Badge bg={item.activo === false ? "secondary" : "success"}>{item.activo === false ? "Desactivada" : "Activa"}</Badge></td>
                <td>{item.rol === "Cliente" ? item.region || "-" : "-"}</td>
                <td>{item.rol === "Cliente" ? item.comuna || "-" : "-"}</td>
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    <Button as={Link} to={`/admin/usuarios/editar/${encodeURIComponent(item.correo)}`} size="sm" variant="outline-dark">Editar</Button>
                    <Button size="sm" variant={item.activo === false ? "outline-success" : "outline-warning"} onClick={() => cambiarEstado(item)}>
                      {item.activo === false ? "Activar" : "Desactivar"}
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => eliminar(item)}>Eliminar</Button>
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
