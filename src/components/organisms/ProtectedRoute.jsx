import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ rolesPermitidos }) {
  const { usuario } = useAuth();
  const location = useLocation();
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (!rolesPermitidos.includes(usuario.rol)) return <Navigate to="/" replace />;
  return <Outlet />;
}
