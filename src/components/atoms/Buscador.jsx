import { Form } from "react-bootstrap";

export default function Buscador({ valor, onChange, placeholder = "Buscar" }) {
  return <Form.Control value={valor} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}
