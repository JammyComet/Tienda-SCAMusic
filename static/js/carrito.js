function obtenerCarrito() {
    return obtenerColeccion(COLO_KEYS.carrito);
}


function guardarCarrito(carrito) {
    guardarColeccion(
        COLO_KEYS.carrito,
        carrito
    );
}


function agregarAlCarrito(codigoProducto) {
    const productos =
        obtenerColeccion(COLO_KEYS.productos);

    const producto =
        productos.find(
            producto =>
                producto.codigo === codigoProducto
        );

    if (!producto) {
        alert("El producto no existe");
        return;
    }

    if (producto.stock <= 0) {
        alert("Este producto no tiene stock");
        return;
    }

    const carrito =
        obtenerCarrito();

    const productoEnCarrito =
        carrito.find(
            item =>
                item.codigo === codigoProducto
        );

    if (productoEnCarrito) {
        if (
            productoEnCarrito.cantidad >=
            producto.stock
        ) {
            alert("No hay más stock disponible");
            return;
        }

        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            codigo: producto.codigo,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    alert("Producto agregado al carrito");
}


function eliminarDelCarrito(codigoProducto) {
    let carrito =
        obtenerCarrito();

    carrito =
        carrito.filter(
            item =>
                item.codigo !== codigoProducto
        );

    guardarCarrito(carrito);
}


function cambiarCantidad(
    codigoProducto,
    nuevaCantidad
) {
    const carrito =
        obtenerCarrito();

    const item =
        carrito.find(
            item =>
                item.codigo === codigoProducto
        );

    if (!item) {
        return;
    }

    const productos =
        obtenerColeccion(
            COLO_KEYS.productos
        );

    const producto =
        productos.find(
            producto =>
                producto.codigo === codigoProducto
        );

    if (!producto) {
        return;
    }

    const cantidad =
        Number(nuevaCantidad);

    if (!Number.isInteger(cantidad)) {
        return;
    }

    if (cantidad <= 0) {
        eliminarDelCarrito(
            codigoProducto
        );
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
    const carrito =
        obtenerCarrito();

    return carrito.reduce(
        function (total, item) {
            return total + Number(item.cantidad || 0);
        },
        0
    );
}


function obtenerDetalleCarrito() {
    const carrito =
        obtenerCarrito();

    const productos =
        obtenerColeccion(COLO_KEYS.productos);

    return carrito
        .map(function (item) {
            const producto =
                productos.find(
                    producto =>
                        producto.codigo === item.codigo
                );

            if (!producto) {
                return null;
            }

            return {
                ...producto,
                cantidad: item.cantidad,
                subtotal: producto.precio * item.cantidad
            };
        })
        .filter(
            producto => producto !== null
        );
}
