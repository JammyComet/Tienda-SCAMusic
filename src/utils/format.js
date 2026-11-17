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
export function rutaImagen(imagen) {
  // Las portadas originales siguen en /imagenes; las subidas se sirven desde Spring Boot.
  if (typeof imagen === 'string' && /^subidos\/[0-9a-f]{32}\.(?:jpg|png|webp)$/.test(imagen)) {
    const apiBase=(import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');
    return `${apiBase}/api/v1/productos/imagenes/${imagen.slice('subidos/'.length)}`;
  }
  return imagen ? `/imagenes/${imagen}` : '/imagenes/logo.png';
}
export function precioConDescuento(producto) {
  const precio = Number(producto?.precio) || 0;
  const descuento = Number(producto?.descuento);
  if (!Number.isFinite(descuento) || descuento <= 0 || descuento > 100) return precio;
  return Math.round(precio * (1 - descuento / 100));
}
