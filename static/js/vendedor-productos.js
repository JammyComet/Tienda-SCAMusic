function crearFilaProductoVendedor(producto) {
    const fila = document.createElement("tr");

    const esStockCritico =
        producto.stockCritico !== null &&
        producto.stockCritico !== undefined &&
        producto.stock <= producto.stockCritico;

    let stock = producto.stock;
    if (producto.stock <= 0) {
        stock = '<span class="badge bg-secondary">0 - Sin stock</span>';
    } else if (esStockCritico) {
        stock = `<span class="badge bg-danger">${producto.stock} - Stock crítico</span>`;
    }

    fila.innerHTML = `
        <td>${producto.codigo}</td>
        <td>${producto.nombre}</td>
        <td>${formatearPrecio(producto.precio)}</td>
        <td>${stock}</td>
        <td>${obtenerNombreCategoria(producto.categoriaId)}</td>
        <td>${producto.estado}</td>
        <td>
            <a
                href="/producto-detalle?codigo=${producto.codigo}"
                class="btn btn-sm btn-outline-dark"
            >Ver detalle</a>
        </td>
    `;

    return fila;
}

function mostrarProductosVendedor() {
    const tabla = document.getElementById("tablaProductosVendedor");
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
        tabla.appendChild(crearFilaProductoVendedor(producto));
    });
}

document.addEventListener("DOMContentLoaded", mostrarProductosVendedor);
