function obtenerCarrito() {
    return obtenerColeccion(COLO_KEYS.carrito);
}

function guardarCarrito(carrito) {
    guardarColeccion(COLO_KEYS.carrito, carrito);
    actualizarContadorCarrito();
}

function mostrarMensajeCarrito(titulo, icono = "success") {
    if (typeof Swal !== "undefined") {
        Swal.fire({
            title: titulo,
            icon: icono,
            confirmButtonText: "Aceptar"
        });
        return;
    }

    alert(titulo);
}

function agregarAlCarrito(codigoProducto) {
    const producto = obtenerColeccion(COLO_KEYS.productos)
        .find(item => item.codigo === codigoProducto);

    if (!producto) {
        mostrarMensajeCarrito("El producto no existe", "error");
        return;
    }

    if (producto.stock <= 0) {
        mostrarMensajeCarrito("Este producto no tiene stock", "warning");
        return;
    }

    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.codigo === codigoProducto);

    if (item) {
        if (item.cantidad >= producto.stock) {
            mostrarMensajeCarrito("No hay más stock disponible", "warning");
            return;
        }
        item.cantidad++;
    } else {
        carrito.push({ codigo: producto.codigo, cantidad: 1 });
    }

    guardarCarrito(carrito);
    mostrarMensajeCarrito("Producto agregado al carrito");
}

function eliminarDelCarrito(codigoProducto) {
    guardarCarrito(
        obtenerCarrito().filter(item => item.codigo !== codigoProducto)
    );
}

function cambiarCantidad(codigoProducto, nuevaCantidad) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.codigo === codigoProducto);
    if (!item) return false;

    const producto = obtenerColeccion(COLO_KEYS.productos)
        .find(item => item.codigo === codigoProducto);
    if (!producto) return false;

    const cantidad = Number(nuevaCantidad);
    if (!Number.isInteger(cantidad)) return false;

    if (cantidad <= 0) {
        eliminarDelCarrito(codigoProducto);
        return true;
    }

    if (cantidad > producto.stock) {
        mostrarMensajeCarrito("No hay suficiente stock", "warning");
        return false;
    }

    item.cantidad = cantidad;
    guardarCarrito(carrito);
    return true;
}

function vaciarCarrito() {
    guardarCarrito([]);
}

function obtenerCantidadCarrito() {
    return obtenerCarrito().reduce(
        (total, item) => total + Number(item.cantidad || 0),
        0
    );
}

function obtenerDetalleCarrito() {
    const productos = obtenerColeccion(COLO_KEYS.productos);

    return obtenerCarrito()
        .map(item => {
            const producto = productos.find(producto => producto.codigo === item.codigo);
            if (!producto) return null;

            return {
                ...producto,
                cantidad: item.cantidad,
                subtotal: producto.precio * item.cantidad
            };
        })
        .filter(Boolean);
}

function formatearPrecioCarrito(precio) {
    return Number(precio).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    });
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("contadorCarrito");
    if (!contador) return;

    contador.textContent = obtenerCantidadCarrito();
}

function crearFilaCarrito(producto) {
    const fila = document.createElement("article");
    fila.className = "row carrito-producto align-items-center g-3";
    fila.dataset.codigo = producto.codigo;

    fila.innerHTML = `
        <div class="col-4 col-sm-3 text-center">
            <img
                src="/static/imagenes/${producto.imagen}"
                alt="${producto.nombre}"
                class="carrito-producto-img img-fluid"
            >
        </div>

        <div class="col-8 col-sm-9">
            <div class="d-flex flex-column flex-lg-row justify-content-between gap-3">
                <div>
                    <h2 class="h5 mb-1">${producto.nombre}</h2>
                    <p class="text-secondary mb-1">${producto.artista || ""}</p>
                    <p class="small text-secondary mb-0">Stock disponible: ${producto.stock}</p>
                </div>

                <div class="d-flex flex-column align-items-start align-items-lg-end gap-2">
                    <span class="fw-bold">${formatearPrecioCarrito(producto.subtotal)}</span>

                    <div class="input-group input-group-sm carrito-cantidad">
                        <button
                            type="button"
                            class="btn btn-outline-dark btn-restar"
                            aria-label="Restar una unidad">
                            −
                        </button>

                        <input
                            type="number"
                            class="form-control text-center input-cantidad"
                            min="1"
                            max="${producto.stock}"
                            value="${producto.cantidad}"
                            aria-label="Cantidad de ${producto.nombre}">

                        <button
                            type="button"
                            class="btn btn-outline-dark btn-sumar"
                            aria-label="Sumar una unidad">
                            +
                        </button>
                    </div>

                    <button type="button" class="btn btn-sm btn-link text-danger p-0 btn-eliminar">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    `;

    fila.querySelector(".btn-restar").addEventListener("click", () => {
        cambiarCantidad(producto.codigo, producto.cantidad - 1);
        renderizarCarrito();
    });

    fila.querySelector(".btn-sumar").addEventListener("click", () => {
        const cambiado = cambiarCantidad(producto.codigo, producto.cantidad + 1);
        if (cambiado) renderizarCarrito();
    });

    fila.querySelector(".input-cantidad").addEventListener("change", event => {
        const cambiado = cambiarCantidad(producto.codigo, Number(event.target.value));
        renderizarCarrito();

        if (!cambiado) {
            event.target.value = producto.cantidad;
        }
    });

    fila.querySelector(".btn-eliminar").addEventListener("click", () => {
        eliminarDelCarrito(producto.codigo);
        renderizarCarrito();
    });

    return fila;
}

