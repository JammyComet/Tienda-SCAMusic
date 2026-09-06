function obtenerProductos() {
    return obtenerColeccion(COLO_KEYS.productos);
}

function obtenerProductoPorCodigo(codigo) {
    return obtenerProductos().find(
        producto => producto.codigo === codigo
    );
}

function obtenerNombreCategoria(categoriaId) {
    const categorias = obtenerColeccion(COLO_KEYS.categorias);
    const categoria = categorias.find(
        categoria => categoria.id === Number(categoriaId)
    );

    return categoria ? categoria.nombre : "Sin categoría";
}

function formatearPrecio(precio) {
    return Number(precio).toLocaleString(
        "es-CL",
        {
            style: "currency",
            currency: "CLP"
        }
    );
}


// TIENDA: LISTADO DE PRODUCTOS
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

    contenedor.innerHTML = "";

    const productosActivos = productos.filter(
        producto => producto.estado === "Activo"
    );

    if (productosActivos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <p class="text-center">
                    No se encontraron productos.
                </p>
            </div>
        `;
        return;
    }

    productosActivos.forEach(
        producto => contenedor.appendChild(crearTarjetaProducto(producto))
    );
}

function cargarCategorias() {
    const select = document.getElementById("filtroCategoria");
    if (!select) return;

    const categorias = obtenerColeccion(COLO_KEYS.categorias);

    categorias.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;
        select.appendChild(opcion);
    });
}

function filtrarProductos() {
    const texto = document
        .getElementById("buscarProducto")
        .value
        .trim()
        .toLowerCase();

    const categoriaSeleccionada = document
        .getElementById("filtroCategoria")
        .value;

    const productosFiltrados = obtenerProductos().filter(producto => {
        const coincideTexto =
            producto.nombre.toLowerCase().includes(texto) ||
            producto.artista.toLowerCase().includes(texto);

        const coincideCategoria =
            categoriaSeleccionada === "" ||
            producto.categoriaId === Number(categoriaSeleccionada);

        return coincideTexto && coincideCategoria;
    });

    mostrarProductos(productosFiltrados);
}


// ADMINISTRADOR: PRODUCTOS

function guardarProducto(producto) {
    const productos = obtenerProductos();

    const indice = productos.findIndex(
        item => item.codigo === producto.codigo
    );

    if (indice === -1) {
        productos.push(producto);
    } else {
        productos[indice] = producto;
    }

    guardarColeccion(
        COLO_KEYS.productos,
        productos
    );
}


function eliminarProducto(codigo) {
    const confirmar = confirm(
        "¿Seguro que deseas eliminar este producto?"
    );

    if (!confirmar) {
        return;
    }

    const productos = obtenerProductos().filter(
        producto => producto.codigo !== codigo
    );

    guardarColeccion(
        COLO_KEYS.productos,
        productos
    );

    mostrarProductosAdministrador();
}


function crearFilaProducto(producto) {
    const fila = document.createElement("tr");

    const stockCritico =
        producto.stockCritico !== null &&
        producto.stockCritico !== undefined &&
        producto.stock <= producto.stockCritico;

    const stock = stockCritico
        ? `
            <span class="badge bg-danger">
                ${producto.stock} - Stock crítico
            </span>
        `
        : producto.stock;

    fila.innerHTML = `
        <td>${producto.codigo}</td>

        <td>${producto.nombre}</td>

        <td>
            ${formatearPrecio(producto.precio)}
        </td>

        <td>${stock}</td>

        <td>
            ${obtenerNombreCategoria(
                producto.categoriaId
            )}
        </td>

        <td>
            ${producto.estado}
        </td>

        <td class="text-nowrap">

            <a
                href="/producto-detalle?codigo=${producto.codigo}"
                class="btn btn-sm btn-outline-secondary">
                Ver
            </a>

            <a
                href="/admin/productos/form?codigo=${producto.codigo}"
                class="btn btn-sm btn-dark">
                Editar
            </a>

            <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                onclick="eliminarProducto('${producto.codigo}')">
                Eliminar
            </button>

        </td>
    `;

    return fila;
}


function mostrarProductosAdministrador() {
    const tabla =
        document.getElementById(
            "tablaProductos"
        );

    if (!tabla) {
        return;
    }

    const productos = obtenerProductos();

    tabla.innerHTML = "";

    if (productos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="text-center text-secondary">

                    No existen productos registrados.

                </td>
            </tr>
        `;

        return;
    }

    productos.forEach(
        producto => {
            tabla.appendChild(
                crearFilaProducto(producto)
            );
        }
    );
}


