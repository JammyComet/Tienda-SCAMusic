import { Card, Table } from "react-bootstrap";
import { formatearFecha, formatearPrecio } from "../../utils/format";
import EstadoBadge from "../atoms/EstadoBadge";

export default function DetalleOrden({ orden }) {
  if (!orden) return <div className="alert alert-warning">Orden no encontrada.</div>;
  const cliente = orden.cliente || {};
  const entrega = orden.entrega || cliente;
  const direccion = [entrega.direccion, entrega.comuna, entrega.region].filter(Boolean).join(", ");

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
        <div>
          <p className="text-secondary mb-1">Detalle de orden</p>
          <h2 className="fw-bold mb-1">{orden.codigo}</h2>
          <p className="mb-0">{formatearFecha(orden.fecha)}</p>
          {orden.boletaNumero && <p className="text-secondary mb-0">Boleta {orden.boletaNumero}</p>}
        </div>
        <div className="align-self-start fs-6"><EstadoBadge estado={orden.estado} /></div>
      </div>
      <Card className="mb-4">
        <Card.Body>
          <strong>{cliente.nombre || "Cliente"}</strong><br />
          <span className="text-secondary">{cliente.correo || "Sin correo"}</span>
          {cliente.telefono && <><br /><span className="text-secondary">{cliente.telefono}</span></>}
          {direccion && <><br /><span className="text-secondary">{direccion}</span></>}
        </Card.Body>
      </Card>
      <div className="table-responsive">
        <Table hover>
          <thead><tr><th>Código</th><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
          <tbody>{orden.productos.map((producto) => <tr key={producto.codigo}><td>{producto.codigo}</td><td>{producto.nombre}</td><td>{formatearPrecio(producto.precio)}</td><td>{producto.cantidad}</td><td>{formatearPrecio(producto.subtotal)}</td></tr>)}</tbody>
        </Table>
      </div>
      <h3 className="h5 text-end">Total: {formatearPrecio(orden.total)}</h3>
    </>
  );
}
