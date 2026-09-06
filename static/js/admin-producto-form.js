function guardarProducto(producto) {
    const productos = obtenerProductos();
    const indice = productos.findIndex(item => item.codigo === producto.codigo);

    if (indice === -1) {
        productos.push(producto);
    } else {
        productos[indice] = producto;
    }

    guardarColeccion(COLO_KEYS.productos, productos);
}

function cargarCategoriasFormulario() {
    const select = document.getElementById("categoriaProducto");
    if (!select) return;

    obtenerColeccion(COLO_KEYS.categorias).forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;
        select.appendChild(opcion);
    });
}

function cargarProductoEnFormulario(producto) {
    document.getElementById("tituloFormularioProducto").textContent = "Editar producto";

    const codigo = document.getElementById("codigoProducto");
    codigo.value = producto.codigo;
    codigo.readOnly = true;

    document.getElementById("nombreProducto").value = producto.nombre;
    document.getElementById("artistaProducto").value = producto.artista;
    document.getElementById("descripcionProducto").value = producto.descripcion || "";
    document.getElementById("precioProducto").value = producto.precio;
    document.getElementById("stockProducto").value = producto.stock;
    document.getElementById("stockCriticoProducto").value = producto.stockCritico ?? "";
    document.getElementById("categoriaProducto").value = producto.categoriaId;
    document.getElementById("formatoProducto").value = producto.formato;
    document.getElementById("anioProducto").value = producto.anio || "";
    document.getElementById("imagenProducto").value = producto.imagen || "";
    document.getElementById("estadoProducto").value = producto.estado;
}

function validarCampo(input, condicion) {
    if (condicion) {
        marcarValido(input);
        return true;
    }

    marcarInvalido(input);
    return false;
}

function procesarFormularioProducto(codigoOriginal) {
    const codigo = document.getElementById("codigoProducto");
    const nombre = document.getElementById("nombreProducto");
    const artista = document.getElementById("artistaProducto");
    const descripcion = document.getElementById("descripcionProducto");
    const precio = document.getElementById("precioProducto");
    const stock = document.getElementById("stockProducto");
    const stockCritico = document.getElementById("stockCriticoProducto");
    const categoria = document.getElementById("categoriaProducto");
    const formato = document.getElementById("formatoProducto");
    const anio = document.getElementById("anioProducto");
    const imagen = document.getElementById("imagenProducto");
    const estado = document.getElementById("estadoProducto");

    const codigoNormalizado = codigo.value.trim().toUpperCase();
    const codigoDuplicado = obtenerProductos().some(producto =>
        producto.codigo.toUpperCase() === codigoNormalizado &&
        producto.codigo.toUpperCase() !== (codigoOriginal || "").toUpperCase()
    );

    let esValido = true;

    esValido = validarCampo(
        codigo,
        codigoNormalizado.length >= 3 && !codigoDuplicado
    ) && esValido;

    esValido = validarCampo(nombre, textoRequerido(nombre.value, 100)) && esValido;
    esValido = validarCampo(artista, textoRequerido(artista.value, 100)) && esValido;
    esValido = validarCampo(descripcion, descripcion.value.trim().length <= 500) && esValido;
    esValido = validarCampo(
        precio,
        precio.value !== "" && numeroEnRango(precio.value, 0)
    ) && esValido;
    esValido = validarCampo(
        stock,
        stock.value !== "" && enteroEnRango(stock.value, 0)
    ) && esValido;
    esValido = validarCampo(
        stockCritico,
        stockCritico.value === "" || enteroEnRango(stockCritico.value, 0)
    ) && esValido;
    esValido = validarCampo(categoria, categoria.value !== "") && esValido;
    esValido = validarCampo(formato, formato.value !== "") && esValido;
    esValido = validarCampo(
        anio,
        anio.value === "" ||
        (Number.isInteger(Number(anio.value)) && Number(anio.value) > 0)
    ) && esValido;

    if (!esValido) {
        alert("Revisa los datos del producto.");
        return;
    }

    const producto = {
        codigo: codigoNormalizado,
        nombre: nombre.value.trim(),
        artista: artista.value.trim(),
        descripcion: descripcion.value.trim(),
        precio: Number(precio.value),
        stock: Number(stock.value),
        stockCritico: stockCritico.value === "" ? null : Number(stockCritico.value),
        categoriaId: Number(categoria.value),
        formato: formato.value,
        anio: anio.value === "" ? "" : Number(anio.value),
        imagen: imagen.value.trim() || "audifonos.png",
        estado: estado.value
    };

    guardarProducto(producto);

    const mensaje =
        producto.stockCritico !== null && producto.stock <= producto.stockCritico
            ? "Producto guardado correctamente. El producto está en stock crítico."
            : "Producto guardado correctamente.";

    alert(mensaje);
    window.location.href = "/admin/productos";
}

function inicializarFormularioProducto() {
    const formulario = document.getElementById("formProducto");
    if (!formulario) return;

    cargarCategoriasFormulario();

    const codigoOriginal = new URLSearchParams(window.location.search).get("codigo");

    if (codigoOriginal) {
        const producto = obtenerProductoPorCodigo(codigoOriginal);

        if (!producto) {
            alert("Producto no encontrado.");
            window.location.href = "/admin/productos";
            return;
        }

        cargarProductoEnFormulario(producto);
    }

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();
        procesarFormularioProducto(codigoOriginal);
    });
}

document.addEventListener("DOMContentLoaded", inicializarFormularioProducto);