// FORMULARIO NUEVO / EDITAR

function cargarCategoriasProducto() {
    const select =
        document.getElementById(
            "categoriaProducto"
        );

    if (!select) {
        return;
    }

    const categorias =
        obtenerColeccion(
            COLO_KEYS.categorias
        );

    select.innerHTML = `
        <option value="">
            Seleccione una categoría
        </option>
    `;

    categorias.forEach(
        categoria => {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                categoria.id;

            opcion.textContent =
                categoria.nombre;

            select.appendChild(opcion);
        }
    );
}


function cargarProductoEnFormulario(producto) {

    document.getElementById(
        "tituloFormularioProducto"
    ).textContent = "Editar producto";


    const codigo =
        document.getElementById(
            "codigoProducto"
        );

    codigo.value = producto.codigo;
    codigo.readOnly = true;


    document.getElementById(
        "nombreProducto"
    ).value = producto.nombre;


    document.getElementById(
        "artistaProducto"
    ).value = producto.artista;


    document.getElementById(
        "descripcionProducto"
    ).value = producto.descripcion || "";


    document.getElementById(
        "precioProducto"
    ).value = producto.precio;


    document.getElementById(
        "stockProducto"
    ).value = producto.stock;


    document.getElementById(
        "stockCriticoProducto"
    ).value =
        producto.stockCritico ?? "";


    document.getElementById(
        "categoriaProducto"
    ).value = producto.categoriaId;


    document.getElementById(
        "formatoProducto"
    ).value = producto.formato;


    document.getElementById(
        "anioProducto"
    ).value = producto.anio || "";


    document.getElementById(
        "imagenProducto"
    ).value = producto.imagen || "";


    document.getElementById(
        "estadoProducto"
    ).value = producto.estado;
}


