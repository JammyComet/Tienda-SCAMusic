import { formatearPrecio } from "../../utils/format";

export default function Precio({ valor, className = "" }) {
  return <span className={className}>{formatearPrecio(valor)}</span>;
}
