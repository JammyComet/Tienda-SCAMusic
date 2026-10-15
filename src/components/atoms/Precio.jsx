import { formatearPrecio } from "../../utils/format.js";

export default function Precio({ valor, className = "" }) {
  return <span className={className}>{formatearPrecio(valor)}</span>;
}
