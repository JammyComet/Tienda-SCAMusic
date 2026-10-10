import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ResumenOrdenes from "../../components/organisms/ResumenOrdenes";
import { useAuth } from "../../hooks/useAuth";
import { obtenerNombreUsuario, obtenerOrdenes } from "../../data/storage";

export default function VendedorPanel() {
  const { usuario } = useAuth();
  const ordenes = obtenerOrdenes();

  const accesos = [
    {
      titulo: "Productos y stock",
      descripcion: "Consulta el catálogo disponible y revisa las existencias de cada producto.",
      ruta: "/vendedor/productos",
      icono: "bi-disc",
      boton: "Ver productos",
    },
    {
      titulo: "Órdenes",
      descripcion: "Revisa las compras registradas y consulta el detalle de cada orden.",
      ruta: "/vendedor/ordenes",
      icono: "bi-receipt",
      boton: "Ver órdenes",
    },
  ];

  return (
    <section className="dashboard-page">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <p className="text-secondary mb-1">Panel de vendedor</p>
          <h2 className="display-6 fw-bold mb-1">Hola, {obtenerNombreUsuario(usuario)}</h2>
        </div>
        <span className="badge text-bg-dark px-3 py-2">{usuario.rol}</span>
      </div>

      <Row className="g-4 mb-4">
        {accesos.map((acceso) => (
          <Col md={6} key={acceso.titulo}>
            <Card className="h-100 border-0 shadow-sm vendedor-dashboard-card">
              <Card.Body className="p-4 d-flex flex-column">
                <div className="dashboard-quick-icon mb-3"><i className={`bi ${acceso.icono}`} /></div>
                <h3 className="h4 fw-bold text-dark">{acceso.titulo}</h3>
                <p className="text-secondary flex-grow-1">{acceso.descripcion}</p>
                <Button as={Link} to={acceso.ruta} variant="dark" className="align-self-start">
                  {acceso.boton}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <ResumenOrdenes ordenes={ordenes} baseRuta="/vendedor" />
    </section>
  );
}
