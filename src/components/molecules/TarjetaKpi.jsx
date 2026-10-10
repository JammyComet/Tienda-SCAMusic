import { Card } from "react-bootstrap";

export default function TarjetaKpi({ titulo, valor, subtitulo, icono = "bi-graph-up" }) {
  return (
    <Card className="dashboard-kpi h-100 border-0 shadow-sm">
      <Card.Body className="d-flex align-items-center gap-3">
        <div className="dashboard-kpi-icon"><i className={`bi ${icono}`} /></div>
        <div>
          <p className="text-secondary small mb-1">{titulo}</p>
          <h3 className="h4 fw-bold mb-0 text-dark">{valor}</h3>
          {subtitulo && <small className="text-secondary">{subtitulo}</small>}
        </div>
      </Card.Body>
    </Card>
  );
}
