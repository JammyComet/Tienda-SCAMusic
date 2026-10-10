import { Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import BoletaCompra from "../../components/organisms/BoletaCompra";
import { obtenerBoletaPorNumero } from "../../data/storage";

export default function AdminDetalleBoleta() {
  const { numero } = useParams();
  const orden = obtenerBoletaPorNumero(decodeURIComponent(numero));

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <p className="text-secondary mb-1">Administración / Boletas</p>
          <h2 className="fw-bold mb-0">Detalle de boleta</h2>
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to="/admin/boletas" variant="dark">Volver</Button>
        </div>
      </div>
      <BoletaCompra orden={orden} />
    </section>
  );
}
