import { Badge, Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { obtenerNombreUsuario } from "../../data/storage";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export default function NavBar() {
  const { usuario, logout, esAdmin, esVendedor } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const clase = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  function salir() {
    logout();
    navigate("/");
  }

  return (
    <Navbar expand="lg" bg="light" className="site-header border-bottom" sticky="top">
      <Container fluid className="gap-2">
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2">
          <img src="/imagenes/audifonos.png" alt="Audífonos" className="site-logo" />
          <span className="brand-title"><span className="texto">Lo mejor de lo mejor</span><span className="tienda">SCAMusica</span><span className="virtual">TIENDA VIRTUAL</span></span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <div className="site-header-content">
            {!usuario ? (
              <Nav className="site-header-account align-items-center justify-content-lg-end gap-2">
                <NavLink to="/login" className="btn btn-outline-secondary btn-sm">Iniciar sesión</NavLink>
                <NavLink to="/registro" className="btn btn-dark btn-sm">Registrarse</NavLink>
              </Nav>
            ) : (
              <Nav className="site-header-account align-items-center justify-content-lg-end gap-2">
                <span className="small">👤 {obtenerNombreUsuario(usuario)} · {usuario.rol}</span>
                <Button size="sm" variant="outline-danger" onClick={salir}>Salir</Button>
              </Nav>
            )}
            <div className="site-header-navigation">
              <Nav className="align-items-lg-center justify-content-lg-center gap-lg-1">
                <NavLink className={clase} to="/" end>Home</NavLink>
                <NavLink className={clase} to="/productos">Productos</NavLink>
                <NavLink className={clase} to="/categorias">Categorías</NavLink>
                <NavLink className={clase} to="/ofertas">Ofertas</NavLink>
                <NavLink className={clase} to="/nosotros">Nosotros</NavLink>
                <NavLink className={clase} to="/blogs">Blogs</NavLink>
                <NavLink className={clase} to="/contacto">Contacto</NavLink>
                {esAdmin && <NavLink className={clase} to="/admin">Administración</NavLink>}
                {esVendedor && <NavLink className={clase} to="/vendedor">Vendedor</NavLink>}
              </Nav>
              <Nav className="site-header-cart align-items-lg-center">
                <NavLink to="/carrito" className="btn btn-outline-dark position-relative">🛒 Carrito <Badge bg="dark">{totalItems}</Badge></NavLink>
              </Nav>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
