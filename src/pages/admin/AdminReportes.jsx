import { useEffect, useMemo, useState } from "react";
import { Card, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import GraficoBarras from "../../components/organisms/GraficoBarras";
import TablaDatos from "../../components/organisms/TablaDatos";
import TarjetaKpi from "../../components/molecules/TarjetaKpi";
import { obtenerOrdenes, obtenerProductos } from "../../data/storage";
import { calcularEstadisticas, obtenerRankingProductos, obtenerReporteProducto } from "../../utils/estadisticas";
import { formatearFecha, formatearPrecio } from "../../utils/format";

export default function AdminReportes() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const actualizar = () => setVersion((version) => version + 1);
    window.addEventListener("scamusic-data", actualizar);
    return () => window.removeEventListener("scamusic-data", actualizar);
  }, []);

  const ordenes = obtenerOrdenes();
  const productos = obtenerProductos();
  const resumen = calcularEstadisticas(ordenes, productos);
  const ranking = obtenerRankingProductos(ordenes, productos);
  const rankingPorUnidades = [...ranking].sort((a, b) => b.unidades - a.unidades);
  const productoMasVendido = rankingPorUnidades.find((producto) => producto.unidades > 0);
  const datosGrafico = rankingPorUnidades
    .filter((producto) => producto.unidades > 0)
    .slice(0, 6)
    .map((producto) => ({ etiqueta: producto.nombre, valor: producto.unidades }));

  const [codigoSeleccionado, setCodigoSeleccionado] = useState(() => productos[0]?.codigo || "");
  const productoSeleccionado = useMemo(
    () => productos.find((producto) => producto.codigo === codigoSeleccionado) || productos[0] || null,
    [codigoSeleccionado, productos],
  );
  const reporteProducto = obtenerReporteProducto(ordenes, productoSeleccionado);

  useEffect(() => {
    if (productos.length && !productos.some((producto) => producto.codigo === codigoSeleccionado)) {
      setCodigoSeleccionado(productos[0].codigo);
    }
  }, [productos, codigoSeleccionado]);

  return (
    <section>
      <div className="mb-4">
        <p className="text-secondary mb-1">Administración</p>
        <h2 className="fw-bold">Reportes</h2>
      </div>

      <Tabs defaultActiveKey="general" className="mb-4 admin-report-tabs">
        <Tab eventKey="general" title="Reporte general">
          <Row className="g-3 mb-4">
            <Col sm={6} xl={3}>
              <TarjetaKpi titulo="Total vendido" valor={formatearPrecio(resumen.ventasTotales)} subtitulo="Ventas pagadas" icono="bi-cash-stack" />
            </Col>
            <Col sm={6} xl={3}>
              <TarjetaKpi titulo="Órdenes" valor={resumen.ordenesPagadas} subtitulo="Compras exitosas" icono="bi-bag-check" />
            </Col>
            <Col sm={6} xl={3}>
              <TarjetaKpi titulo="Unidades vendidas" valor={resumen.unidadesVendidas} subtitulo="Productos vendidos" icono="bi-box-seam" />
            </Col>
            <Col sm={6} xl={3}>
              <TarjetaKpi titulo="Más vendido" valor={productoMasVendido?.nombre || "Sin ventas"} subtitulo={productoMasVendido ? `${productoMasVendido.unidades} unidades` : "Aún no hay ventas"} icono="bi-trophy" />
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            <Col>
              <GraficoBarras
                titulo="Productos más vendidos"
                datos={datosGrafico}
                formatearValor={(valor) => `${valor} u.`}
                mensajeVacio="Aún no hay ventas registradas."
              />
            </Col>
          </Row>

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h3 className="h5 fw-bold text-dark mb-1">Resumen de productos</h3>
              <TablaDatos
                columnas={["Producto", "Unidades vendidas", "Ingresos", "Stock actual"]}
                filas={ranking}
                mensajeVacio="No hay productos para mostrar."
                renderFila={(item) => (
                  <tr key={item.codigo}>
                    <td><strong>{item.nombre}</strong><div className="small text-secondary">{item.codigo}</div></td>
                    <td>{item.unidades}</td>
                    <td>{formatearPrecio(item.ingresos)}</td>
                    <td>{item.stock}</td>
                  </tr>
                )}
              />
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="producto" title="Reporte por producto">
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Form.Group>
                <Form.Label className="fw-semibold">Seleccionar producto</Form.Label>
                <Form.Select
                  value={productoSeleccionado?.codigo || ""}
                  onChange={(event) => setCodigoSeleccionado(event.target.value)}
                  disabled={!productos.length}
                >
                  {productos.map((producto) => (
                    <option key={producto.codigo} value={producto.codigo}>
                      {producto.codigo} - {producto.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>

          {productoSeleccionado ? (
            <>
              <Row className="g-3 mb-4">
                <Col sm={6} lg={4}>
                  <TarjetaKpi titulo="Unidades vendidas" valor={reporteProducto.unidades} subtitulo="Cantidad total" icono="bi-box-seam" />
                </Col>
                <Col sm={6} lg={4}>
                  <TarjetaKpi titulo="Ingresos" valor={formatearPrecio(reporteProducto.ingresos)} subtitulo="Dinero generado" icono="bi-cash-stack" />
                </Col>
                <Col sm={6} lg={4}>
                  <TarjetaKpi titulo="Stock actual" valor={productoSeleccionado.stock} subtitulo="Unidades disponibles" icono="bi-boxes" />
                </Col>
              </Row>

              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h3 className="h5 fw-bold text-dark mb-1">Ventas de {productoSeleccionado.nombre}</h3>
                  <TablaDatos
                    columnas={["Orden", "Fecha", "Cliente", "Cantidad", "Subtotal"]}
                    filas={reporteProducto.ordenes}
                    mensajeVacio="Este producto aún no tiene ventas registradas."
                    renderFila={(venta) => (
                      <tr key={`${venta.codigo}-${venta.producto.codigo}`}>
                        <td>{venta.codigo}</td>
                        <td>{formatearFecha(venta.fecha)}</td>
                        <td>{venta.cliente}</td>
                        <td>{venta.producto.cantidad}</td>
                        <td>{formatearPrecio(venta.producto.subtotal)}</td>
                      </tr>
                    )}
                  />
                </Card.Body>
              </Card>
            </>
          ) : (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center text-secondary py-5">No hay productos registrados.</Card.Body>
            </Card>
          )}
        </Tab>
      </Tabs>
    </section>
  );
}
