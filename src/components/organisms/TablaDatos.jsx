import { Table } from "react-bootstrap";

export default function TablaDatos({ columnas, filas, renderFila, mensajeVacio = "No hay registros." }) {
  return (
    <div className="table-responsive">
      <Table hover align="middle">
        <thead><tr>{columnas.map((columna) => <th key={columna}>{columna}</th>)}</tr></thead>
        <tbody>
          {filas.length ? filas.map(renderFila) : <tr><td colSpan={columnas.length} className="text-center py-4 text-secondary">{mensajeVacio}</td></tr>}
        </tbody>
      </Table>
    </div>
  );
}
