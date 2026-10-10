import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import TablaDatos from "../../components/organisms/TablaDatos";
import { eliminarUsuario, obtenerNombreUsuario, obtenerUsuarios } from "../../data/storage";
import { useAuth } from "../../hooks/useAuth";

export default function AdminUsuarios() {
  const [, setVersion] = useState(0);
  const { usuario } = useAuth();

  useEffect(() => {
    const actualizar = () => setVersion((version) => version + 1);
    window.addEventListener("scamusic-data", actualizar);
    return () => window.removeEventListener("scamusic-data", actualizar);
  }, []);

  async function eliminar(correo) {
    if (correo === usuario.correo) {
      Swal.fire("Acción no permitida", "No puedes eliminar tu propia sesión.", "warning");
      return;
    }

    const resultado = await Swal.fire({
      title: "¿Eliminar usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) eliminarUsuario(correo);
  }

  const usuarios = obtenerUsuarios();

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-secondary mb-1">Administración</p>
          <h2 className="fw-bold">Usuarios</h2>
          <p className="text-secondary mb-0">Listado de usuarios registrados.</p>
        </div>
        <Button as={Link} to="/admin/usuarios/nuevo" variant="dark">Nuevo usuario</Button>
      </div>
      <Card>
        <Card.Body>
          <TablaDatos
            columnas={["RUN", "Nombre", "Correo", "Rol", "Región", "Comuna", "Acciones"]}
            filas={usuarios}
            renderFila={(item) => (
              <tr key={item.correo}>
                <td>{item.run || "-"}</td>
                <td>{obtenerNombreUsuario(item)}</td>
                <td>{item.correo}</td>
                <td>{item.rol}</td>
                <td>{item.rol === "Cliente" ? item.region || "-" : "-"}</td>
                <td>{item.rol === "Cliente" ? item.comuna || "-" : "-"}</td>
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    <Button as={Link} to={`/admin/usuarios/editar/${encodeURIComponent(item.correo)}`} size="sm" variant="outline-dark">Editar</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => eliminar(item.correo)}>Eliminar</Button>
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
