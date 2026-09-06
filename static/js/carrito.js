function obtenerCarrito() {
    return obtenerColeccion(COLO_KEYS.carrito);
}

function guardarCarrito(carrito) {
    guardarColeccion(COLO_KEYS.carrito, carrito);
}

function agregarAlCarrito(codigoProducto) {
    const producto = obtenerColeccion(COLO_KEYS.productos)
        .find(item => item.codigo === codigoProducto);

    if (!producto) {
        alert("El producto no existe");
        return;
    }

    if (producto.stock <= 0) {
        alert("Este producto no tiene stock");
        return;
    }

    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.codigo === codigoProducto);

    if (item) {
        if (item.cantidad >= producto.stock) {
            alert("No hay más stock disponible");
            return;
        }
        item.cantidad++;
    } else {
        carrito.push({ codigo: producto.codigo, cantidad: 1 });
    }

    guardarCarrito(carrito);
    alert("Producto agregado al carrito");
}

function eliminarDelCarrito(codigoProducto) {
    guardarCarrito(
        obtenerCarrito().filter(item => item.codigo !== codigoProducto)
    );
}

function cambiarCantidad(codigoProducto, nuevaCantidad) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.codigo === codigoProducto);
    if (!item) return;

    const producto = obtenerColeccion(COLO_KEYS.productos)
        .find(item => item.codigo === codigoProducto);
    if (!producto) return;

    const cantidad = Number(nuevaCantidad);
    if (!Number.isInteger(cantidad)) return;

    if (cantidad <= 0) {
        eliminarDelCarrito(codigoProducto);
        return;
    }

    if (cantidad > producto.stock) {
        alert("No hay suficiente stock");
        return;
    }

    item.cantidad = cantidad;
    guardarCarrito(carrito);
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
