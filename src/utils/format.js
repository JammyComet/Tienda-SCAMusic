export function formatearPrecio(precio) { return Number(precio || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }); }
export function formatearFecha(fecha) {
  if(!fecha)return 'Sin fecha';
  // MySQL guarda fechas de pedidos como LocalDate (YYYY-MM-DD, sin hora).
  // new Date('YYYY-MM-DD') usa UTC y en Chile muestra el día anterior.
  if(/^\d{4}-\d{2}-\d{2}$/.test(fecha)){
    const local=new Date(`${fecha}T12:00:00`);
    return Number.isNaN(local.getTime()) ? 'Fecha inválida' : local.toLocaleDateString('es-CL',{dateStyle:'medium'});
  }
  const fechaCompleta=new Date(fecha);
  return Number.isNaN(fechaCompleta.getTime()) ? 'Fecha inválida' : fechaCompleta.toLocaleString('es-CL',{dateStyle:'medium',timeStyle:'short'});
}
export function rutaImagen(imagen) { return imagen ? `/imagenes/${imagen}` : "/imagenes/logo.png"; }
export function precioConDescuento(producto) {
  const precio = Number(producto?.precio) || 0;
  const descuento = Number(producto?.descuento);
  if (!Number.isFinite(descuento) || descuento <= 0 || descuento > 100) return precio;
  return Math.round(precio * (1 - descuento / 100));
}
