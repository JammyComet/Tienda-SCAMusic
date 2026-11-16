import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Footer from "./Footer";
import NavBar from "./NavBar";

export default function Layout() {
  const { esVendedor } = useAuth();
  // El vendedor solo puede navegar por productos y órdenes en su propio panel.
  if (esVendedor) return <Navigate to="/vendedor/productos" replace />;
  return <><NavBar /><main className="flex-grow-1"><Outlet /></main><Footer /></>;
}
