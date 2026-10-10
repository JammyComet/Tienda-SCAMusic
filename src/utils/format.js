export function formatearPrecio(precio) { return Number(precio || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }); }
export function formatearFecha(fecha) { return new Date(fecha).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" }); }
export function rutaImagen(imagen) { return imagen ? `/imagenes/${imagen}` : "/imagenes/logo.png"; }
export function precioConDescuento(producto) {
  const precio = Number(producto?.precio) || 0;
  const descuento = Number(producto?.descuento);
  if (!Number.isFinite(descuento) || descuento <= 0 || descuento > 100) return precio;
  return Math.round(precio * (1 - descuento / 100));
}
