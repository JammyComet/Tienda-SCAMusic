export function calcularEstadisticas(ordenes, productos, usuarios = []) {
  const ordenesPagadas = ordenes.filter((orden) => orden.estado === "Pagada");
  const ventasTotales = ordenesPagadas.reduce((total, orden) => total + Number(orden.total || 0), 0);
  const unidadesVendidas = ordenesPagadas.reduce((total, orden) => total + orden.productos.reduce((suma, producto) => suma + Number(producto.cantidad || 0), 0), 0);
  const productosActivos = productos.filter((producto) => producto.estado === "Activo").length;
  const stockCritico = productos.filter((producto) => Number(producto.stock) <= Number(producto.stockCritico ?? 0)).length;
  return { ventasTotales, ordenesPagadas: ordenesPagadas.length, unidadesVendidas, productosActivos, stockCritico, usuarios: usuarios.length };
}

export function obtenerVentasPorProducto(ordenes) {
  const mapa = new Map();
  ordenes.filter((orden) => orden.estado === "Pagada").forEach((orden) => {
    orden.productos.forEach((producto) => {
      const actual = mapa.get(producto.codigo) || { etiqueta: producto.nombre, valor: 0, unidades: 0 };
      actual.valor += Number(producto.subtotal || 0);
      actual.unidades += Number(producto.cantidad || 0);
      mapa.set(producto.codigo, actual);
    });
  });
  return [...mapa.values()].sort((a, b) => b.valor - a.valor).slice(0, 6);
}

export function obtenerUnidadesPorProducto(ordenes) {
  return obtenerVentasPorProducto(ordenes).map((item) => ({ etiqueta: item.etiqueta, valor: item.unidades }));
}

export function obtenerStockPorProducto(productos) {
  return [...productos]
    .sort((a, b) => Number(b.stock) - Number(a.stock))
    .slice(0, 6)
    .map((producto) => ({ etiqueta: producto.nombre, valor: Number(producto.stock || 0) }));
}

export function obtenerRankingProductos(ordenes, productos) {
  const pagadas = ordenes.filter((orden) => orden.estado === "Pagada");
  return productos.map((producto) => {
    let unidades = 0;
    let ingresos = 0;
    let cantidadOrdenes = 0;
    pagadas.forEach((orden) => {
      const detalle = orden.productos.find((item) => item.codigo === producto.codigo);
      if (!detalle) return;
      unidades += Number(detalle.cantidad || 0);
      ingresos += Number(detalle.subtotal || 0);
      cantidadOrdenes += 1;
    });
    return {
      codigo: producto.codigo,
      nombre: producto.nombre,
      unidades,
      ingresos,
      ordenes: cantidadOrdenes,
      stock: Number(producto.stock || 0),
      stockCritico: Number(producto.stockCritico || 0),
      estado: producto.estado,
    };
  }).sort((a, b) => b.ingresos - a.ingresos || b.unidades - a.unidades || a.nombre.localeCompare(b.nombre));
}

export function obtenerReporteProducto(ordenes, producto) {
  if (!producto) return { ingresos: 0, unidades: 0, ordenes: [], graficoOrdenes: [] };
  const ventas = ordenes
    .filter((orden) => orden.estado === "Pagada")
    .map((orden) => {
      const detalle = orden.productos.find((item) => item.codigo === producto.codigo);
      if (!detalle) return null;
      return {
        codigo: orden.codigo,
        boletaNumero: orden.boletaNumero,
        fecha: orden.fecha,
        cliente: orden.cliente?.nombre || orden.cliente?.correo || "Cliente",
        producto: detalle,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const ingresos = ventas.reduce((total, venta) => total + Number(venta.producto.subtotal || 0), 0);
  const unidades = ventas.reduce((total, venta) => total + Number(venta.producto.cantidad || 0), 0);
  const graficoOrdenes = ventas
    .slice(0, 8)
    .reverse()
    .map((venta) => ({ etiqueta: venta.codigo, valor: Number(venta.producto.subtotal || 0) }));

  return { ingresos, unidades, ordenes: ventas, graficoOrdenes };
}
