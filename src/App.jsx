import { Route, Routes } from "react-router-dom";
import Layout from "./components/organisms/Layout";
import AdminLayout from "./components/organisms/AdminLayout";
import ProtectedRoute from "./components/organisms/ProtectedRoute";
import { ROLES } from "./context/AuthContext";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Nosotros from "./pages/Nosotros";
import Blog from "./pages/Blog";
import BlogDetalle from "./pages/BlogDetalle";
import Contacto from "./pages/Contacto";
import PagoExitoso from "./pages/PagoExitoso";
import PagoError from "./pages/PagoError";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminProductoForm from "./pages/admin/AdminProductoForm";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminUsuarioForm from "./pages/admin/AdminUsuarioForm";
import AdminOrdenes from "./pages/admin/AdminOrdenes";
import AdminDetalleOrden from "./pages/admin/AdminDetalleOrden";
import AdminBoletas from "./pages/admin/AdminBoletas";
import AdminDetalleBoleta from "./pages/admin/AdminDetalleBoleta";
import AdminReportes from "./pages/admin/AdminReportes";
import VendedorPanel from "./pages/vendedor/VendedorPanel";
import VendedorProductos from "./pages/vendedor/VendedorProductos";
import VendedorOrdenes from "./pages/vendedor/VendedorOrdenes";
import VendedorDetalleOrden from "./pages/vendedor/VendedorDetalleOrden";
import Categorias from "./pages/Categorias";
import Ofertas from "./pages/Ofertas"; // Importa la página Ofertas desde el archivo Ofertas.jsx, que se utiliza para mostrar las ofertas de productos en la aplicación.

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} /> 
        <Route path="/productos/:codigo" element={<ProductoDetalle />} />
        <Route path="/producto-detalle" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetalle />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/pago-error" element={<PagoError />} />
      </Route>

      <Route element={<ProtectedRoute rolesPermitidos={[ROLES.ADMINISTRADOR]} />}>
        <Route element={<AdminLayout modo="admin" />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/productos/nuevo" element={<AdminProductoForm />} />
          <Route path="/admin/productos/editar/:codigo" element={<AdminProductoForm />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/usuarios/nuevo" element={<AdminUsuarioForm />} />
          <Route path="/admin/usuarios/editar/:correo" element={<AdminUsuarioForm />} />
          <Route path="/admin/ordenes" element={<AdminOrdenes />} />
          <Route path="/admin/ordenes/:codigo" element={<AdminDetalleOrden />} />
          <Route path="/admin/boletas" element={<AdminBoletas />} />
          <Route path="/admin/boletas/:numero" element={<AdminDetalleBoleta />} />
          <Route path="/admin/reportes" element={<AdminReportes />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute rolesPermitidos={[ROLES.VENDEDOR]} />}>
        <Route element={<AdminLayout modo="vendedor" />}>
          <Route path="/vendedor" element={<VendedorPanel />} />
          <Route path="/vendedor/productos" element={<VendedorProductos />} />
          <Route path="/vendedor/ordenes" element={<VendedorOrdenes />} />
          <Route path="/vendedor/ordenes/:codigo" element={<VendedorDetalleOrden />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
