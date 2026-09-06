function mostrarDetalleOrdenVendedor() {
    const contenedor = document.getElementById("detalleOrdenVendedor");
    if (!contenedor) return;

    const codigo = new URLSearchParams(window.location.search).get("codigo");
    const orden = codigo ? obtenerOrdenPorCodigo(codigo) : null;

    if (!orden) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">Orden no encontrada.</div>
            <a href="/vendedor/ordenes" class="btn btn-dark">Volver a órdenes</a>
        `;
        return;
    }

    const filas = orden.productos.map(producto => `
        <tr>
            <td>${producto.codigo}</td>
            <td>
                <strong>${producto.nombre}</strong><br>
                <span class="small text-secondary">${producto.artista || ""}</span>
            </td>
            <td>${formatearPrecioOrden(producto.precio)}</td>
            <td>${producto.cantidad}</td>
            <td>${formatearPrecioOrden(producto.subtotal)}</td>
        </tr>
    `).join("");

    contenedor.innerHTML = `
        <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
            <div>
                <p class="text-secondary mb-1">Órdenes / Detalle</p>
                <h2 class="fw-bold mb-1">${orden.codigo}</h2>
                <p class="mb-0">${formatearFechaOrden(orden.fecha)}</p>
            </div>
            <span class="badge bg-success fs-6">${orden.estado}</span>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-12 col-lg-6">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h3 class="h5 fw-bold">Cliente</h3>
                        <p class="mb-1">${orden.cliente?.nombre || "Cliente"}</p>
                        <p class="text-secondary mb-0">${orden.cliente?.correo || "Sin correo"}</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-6">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h3 class="h5 fw-bold">Resumen</h3>
                        <p class="mb-1">Productos: ${orden.productos.reduce((t, p) => t + p.cantidad, 0)}</p>
                        <p class="fs-5 fw-bold mb-0">Total: ${formatearPrecioOrden(orden.total)}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>${filas}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", mostrarDetalleOrdenVendedor);
