# SCAMusica

Proyecto de tienda musical con Flask, Bootstrap, JavaScript y localStorage.

## Usuarios de prueba

- Administrador: `admin@duoc.cl` / `1234`
- Cliente: `cliente@gmail.com` / `12345`
- Vendedor: `vendedor@duoc.cl` / `123456`

## Flujo de compra

1. Agregar productos al carrito.
2. Cambiar cantidades sin superar el stock.
3. Presionar **PAGAR** y confirmar la compra.
4. El sistema vuelve a validar el stock, registra una orden en localStorage, descuenta el stock, vacía el carrito y muestra la vista de pago exitoso.
5. Las órdenes quedan disponibles para consulta en la vista del Vendedor.

## Rol Vendedor

El vendedor tiene una vista independiente y solo dispone de:

- Listado de productos.
- Detalle de productos.
- Listado de órdenes.
- Detalle de órdenes.

No tiene enlaces de creación, edición o eliminación de productos/usuarios.
