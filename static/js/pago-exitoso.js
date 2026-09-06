function mostrarPagoExitoso() {
    const contenedor = document.getElementById("detallePagoExitoso");
    if (!contenedor) return;

    const codigo = new URLSearchParams(window.location.search).get("orden");
    const orden = codigo ? obtenerOrdenPorCodigo(codigo) : null;

    if (!orden) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">
                No fue posible encontrar la orden de compra.
            </div>
            <a href="/productos" class="btn btn-dark">Volver a productos</a>
        `;
        return;
    }

    const cantidadProductos = orden.productos.reduce(
        (total, producto) => total + producto.cantidad,
        0
    );

    contenedor.innerHTML = `
        <div class="pago-exitoso-icono" aria-hidden="true">✓</div>
        <h1 class="display-6 fw-bold mt-3">¡Pago exitoso!</h1>
        <p class="lead mb-4">Tu compra fue registrada correctamente.</p>

        <div class="card shadow-sm text-start mx-auto pago-exitoso-card">
            <div class="card-body">
                <div class="d-flex justify-content-between gap-3 border-bottom pb-2 mb-3">
                    <span>Orden</span>
                    <strong>${orden.codigo}</strong>
                </div>
                <div class="d-flex justify-content-between gap-3 mb-2">
                    <span>Fecha</span>
                    <strong>${formatearFechaOrden(orden.fecha)}</strong>
                </div>
                <div class="d-flex justify-content-between gap-3 mb-2">
                    <span>Productos</span>
                    <strong>${cantidadProductos}</strong>
                </div>
                <div class="d-flex justify-content-between gap-3 mb-2">
                    <span>Estado</span>
                    <span class="badge bg-success">${orden.estado}</span>
                </div>
                <div class="d-flex justify-content-between gap-3 border-top pt-3 mt-3 fs-5">
                    <span>Total pagado</span>
                    <strong>${formatearPrecioOrden(orden.total)}</strong>
                </div>
            </div>
        </div>

        <div class="d-flex flex-wrap justify-content-center gap-2 mt-4">
            <a href="/productos" class="btn btn-dark">Seguir comprando</a>
            <a href="/" class="btn btn-outline-dark">Volver al inicio</a>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", mostrarPagoExitoso);
