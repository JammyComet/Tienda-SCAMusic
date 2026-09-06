function eliminarProducto(codigo) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    const productos = obtenerProductos().filter(
        producto => producto.codigo !== codigo
    );

    guardarColeccion(COLO_KEYS.productos, productos);
    mostrarProductosAdministrador();
}

function crearFilaProducto(producto) {
    const fila = document.createElement("tr");

    const esStockCritico =
        producto.stockCritico !== null &&
        producto.stockCritico !== undefined &&
        producto.stock <= producto.stockCritico;

    const stock = esStockCritico
        ? `<span class="badge bg-danger">${producto.stock} - Stock crítico</span>`
        : producto.stock;

    fila.innerHTML = `
        <td>${producto.codigo}</td>
        <td>${producto.nombre}</td>
        <td>${formatearPrecio(producto.precio)}</td>
        <td>${stock}</td>
        <td>${obtenerNombreCategoria(producto.categoriaId)}</td>
        <td>${producto.estado}</td>
        <td class="text-nowrap">
            <a
                href="/producto-detalle?codigo=${producto.codigo}"
                class="btn btn-sm btn-outline-secondary"
            >Ver</a>

            <a
                href="/admin/productos/form?codigo=${producto.codigo}"
                class="btn btn-sm btn-dark"
            >Editar</a>

            <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                onclick="eliminarProducto('${producto.codigo}')"
            >Eliminar</button>
        </td>
    `;

    return fila;
}

function mostrarProductosAdministrador() {
    const tabla = document.getElementById("tablaProductos");
    if (!tabla) return;

    const productos = obtenerProductos();
    tabla.innerHTML = "";

    if (productos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-secondary">
                    No existen productos registrados.
                </td>
            </tr>
        `;
        return;
    }

    productos.forEach(producto => {
        tabla.appendChild(crearFilaProducto(producto));
    });
}

document.addEventListener("DOMContentLoaded", mostrarProductosAdministrador);
