function crearFilaOrdenAdmin(orden) {
    const fila = document.createElement("tr");
    const cantidad = orden.productos.reduce(
        (total, producto) => total + Number(producto.cantidad || 0),
        0
    );

    fila.innerHTML = `
        <td>${orden.codigo}</td>
        <td>${formatearFechaOrden(orden.fecha)}</td>
        <td>
            <strong>${orden.cliente?.nombre || "Cliente"}</strong><br>
            <span class="small text-secondary">${orden.cliente?.correo || ""}</span>
        </td>
        <td>${cantidad}</td>
        <td>${formatearPrecioOrden(orden.total)}</td>
        <td><span class="badge bg-success">${orden.estado}</span></td>
        <td>
            <a
                href="/admin/orden-detalle?codigo=${encodeURIComponent(orden.codigo)}"
                class="btn btn-sm btn-dark"
            >Ver detalle</a>
        </td>
    `;

    return fila;
}

function mostrarOrdenesAdmin() {
    const tabla = document.getElementById("tablaOrdenesAdmin");
    if (!tabla) return;

    const ordenes = obtenerOrdenes()
        .slice()
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    tabla.innerHTML = "";

    if (ordenes.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-secondary py-4">
                    Todavía no existen órdenes registradas.
                </td>
            </tr>
        `;
        return;
    }

    ordenes.forEach(orden => tabla.appendChild(crearFilaOrdenAdmin(orden)));
}

document.addEventListener("DOMContentLoaded", mostrarOrdenesAdmin);
