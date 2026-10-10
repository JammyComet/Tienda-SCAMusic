import { Card } from "react-bootstrap";

export default function GraficoBarras({ titulo, subtitulo, datos, formatearValor = (valor) => valor, mensajeVacio = "No hay datos para mostrar." }) {
  const maximo = Math.max(0, ...datos.map((item) => Number(item.valor) || 0));

  return (
    <Card className="h-100 border-0 shadow-sm dashboard-chart-card">
      <Card.Body>
        <div className="mb-4">
          <h3 className="h5 fw-bold text-dark mb-1">{titulo}</h3>
          {subtitulo && <p className="text-secondary small mb-0">{subtitulo}</p>}
        </div>
        {datos.length ? (
          <div className="dashboard-bars">
            {datos.map((item) => {
              const valor = Number(item.valor) || 0;
              const ancho = valor > 0 && maximo > 0 ? Math.max(4, (valor / maximo) * 100) : 0;
              return (
                <div className="dashboard-bar-row" key={item.etiqueta}>
                  <div className="d-flex justify-content-between gap-3 mb-1">
                    <span className="dashboard-bar-label text-truncate">{item.etiqueta}</span>
                    <strong className="small text-nowrap">{formatearValor(valor)}</strong>
                  </div>
                  <div className="dashboard-bar-track">
                    <div className="dashboard-bar-fill" style={{ width: `${ancho}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-empty d-flex align-items-center justify-content-center text-center text-secondary">
            <div><i className="bi bi-bar-chart fs-2 d-block mb-2" />{mensajeVacio}</div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
