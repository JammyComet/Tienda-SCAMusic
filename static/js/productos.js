function obtenerProductos() {
    return obtenerColeccion(COLO_KEYS.productos);
}

function obtenerProductoPorCodigo(codigo) {
    return obtenerProductos().find(producto => producto.codigo === codigo);
}

function obtenerNombreCategoria(categoriaId) {
    const categorias = obtenerColeccion(COLO_KEYS.categorias);
    const categoria = categorias.find(item => item.id === Number(categoriaId));
    return categoria ? categoria.nombre : "Sin categoría";
}

function formatearPrecio(precio) {
    return Number(precio).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}

function crearTarjetaProducto(producto) {
    const columna = document.createElement("div");
    columna.className = "col-12 col-md-6 col-lg-4";

    columna.innerHTML = `
        <article class="card product-card h-100">
            <img
                src="/static/imagenes/${producto.imagen}"
                class="card-img-top"
                alt="${producto.nombre}"
            >

            <div class="card-body">
                <h3 class="h5">${producto.nombre}</h3>
                <p class="mb-2">${producto.artista}</p>

                <span class="badge bg-dark">
                    ${obtenerNombreCategoria(producto.categoriaId)}
                </span>

                <p class="fw-bold mt-3 mb-2">
                    ${formatearPrecio(producto.precio)}
                </p>

                <p class="small text-secondary">
                    Stock: ${producto.stock}
                </p>

                <a
                    href="/producto-detalle?codigo=${producto.codigo}"
                    class="btn btn-outline-dark"
                >
                    Ver detalle
                </a>

                <button
                    type="button"
                    class="btn btn-dark"
                    onclick="agregarAlCarrito('${producto.codigo}')"
                >
                    Añadir al carrito
                </button>
            </div>
        </article>
    `;

    return columna;
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById("contenedorProductos");
    if (!contenedor) return;

    const productosActivos = productos.filter(
        producto => producto.estado === "Activo"
    );

    contenedor.innerHTML = "";

    if (productosActivos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <p class="text-center">No se encontraron productos.</p>
            </div>
        `;
        return;
    }

    productosActivos.forEach(producto => {
        contenedor.appendChild(crearTarjetaProducto(producto));
    });
}

function cargarCategoriasFiltro() {
    const select = document.getElementById("filtroCategoria");
    if (!select) return;

    obtenerColeccion(COLO_KEYS.categorias).forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;
        select.appendChild(opcion);
    });
}

function filtrarProductos() {
    const texto = document.getElementById("buscarProducto").value.trim().toLowerCase();
    const categoria = document.getElementById("filtroCategoria").value;

    const filtrados = obtenerProductos().filter(producto => {
        const coincideTexto =
            producto.nombre.toLowerCase().includes(texto) ||
            producto.artista.toLowerCase().includes(texto);

        const coincideCategoria =
            categoria === "" || producto.categoriaId === Number(categoria);

        return coincideTexto && coincideCategoria;
    });

    mostrarProductos(filtrados);
}

function inicializarProductos() {
    const contenedor = document.getElementById("contenedorProductos");
    if (!contenedor) return;

    cargarCategoriasFiltro();
    mostrarProductos(obtenerProductos());

    document.getElementById("buscarProducto")
        .addEventListener("input", filtrarProductos);

    document.getElementById("filtroCategoria")
        .addEventListener("change", filtrarProductos);
}

document.addEventListener("DOMContentLoaded", inicializarProductos);
