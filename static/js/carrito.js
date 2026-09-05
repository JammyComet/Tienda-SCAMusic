function obtenerCarrito() {
    return obtenerColeccion(COLO_KEYS.carrito);
}

function guardarCarrito() {
    return guardarColeccion(COLO_KEYS.carrito);
}

function agregarAlCarrito(codigoProducto){
    const productos =
        obtenerColeccion(COLO_KEYS.producto);
    
    const producto =
        productos.find(
            producto =>
                producto.codigo = codigoProducto
        );
    
    if (!producto){
        alert(
            "El producto no existe"
        );
    }

    if (producto.stock <= 0){
        alert(
            "Este producto no tiene stock"
        );

        return;
    }

    const carrito =
        obtenerCarrito();

    const productoEnCarrito =
        carrito.find(
            item =>
                item.codigo === codigoProducto
        );
    
    if (productoEnCarrito){
        if(
            productoEnCarrito.cantidad >=
            producto.stock
        ){
            alert(
                "no hay mas stock disponible"
            );
            return
        }
        productoEnCarrito.cantidad++;
    }else{
        carrito.push({
            codigo: producto.codigo,
            cantidad:1
        });
    }

    guardarCarrito(carrito);
    alert(
        "Producto agregado al carrito"
    );
}

function eliminarDelCarrito(codigoProducto) {
    let carrito =
        obtenerCarrito();

    carrito =
        carrito.filter(
            item=>
                item.codigo !== codigoProducto
        );

    guardarCarrito(carrito);

}

function cambiarCantidad(
    codigoProducto,
    nuevaCantidad
){
    const carrito =
        obtenerCarrito();

    const item =
        carrito.find(
            item=>
                item === codigoProducto
        );

    if (!item) {
        return
    }
    
    const productos =
        obtenerColeccion(
            COLO_KEYS.productos
        );
    
    const producto =
        productos.find(
            productos =>
                producto.codigo === codigoProducto
        );
    
    if(!producto){
        return;
    }

    if (nuevaCantidad <= 0){
        eliminarDelCarrito(
            codigoProducto
        );
        return;
    }

    if(
        nuevaCantidad>
        producto.stock
    ){
        alert(
            "No hay suficiente stock"
        );
        return
    }
    item.cantidad =
        nuevaCantidad;
    
    guardarCarrito(
        carrito
    );
    
}

function vaciarCarrito(){
    guardarCarrito([])
}

function obtenerCantidadCarrito (){
    const carrito =
        obtenerCarrito();

    return carrito.reduce(
        function(total, item){
            return total +
                item.cantidad
        }
    )
}
