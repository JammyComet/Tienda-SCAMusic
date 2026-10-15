import { rutaImagen } from "../../utils/format.js";

export default function ImagenProducto({ imagen, alt, className = "" }) {
  return <img src={rutaImagen(imagen)} alt={alt} className={className} />;
}
