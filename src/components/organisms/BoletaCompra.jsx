import { Badge, Card, Table } from "react-bootstrap";
import { formatearFecha, formatearPrecio } from "../../utils/format";

export default function BoletaCompra({ orden }) {
  if (!orden) return <div className="alert alert-warning">Boleta no encontrada.</div>;

  const cliente = orden.cliente || {};
  const entrega = orden.entrega || cliente;
  const direccion = [entrega.direccion, entrega.comuna, entrega.region].filter(Boolean).join(", ");

  return (
    <Card className="border-0 shadow-sm boleta-compra">
      <Card.Body className="p-4 p-lg-5">
        <div className="d-flex flex-wrap justify-content-between gap-3 border-bottom pb-4 mb-4">
          <div>
            <h2 className="fw-bold mb-1">SCAMusica</h2>
            <p className="text-secondary mb-0">Boleta de compra</p>
          </div>
          <div className="text-md-end">
            <div className="fs-4 fw-bold">{orden.boletaNumero}</div>
            <div className="text-secondary">Orden {orden.codigo}</div>
            <div className="text-secondary">{formatearFecha(orden.fecha)}</div>
            <Badge bg="success" className="mt-2">{orden.estado}</Badge>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="h6 fw-bold text-uppercase text-secondary">Comprador</h3>
          <div className="row g-2">
            <div className="col-md-6"><strong>Nombre:</strong> {cliente.nombre || "No informado"}</div>
            <div className="col-md-6"><strong>RUN:</strong> {cliente.run || "No informado"}</div>
            <div className="col-md-6"><strong>Correo:</strong> {cliente.correo || "No informado"}</div>
            <div className="col-md-6"><strong>Teléfono:</strong> {cliente.telefono || "No informado"}</div>
            <div className="col-12"><strong>Dirección de entrega:</strong> {direccion || "No informada"}</div>
          </div>
        </div>

        <div className="table-responsive mb-3">
          <Table className="align-middle mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Precio unitario</th>
                <th>Descuento</th>
                <th>Cantidad</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.productos.map((producto) => (
                <tr key={producto.codigo}>
                  <td>{producto.codigo}</td>
                  <td>
                    <strong>{producto.nombre}</strong>
                    {producto.artista && <div className="small text-secondary">{producto.artista}</div>}
                  </td>
                  <td>{formatearPrecio(producto.precio)}</td>
                  <td>{Number(producto.descuento || 0) > 0 ? `${producto.descuento}%` : "-"}</td>
                  <td>{producto.cantidad}</td>
                  <td className="text-end">{formatearPrecio(producto.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="d-flex justify-content-end">
          <div className="text-end border-top pt-3" style={{ minWidth: "260px" }}>
            <div className="d-flex justify-content-between gap-4 fs-5">
              <span>Total pagado</span>
              <strong>{formatearPrecio(orden.total)}</strong>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