function procesarFormularioProducto(
    codigoOriginal
) {

    const codigo =
        document.getElementById(
            "codigoProducto"
        );

    const nombre =
        document.getElementById(
            "nombreProducto"
        );

    const artista =
        document.getElementById(
            "artistaProducto"
        );

    const descripcion =
        document.getElementById(
            "descripcionProducto"
        );

    const precio =
        document.getElementById(
            "precioProducto"
        );

    const stock =
        document.getElementById(
            "stockProducto"
        );

    const stockCritico =
        document.getElementById(
            "stockCriticoProducto"
        );

    const categoria =
        document.getElementById(
            "categoriaProducto"
        );

    const formato =
        document.getElementById(
            "formatoProducto"
        );

    const anio =
        document.getElementById(
            "anioProducto"
        );

    const imagen =
        document.getElementById(
            "imagenProducto"
        );

    const estado =
        document.getElementById(
            "estadoProducto"
        );


    let esValido = true;


    const codigoNormalizado =
        codigo.value
            .trim()
            .toUpperCase();


    if (
        codigoNormalizado.length >= 3
    ) {
        marcarValido(codigo);
    } else {
        marcarInvalido(codigo);
        esValido = false;
    }


    const codigoDuplicado =
        obtenerProductos().some(
            producto =>
                producto.codigo.toUpperCase()
                    === codigoNormalizado &&
                producto.codigo.toUpperCase()
                    !== (
                        codigoOriginal || ""
                    ).toUpperCase()
        );


    if (codigoDuplicado) {
        marcarInvalido(codigo);
        esValido = false;
    }


    if (
        textoRequerido(
            nombre.value,
            100
        )
    ) {
        marcarValido(nombre);
    } else {
        marcarInvalido(nombre);
        esValido = false;
    }


    if (
        textoRequerido(
            artista.value,
            100
        )
    ) {
        marcarValido(artista);
    } else {
        marcarInvalido(artista);
        esValido = false;
    }


    if (
        descripcion.value.trim().length <= 500
    ) {
        marcarValido(descripcion);
    } else {
        marcarInvalido(descripcion);
        esValido = false;
    }


    if (
        precio.value !== "" &&
        numeroEnRango(
            precio.value,
            0
        )
    ) {
        marcarValido(precio);
    } else {
        marcarInvalido(precio);
        esValido = false;
    }


    if (
        stock.value !== "" &&
        enteroEnRango(
            stock.value,
            0
        )
    ) {
        marcarValido(stock);
    } else {
        marcarInvalido(stock);
        esValido = false;
    }


    if (
        stockCritico.value === "" ||
        enteroEnRango(
            stockCritico.value,
            0
        )
    ) {
        marcarValido(stockCritico);
    } else {
        marcarInvalido(stockCritico);
        esValido = false;
    }


    if (categoria.value) {
        marcarValido(categoria);
    } else {
        marcarInvalido(categoria);
        esValido = false;
    }


    if (formato.value) {
        marcarValido(formato);
    } else {
        marcarInvalido(formato);
        esValido = false;
    }


    if (
        anio.value === "" ||
        (
            Number.isInteger(
                Number(anio.value)
            ) &&
            Number(anio.value) > 0
        )
    ) {
        marcarValido(anio);
    } else {
        marcarInvalido(anio);
        esValido = false;
    }


    if (!esValido) {
        alert(
            "Revisa los datos del producto."
        );

        return;
    }


    const producto = {
        codigo: codigoNormalizado,

        nombre:
            nombre.value.trim(),

        artista:
            artista.value.trim(),

        descripcion:
            descripcion.value.trim(),

        precio:
            Number(precio.value),

        stock:
            Number(stock.value),

        stockCritico:
            stockCritico.value === ""
                ? null
                : Number(
                    stockCritico.value
                ),

        categoriaId:
            Number(categoria.value),

        formato:
            formato.value,

        anio:
            anio.value === ""
                ? ""
                : Number(anio.value),

        imagen:
            imagen.value.trim()
            || "audifonos.png",

        estado:
            estado.value
    };


    guardarProducto(producto);


    if (
        producto.stockCritico !== null &&
        producto.stock <=
            producto.stockCritico
    ) {
        alert(
            "Producto guardado correctamente. El producto está en stock crítico."
        );
    } else {
        alert(
            "Producto guardado correctamente."
        );
    }


    window.location.href =
        "/admin/productos";
}


function inicializarFormularioProducto() {

    const formulario =
        document.getElementById(
            "formProducto"
        );

    if (!formulario) {
        return;
    }


    cargarCategoriasProducto();


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const codigoOriginal =
        parametros.get("codigo");


    if (codigoOriginal) {

        const producto =
            obtenerProductoPorCodigo(
                codigoOriginal
            );


        if (!producto) {
            alert(
                "Producto no encontrado."
            );

            window.location.href =
                "/admin/productos";

            return;
        }


        cargarProductoEnFormulario(
            producto
        );
    }


    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            procesarFormularioProducto(
                codigoOriginal
            );
        }
    );
}


// INICIO

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const contenedorProductos =
            document.getElementById(
                "contenedorProductos"
            );


        if (contenedorProductos) {

            cargarCategorias();

            mostrarProductos(
                obtenerProductos()
            );


            document
                .getElementById(
                    "buscarProducto"
                )
                .addEventListener(
                    "input",
                    filtrarProductos
                );


            document
                .getElementById(
                    "filtroCategoria"
                )
                .addEventListener(
                    "change",
                    filtrarProductos
                );
        }


        mostrarProductosAdministrador();

        inicializarFormularioProducto();

    }
);
