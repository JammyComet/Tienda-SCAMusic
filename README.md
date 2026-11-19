# SCAMusica — React integrado con Spring Boot

Se mantiene la estructura React 19, Vite, Atomic Design, Context API y todas las pantallas del proyecto original. **Los datos ya no se guardan en localStorage**: los productos, categorías, usuarios, carritos, compras, boletas, reportes, inventario y contactos se cargan/escriben mediante `fetch` hacia el Gateway de Spring Boot.

## Inicio

1. Instala y ejecuta el backend en `../musica-parent` según su `README.md` (MySQL, Eureka, Gateway y los microservicios requeridos). El frontend **no** utiliza los datos ficticios si Spring Boot está apagado.
   El backend de esta versión contiene **6 microservicios de negocio**, además de Eureka y el Gateway.
2. Abre esta carpeta y ejecuta `npm install` y `npm run dev`.
3. Abre `http://localhost:5173` (puerto Vite predeterminado).
4. Si el Gateway está en otro host, configura `VITE_API_URL` con su URL (por defecto `http://localhost:8080`).

## Acceso de demostración (servidor ms-auth)

- Administrador: `admin@duoc.cl`
- Vendedor: `vendedor@duoc.cl`
- Cliente: `cliente@gmail.com`

**No tienen contraseñas públicas predeterminadas.** El backend las crea solo cuando se configura
`SEED_DEMO_USERS=true` junto con `DEMO_ADMIN_PASSWORD`, `DEMO_VENDEDOR_PASSWORD` y
`DEMO_CLIENTE_PASSWORD` (al menos 8 caracteres cada una). La configuración local se encuentra en el archivo `.env` generado por `iniciar.ps1`.
Las contraseñas se almacenan mediante BCrypt en MySQL.

## Sesión y permisos

El login solicita `/api/v1/auth/login` y recibe JWT de **5 minutos**; el perfil se obtiene de
`/api/v1/usuarios/me`. React mantiene el JWT solo en **memoria** y lo renueva automáticamente usando
una cookie `HttpOnly` que recibe del backend y que el código React no puede leer. Así se conserva la sesión
tras recargas, sin almacenar contraseñas ni tokens en LocalStorage/SessionStorage. El vendedor solo ve productos y órdenes, el cliente utiliza la tienda, el administrador gestiona el sistema. Spring Boot valida permisos además del frontend.

El carrito del invitado conserva **solo códigos y cantidades** en `sessionStorage` de esa pestaña:
permanece después de F5 y se fusiona con `ms-carrito` al iniciar sesión como cliente.
No se guardan tokens ni datos personales allí. Al cerrar la pestaña, el carrito de invitado puede perderse.

Al enviar una compra, React utiliza una cabecera `Idempotency-Key` única. Si falla la red
antes de confirmar el resultado, conserva la clave de ese intento (no los datos del cliente)
para poder reintentarlo sin registrar dos veces el mismo pedido.

## Pruebas

`node --experimental-vm-modules test/test-storage.mjs` comprueba persistencia del carrito invitado y reintentos idempotentes. `npm test` utiliza las pruebas existentes en `test/`, adaptadas en formularios al flujo HTTP. También hay pruebas JUnit del JWT y del catálogo en los microservicios. En el entorno de generación no fue posible descargar todas las dependencias para ejecutar la compilación completa de Vite/Maven: ejecutar ambos builds y probar contra MySQL antes de la entrega.

## Correspondencia con los microservicios

| Función que ya existía en React | Servicio backend |
|---|---|
| Login, registro y perfil | `ms-auth` |
| Administración de usuarios | `ms-auth` |
| Productos y ofertas | `ms-catalogo` |
| Categorías | `ms-categorias` |
| Carrito | `ms-carrito` |
| Compras y órdenes | `ms-pedido` |
| Mis boletas y boletas del administrador | `ms-pedido` |
| Formulario de contacto | `ms-auth` |
| Stock crítico del administrador | `ms-catalogo` |
| Resumen de ventas y dashboard | `ms-reportes` |

Blog y Nosotros mantienen su contenido estático porque no tenían operaciones de negocio que
justificaran añadir bases de datos o servicios nuevos. Se conservaron todos los componentes,
estilos y rutas visuales. El archivo `src/data/storage.js` mantiene el nombre original únicamente
para no romper las importaciones existentes, pero ahora funciona como adaptador de API REST.

## Ejecutar el frontend con Docker

Desde la carpeta raíz del paquete completo, usa `iniciar.ps1` o
`docker compose up --build -d`. React queda disponible en `http://localhost:5173`.
Nginx reenvía las peticiones `/api/...` a Spring Boot. La configuración Docker
usa `VITE_API_URL` vacío de manera intencional; no es necesario editar el código.
Fuera de Docker, `npm run dev` sigue apuntando al Gateway local en `:8080`.
