document.addEventListener("DOMContentLoaded",
    function () {
        const parametros =
            new URLSearchParams(
                window.location.search
            );


        
        const codigo =
            parametros.get("codigo");


        
        if (!codigo) {

            mostrarProductoNoEncontrado();

            return;
        }
        const producto =
            obtenerProductoPorCodigo(codigo);
        if (!producto) {

            mostrarProductoNoEncontrado();

            return;
        }


        mostrarDetalleProducto(producto);
    }
);

function mostrarDetalleProducto(producto) {

    const imagen =
        document.getElementById(
            "detalleImagen"
        );


    imagen.src =
        `/static/imagenes/${producto.imagen}`;


    imagen.alt =
        producto.nombre;


    document.getElementById(
        "detalleNombre"
    ).textContent =
        producto.nombre;


    document.getElementById(
        "detalleArtista"
    ).textContent =
        producto.artista;


    document.getElementById(
        "detalleCategoria"
    ).textContent =
        obtenerNombreCategoria(
            producto.categoriaId
        );


    document.getElementById(
        "detalleFormato"
    ).textContent =
        producto.formato;


    document.getElementById(
        "detalleAnio"
    ).textContent =
        producto.anio;


    document.getElementById(
        "detalleStock"
    ).textContent =
        producto.stock;


    document.getElementById(
        "detallePrecio"
    ).textContent =
        formatearPrecio(
            producto.precio
        );


    document.getElementById(
        "detalleDescripcion"
    ).textContent =
        producto.descripcion;
}

function mostrarProductoNoEncontrado() {

    const contenedor =
        document.getElementById(
            "detalleProducto"
        );


    contenedor.innerHTML = `
        <div class="text-center py-5">

            <h1>
                Producto no encontrado
            </h1>

            <p class="text-secondary">
                El disco solicitado no existe.
            </p>

            <a
                href="/productos"
                class="btn btn-dark"
            >
                Volver a productos
            </a>

        </div>
    `;
}