import { Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import DetalleOrden from "../../components/organisms/DetalleOrden";
import { obtenerOrdenPorCodigo } from "../../data/storage";

export default function AdminDetalleOrden() {
  const { codigo } = useParams();
  const orden = obtenerOrdenPorCodigo(decodeURIComponent(codigo));

  return (
    <section>
      <DetalleOrden orden={orden} />
      <div className="d-flex flex-wrap gap-2 mt-4">
        <Button as={Link} to="/admin/ordenes" variant="outline-dark">Volver a órdenes</Button>
        {orden?.boletaNumero && <Button as={Link} to={`/admin/boletas/${encodeURIComponent(orden.boletaNumero)}`} variant="dark">Ver boleta</Button>}
      </div>
    </section>
  );
}