function validarStockAntesDePagar() {
    const carrito = obtenerCarrito();
    const productos = obtenerColeccion(COLO_KEYS.productos);

    for (const item of carrito) {
        const producto = productos.find(producto => producto.codigo === item.codigo);

        if (!producto) {
            return {
                valido: false,
                mensaje: `El producto ${item.codigo} ya no está disponible.`
            };
        }

        if (producto.estado !== "Activo") {
            return {
                valido: false,
                mensaje: `${producto.nombre} ya no se encuentra activo.`
            };
        }

        if (item.cantidad > producto.stock) {
            return {
                valido: false,
                mensaje: `No hay stock suficiente de ${producto.nombre}. Disponible: ${producto.stock}.`
            };
        }
    }

    return { valido: true };
}

function crearOrdenDesdeCarrito() {
    const validacion = validarStockAntesDePagar();

    if (!validacion.valido) {
        mostrarMensajeCarrito(validacion.mensaje, "warning");
        renderizarCarrito();
        return null;
    }

    const detalle = obtenerDetalleCarrito();
    if (detalle.length === 0) {
        mostrarMensajeCarrito("El carrito está vacío", "warning");
        return null;
    }

    const productos = obtenerColeccion(COLO_KEYS.productos);
    const ordenes = obtenerOrdenes();
    const sesion = obtenerSesion();
    const total = detalle.reduce(
        (suma, producto) => suma + producto.subtotal,
        0
    );

    detalle.forEach(itemCarrito => {
        const producto = productos.find(
            item => item.codigo === itemCarrito.codigo
        );
        producto.stock -= itemCarrito.cantidad;
    });

    const orden = {
        codigo: generarCodigoOrden(ordenes),
        fecha: new Date().toISOString(),
        cliente: {
            nombre: sesion ? obtenerNombreUsuario(sesion) : "Cliente invitado",
            correo: sesion?.correo || "Sin correo"
        },
        productos: detalle.map(producto => ({
            codigo: producto.codigo,
            nombre: producto.nombre,
            artista: producto.artista || "",
            precio: Number(producto.precio),
            cantidad: Number(producto.cantidad),
            subtotal: Number(producto.subtotal)
        })),
        total,
        estado: "Pagada"
    };

    ordenes.push(orden);

    guardarColeccion(COLO_KEYS.productos, productos);
    guardarOrdenes(ordenes);
    vaciarCarrito();

    return orden;
}

function confirmarPago() {
    const detalle = obtenerDetalleCarrito();
    if (detalle.length === 0) return;

    const total = detalle.reduce(
        (suma, producto) => suma + producto.subtotal,
        0
    );

    if (typeof Swal === "undefined") {
        if (!confirm(`¿Confirmar pago por ${formatearPrecioCarrito(total)}?`)) {
            return;
        }

        const orden = crearOrdenDesdeCarrito();
        if (orden) {
            window.location.href = `/pago-exitoso?orden=${encodeURIComponent(orden.codigo)}`;
        }
        return;
    }

    Swal.fire({
        title: "Confirmar compra",
        html: `Total a pagar: <strong>${formatearPrecioCarrito(total)}</strong>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Pagar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {
        if (!resultado.isConfirmed) return;

        const orden = crearOrdenDesdeCarrito();
        if (!orden) return;

        window.location.href = `/pago-exitoso?orden=${encodeURIComponent(orden.codigo)}`;
    });
}

function renderizarCarrito() {
    const contenedor = document.getElementById("contenedorCarrito");
    if (!contenedor) return;

    const detalle = obtenerDetalleCarrito();
    const carritoVacio = document.getElementById("carritoVacio");
    const totalCarrito = document.getElementById("totalCarrito");
    const btnPagar = document.getElementById("btnPagar");
    const btnVaciar = document.getElementById("btnVaciarCarrito");

    contenedor.innerHTML = "";

    detalle.forEach(producto => {
        contenedor.appendChild(crearFilaCarrito(producto));
    });

    const total = detalle.reduce((suma, producto) => suma + producto.subtotal, 0);
    totalCarrito.textContent = formatearPrecioCarrito(total);

    const estaVacio = detalle.length === 0;
    carritoVacio.classList.toggle("d-none", !estaVacio);
    btnPagar.disabled = estaVacio;
    btnVaciar.disabled = estaVacio;

    actualizarContadorCarrito();
}

function inicializarCarrito() {
    actualizarContadorCarrito();

    if (!document.getElementById("contenedorCarrito")) return;

    renderizarCarrito();

    document.getElementById("btnVaciarCarrito")?.addEventListener("click", () => {
        vaciarCarrito();
        renderizarCarrito();
    });

    document.getElementById("btnPagar")?.addEventListener("click", confirmarPago);
}

document.addEventListener("DOMContentLoaded", inicializarCarrito);
