import { rutaImagen } from "../../utils/format";

export default function ImagenProducto({ imagen, alt, className = "" }) {
  return <img src={rutaImagen(imagen)} alt={alt} className={className} />;
}
