import { Button, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { obtenerNombreUsuario } from "../../data/storage";
import { useAuth } from "../../hooks/useAuth";

export default function AdminSidebar({ modo, onNavigate }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const base = modo === "admin" ? "/admin" : "/vendedor";
  const clase = ({ isActive }) => `admin-nav-link nav-link${isActive ? " active" : ""}`;

  function salir() {
    logout();
    navigate("/");
  }

  return <aside className="admin-sidebar p-3 d-flex flex-column h-100 min-vh-100"><h1 className="h4 fw-bold mb-4">SCAMusica {modo === "admin" ? "Admin" : "Vendedor"}</h1><Nav className="flex-column gap-2" onClick={onNavigate}><NavLink to={base} end className={clase}><i className="bi bi-speedometer2 me-2" />Dashboard</NavLink><NavLink to={`${base}/productos`} className={clase}><i className="bi bi-disc me-2" />Productos</NavLink>{modo === "admin" && <NavLink to="/admin/usuarios" className={clase}><i className="bi bi-people me-2" />Usuarios</NavLink>}<NavLink to={`${base}/ordenes`} className={clase}><i className="bi bi-receipt me-2" />Órdenes</NavLink>{modo === "admin" && <NavLink to="/admin/boletas" className={clase}><i className="bi bi-file-earmark-text me-2" />Boletas</NavLink>}{modo === "admin" && <NavLink to="/admin/reportes" className={clase}><i className="bi bi-bar-chart-line me-2" />Reportes</NavLink>}<hr /><NavLink to="/" className={clase}><i className="bi bi-shop me-2" />Volver a la tienda</NavLink></Nav><div className="mt-auto pt-4 small"><p className="mb-2 text-white">{obtenerNombreUsuario(usuario)}<br />{usuario?.correo}</p><Button size="sm" variant="outline-light" onClick={salir}>Cerrar sesión</Button></div></aside>;
}
