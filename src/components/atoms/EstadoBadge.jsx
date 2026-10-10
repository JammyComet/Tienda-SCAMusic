import { Badge } from "react-bootstrap";

export default function EstadoBadge({ estado }) {
  return <Badge bg={estado === "Activo" || estado === "Pagada" ? "success" : "secondary"}>{estado}</Badge>;
}
