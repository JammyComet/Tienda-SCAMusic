import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import GraficoBarras from "../../components/organisms/GraficoBarras";
import ResumenOrdenes from "../../components/organisms/ResumenOrdenes";
import TarjetaKpi from "../../components/molecules/TarjetaKpi";
import { useAuth } from "../../hooks/useAuth";
import { obtenerNombreUsuario, obtenerOrdenes, obtenerProductos, obtenerUsuarios } from "../../data/storage";
import { calcularEstadisticas, obtenerStockPorProducto, obtenerUnidadesPorProducto, obtenerVentasPorProducto } from "../../utils/estadisticas";
import { formatearPrecio } from "../../utils/format";

export default function AdminPanel() {
  const { usuario } = useAuth();
  const ordenes = obtenerOrdenes();
  const productos = obtenerProductos();
  const usuarios = obtenerUsuarios();
  const resumen = calcularEstadisticas(ordenes, productos, usuarios);
  const accesos = [
    ["Productos", "Administra catálogo, stock, precios y ofertas.", "/admin/productos", "bi-disc"],
    ["Usuarios", "Administra clientes, vendedores y administradores.", "/admin/usuarios", "bi-people"],
    ["Órdenes", "Revisa las compras y el detalle de cada venta.", "/admin/ordenes", "bi-receipt"],
    ["Boletas", "Consulta el historial de boletas emitidas y su detalle.", "/admin/boletas", "bi-file-earmark-text"],
    ["Reportes", "Revisa el resumen general y el rendimiento de cada producto.", "/admin/reportes", "bi-bar-chart-line"],
  ];

  return (
    <section className="dashboard-page">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <p className="text-secondary mb-1">Dashboard de administración</p>
          <h2 className="display-6 fw-bold mb-1">Hola, {obtenerNombreUsuario(usuario)}</h2>
        </div>
        <span className="badge text-bg-dark px-3 py-2">{usuario.rol}</span>
      </div>

      <Row className="g-3 mb-4">
        <Col sm={6} xl><TarjetaKpi titulo="Ventas totales" valor={formatearPrecio(resumen.ventasTotales)} subtitulo="Órdenes pagadas" icono="bi-cash-stack" /></Col>
        <Col sm={6} xl><TarjetaKpi titulo="Órdenes" valor={resumen.ordenesPagadas} subtitulo="Compras exitosas" icono="bi-bag-check" /></Col>
        <Col sm={6} xl><TarjetaKpi titulo="Productos activos" valor={resumen.productosActivos} subtitulo={`${productos.length} registrados`} icono="bi-disc" /></Col>
        <Col sm={6} xl><TarjetaKpi titulo="Usuarios" valor={resumen.usuarios} subtitulo="Cuentas registradas" icono="bi-people" /></Col>
        <Col sm={6} xl><TarjetaKpi titulo="Stock crítico" valor={resumen.stockCritico} subtitulo="Productos por reponer" icono="bi-exclamation-triangle" /></Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xl={7}>
          <GraficoBarras titulo="Ventas por producto" datos={obtenerVentasPorProducto(ordenes)} formatearValor={formatearPrecio} mensajeVacio="Aún no hay ventas registradas." />
        </Col>
        <Col xl={5}>
          <GraficoBarras titulo="Unidades vendidas" datos={obtenerUnidadesPorProducto(ordenes)} formatearValor={(valor) => `${valor} u.`} mensajeVacio="Aún no hay unidades vendidas." />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xl={7}>
          <GraficoBarras titulo="Stock actual" datos={obtenerStockPorProducto(productos)} formatearValor={(valor) => `${valor} u.`} />
        </Col>
        <Col xl={5}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <h3 className="h5 fw-bold text-dark mb-1">Accesos rápidos</h3>
              <div className="d-grid gap-3">
                {accesos.map(([titulo, descripcion, ruta, icono]) => (
                  <div className="dashboard-quick-link" key={titulo}>
                    <div className="d-flex gap-3 align-items-start">
                      <div className="dashboard-quick-icon"><i className={`bi ${icono}`} /></div>
                      <div className="flex-grow-1">
                        <h4 className="h6 fw-bold text-dark mb-1">{titulo}</h4>
                        <p className="small text-secondary mb-2">{descripcion}</p>
                        <Button as={Link} to={ruta} size="sm" variant="outline-dark">Abrir</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ResumenOrdenes ordenes={ordenes} baseRuta="/admin" />
    </section>
  );
}
