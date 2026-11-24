# SCAMusica — Frontend React

Tienda desarrollada con **React y Vite**, conectada mediante API REST al backend Spring Boot.

## Abrir la tienda

Con Docker, desde la carpeta `SCAMusica-Backend`, ejecuta `.\iniciar.ps1` en PowerShell y abre:

**http://localhost:5173**

Para ejecutar React por separado, con **Node.js y npm** instalados, abre una terminal en `Tienda-SCAMusic-main`:

```powershell
npm install
npm run dev
```

El backend debe estar funcionando para cargar los datos.

## Cuentas de prueba (solo entorno local)

| Rol | Correo | Contraseña demo |
|---|---|---|
| Administrador | `admin@duoc.cl` | `scamusica123` |
| Vendedor | `vendedor@duoc.cl` | `scamusica123` |
| Cliente | `cliente@gmail.com` | `scamusica123` |

Estas son las credenciales que crea **`iniciar.ps1` en un entorno nuevo**, según el script entregado. Si ya existía un `.env` o se cambiaron las contraseñas, podrían ser distintas. Para restablecerlas en un entorno local se puede ejecutar `.\actualizar-claves-demo.ps1` desde la carpeta raíz del backend; esto invalida las sesiones demo previas. **No usar estas credenciales en producción.**

## Pruebas del frontend

Desde `Tienda-SCAMusic-main`, instala primero las dependencias con `npm install`.

**Pruebas de componentes (Karma + Jasmine; necesitan Chrome):**

```powershell
npm test
```

**Pruebas en modo observación:**

```powershell
npm run test:watch
```

**Pruebas adicionales de regresión y validaciones (Node.js):**

```powershell
node test/RegresionStorage.mjs
node test/RegresionCambioContrasena.mjs
node --test tests/validacion-edad.test.mjs
node --experimental-vm-modules scripts/test-storage.mjs
```

Las pruebas de componentes están en `test/*.spec.js`. También existen las pruebas adicionales en `test/`, `tests/` y `scripts/`, con los nombres indicados arriba.

**Compilar el frontend:**

```powershell
npm run build
```

## Archivos principales

- `src/App.jsx`: navegación y rutas.
- `src/components/organisms/ProtectedRoute.jsx`: restricciones por rol.
- `src/context/AuthContext.jsx`: sesión y usuario actual.
- `src/data/storage.js`: llamadas REST al backend, carrito y compras.
