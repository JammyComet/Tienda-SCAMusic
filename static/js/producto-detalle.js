function mostrarDetalleProducto(producto) {
    const imagen = document.getElementById("detalleImagen");
    imagen.src = `/static/imagenes/${producto.imagen}`;
    imagen.alt = producto.nombre;

    const datos = {
        detalleNombre: producto.nombre,
        detalleArtista: producto.artista,
        detalleCategoria: obtenerNombreCategoria(producto.categoriaId),
        detalleFormato: producto.formato,
        detalleAnio: producto.anio,
        detalleStock: producto.stock,
        detallePrecio: formatearPrecio(producto.precio),
        detalleDescripcion: producto.descripcion
    };

    Object.entries(datos).forEach(([id, valor]) => {
        document.getElementById(id).textContent = valor;
    });
}

function mostrarProductoNoEncontrado() {
    document.getElementById("detalleProducto").innerHTML = `
        <div class="text-center py-5">
            <h1>Producto no encontrado</h1>
            <p class="text-secondary">El disco solicitado no existe.</p>
            <a href="/productos" class="btn btn-dark">Volver a productos</a>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    const codigo = new URLSearchParams(window.location.search).get("codigo");
    const producto = codigo ? obtenerProductoPorCodigo(codigo) : null;

    if (!producto) {
        mostrarProductoNoEncontrado();
        return;
    }

    mostrarDetalleProducto(producto);

    document.getElementById("btnAgregarCarrito")
        ?.addEventListener("click", () => agregarAlCarrito(producto.codigo));
});
