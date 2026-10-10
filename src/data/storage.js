import { CATEGORIAS_INICIALES } from "./categorias";
import { PRODUCTOS_INICIALES } from "./productos";
import { USUARIOS_INICIALES } from "./usuarios";

export const STORAGE_KEYS = {
  usuarios: "scamusic_atomic_usuarios",
  usuariosInicialesVersion: "scamusic_atomic_usuarios_iniciales_version",
  productos: "scamusic_atomic_productos",
  productosInicialesVersion: "scamusic_atomic_productos_iniciales_version",
  categorias: "scamusic_atomic_categorias",
  carrito: "scamusic_atomic_carrito",
  contactos: "scamusic_atomic_contactos",
  ordenes: "scamusic_atomic_ordenes",
  ordenesVersion: "scamusic_atomic_ordenes_version",
  sesion: "scamusic_atomic_sesion",
};

const PRODUCTOS_INICIALES_VERSION = "2";
const USUARIOS_INICIALES_VERSION = "2";
const ORDENES_VERSION = "3";

function emitirCambio() {
  window.dispatchEvent(new Event("scamusic-data"));
}

export function obtenerColeccion(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || [];
  } catch {
    return [];
  }
}

export function guardarColeccion(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
  emitirCambio();
}

function migrarUsuariosIniciales() {
  const usuarios = obtenerColeccion(STORAGE_KEYS.usuarios);
  let cambio = false;
  USUARIOS_INICIALES.forEach((base) => {
    const indice = usuarios.findIndex((usuario) => usuario.correo === base.correo);
    if (indice < 0) {
      usuarios.push(base);
      cambio = true;
      return;
    }
    const actual = usuarios[indice];
    const actualizado = { ...actual };
    Object.entries(base).forEach(([clave, valor]) => {
      if (actualizado[clave] === undefined || actualizado[clave] === null || actualizado[clave] === "") actualizado[clave] = valor;
    });
    if (JSON.stringify(actualizado) !== JSON.stringify(actual)) {
      usuarios[indice] = actualizado;
      cambio = true;
    }
  });
  if (cambio) guardarColeccion(STORAGE_KEYS.usuarios, usuarios);
  localStorage.setItem(STORAGE_KEYS.usuariosInicialesVersion, USUARIOS_INICIALES_VERSION);
}

function migrarOrdenes() {
  const ordenes = obtenerColeccion(STORAGE_KEYS.ordenes);
  let siguiente = 1;
  let cambio = false;
  ordenes.forEach((orden) => {
    const numeroActual = Number(String(orden.boletaNumero || "").replace("BOL-", ""));
    if (numeroActual >= siguiente) siguiente = numeroActual + 1;
  });
  ordenes.forEach((orden) => {
    if (!orden.boletaNumero && orden.estado === "Pagada") {
      orden.boletaNumero = `BOL-${String(siguiente).padStart(4, "0")}`;
      siguiente += 1;
      cambio = true;
    }
    if (orden.cliente?.correo) {
      const usuario = obtenerUsuarios().find((item) => item.correo === orden.cliente.correo);
      if (usuario) {
        const clienteCompleto = {
          run: orden.cliente.run || usuario.run || "",
          nombre: orden.cliente.nombre || obtenerNombreUsuario(usuario),
          correo: orden.cliente.correo,
          telefono: orden.cliente.telefono || usuario.telefono || "",
          region: orden.cliente.region || usuario.region || "",
          comuna: orden.cliente.comuna || usuario.comuna || "",
          direccion: orden.cliente.direccion || usuario.direccion || "",
        };
        if (JSON.stringify(clienteCompleto) !== JSON.stringify(orden.cliente)) {
          orden.cliente = clienteCompleto;
          cambio = true;
        }
        if (!orden.entrega) {
          orden.entrega = {
            region: clienteCompleto.region,
            comuna: clienteCompleto.comuna,
            direccion: clienteCompleto.direccion,
          };
          cambio = true;
        }
      }
    }
  });
  if (cambio) guardarColeccion(STORAGE_KEYS.ordenes, ordenes);
  localStorage.setItem(STORAGE_KEYS.ordenesVersion, ORDENES_VERSION);
}

export function inicializarDatos() {
  if (!localStorage.getItem(STORAGE_KEYS.usuarios)) guardarColeccion(STORAGE_KEYS.usuarios, USUARIOS_INICIALES);
  if (localStorage.getItem(STORAGE_KEYS.usuariosInicialesVersion) !== USUARIOS_INICIALES_VERSION) migrarUsuariosIniciales();
  if (!localStorage.getItem(STORAGE_KEYS.categorias)) guardarColeccion(STORAGE_KEYS.categorias, CATEGORIAS_INICIALES);
  if (!localStorage.getItem(STORAGE_KEYS.productos)) {
    guardarColeccion(STORAGE_KEYS.productos, PRODUCTOS_INICIALES);
    localStorage.setItem(STORAGE_KEYS.productosInicialesVersion, PRODUCTOS_INICIALES_VERSION);
  } else if (localStorage.getItem(STORAGE_KEYS.productosInicialesVersion) !== PRODUCTOS_INICIALES_VERSION) {
    const productos = obtenerProductos();
    const codigosExistentes = new Set(productos.map((producto) => producto.codigo));
    const productosNuevos = PRODUCTOS_INICIALES.filter((producto) => !codigosExistentes.has(producto.codigo));
    if (productosNuevos.length) guardarColeccion(STORAGE_KEYS.productos, [...productos, ...productosNuevos]);
    localStorage.setItem(STORAGE_KEYS.productosInicialesVersion, PRODUCTOS_INICIALES_VERSION);
  }
  if (!localStorage.getItem(STORAGE_KEYS.contactos)) guardarColeccion(STORAGE_KEYS.contactos, []);
  if (!localStorage.getItem(STORAGE_KEYS.ordenes)) guardarColeccion(STORAGE_KEYS.ordenes, []);
  if (localStorage.getItem(STORAGE_KEYS.ordenesVersion) !== ORDENES_VERSION) migrarOrdenes();
}

export function obtenerNombreUsuario(usuario) {
  const completo = [usuario?.nombre, usuario?.apellidos].filter(Boolean).join(" ").trim();
  if (completo) return completo;
  const base = usuario?.correo?.split("@")[0] || "Usuario";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export const obtenerUsuarios = () => obtenerColeccion(STORAGE_KEYS.usuarios);
export const obtenerProductos = () => obtenerColeccion(STORAGE_KEYS.productos);
export const obtenerCategorias = () => obtenerColeccion(STORAGE_KEYS.categorias);
export const obtenerOrdenes = () => obtenerColeccion(STORAGE_KEYS.ordenes);
export const obtenerBoletas = () => obtenerOrdenes().filter((orden) => orden.estado === "Pagada" && orden.boletaNumero);

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.sesion)) || null;
  } catch {
    return null;
  }
}

export function guardarSesion(usuario) {
  localStorage.setItem(STORAGE_KEYS.sesion, JSON.stringify(usuario));
  emitirCambio();
}

export function cerrarSesion() {
  localStorage.removeItem(STORAGE_KEYS.sesion);
  emitirCambio();
}

export function buscarUsuario(correo, contrasena) {
  return obtenerUsuarios().find((usuario) => usuario.correo === correo && usuario.contrasena === contrasena);
}

export function existeCorreo(correo, ignorar = null) {
  return obtenerUsuarios().some((usuario) => usuario.correo === correo && usuario.correo !== ignorar);
}

export function existeRun(run, ignorar = null) {
  const actual = String(run || "").trim();
  const omitido = String(ignorar || "").trim();
  return Boolean(actual) && obtenerUsuarios().some((usuario) => String(usuario.run || "").trim() === actual && String(usuario.run || "").trim() !== omitido);
}

export function guardarUsuario(usuario, correoOriginal = null) {
  const usuarios = obtenerUsuarios();
  if (correoOriginal) {
    const indice = usuarios.findIndex((item) => item.correo === correoOriginal);
    if (indice < 0) return false;
    usuarios[indice] = usuario;
  } else {
    usuarios.push(usuario);
  }
  guardarColeccion(STORAGE_KEYS.usuarios, usuarios);
  const sesion = obtenerSesion();
  if (sesion?.correo === correoOriginal) guardarSesion(usuario);
  return true;
}

export function eliminarUsuario(correo) {
  guardarColeccion(STORAGE_KEYS.usuarios, obtenerUsuarios().filter((usuario) => usuario.correo !== correo));
}

export function guardarProducto(producto, codigoOriginal = null) {
  const productos = obtenerProductos();
  if (codigoOriginal) {
    const indice = productos.findIndex((item) => item.codigo === codigoOriginal);
    if (indice < 0) return false;
    productos[indice] = producto;
  } else {
    productos.push(producto);
  }
  guardarColeccion(STORAGE_KEYS.productos, productos);
  return true;
}

export function eliminarProducto(codigo) {
  guardarColeccion(STORAGE_KEYS.productos, obtenerProductos().filter((producto) => producto.codigo !== codigo));
}

export function obtenerProductoPorCodigo(codigo) {
  return obtenerProductos().find((producto) => producto.codigo === codigo);
}

export function obtenerNombreCategoria(id) {
  return obtenerCategorias().find((categoria) => categoria.id === Number(id))?.nombre || "Sin categoría";
}

export function guardarContacto(mensaje) {
  guardarColeccion(STORAGE_KEYS.contactos, [...obtenerColeccion(STORAGE_KEYS.contactos), mensaje]);
}

export function guardarOrden(orden) {
  guardarColeccion(STORAGE_KEYS.ordenes, [...obtenerOrdenes(), orden]);
}

export function generarCodigoOrden() {
  const numeros = obtenerOrdenes().map((orden) => Number(String(orden.codigo || "").replace("ORD-", "")) || 0);
  return `ORD-${String(Math.max(0, ...numeros) + 1).padStart(4, "0")}`;
}

export function generarNumeroBoleta() {
  const numeros = obtenerBoletas().map((orden) => Number(String(orden.boletaNumero || "").replace("BOL-", "")) || 0);
  return `BOL-${String(Math.max(0, ...numeros) + 1).padStart(4, "0")}`;
}

export function obtenerOrdenPorCodigo(codigo) {
  return obtenerOrdenes().find((orden) => orden.codigo === codigo);
}

export function obtenerBoletaPorNumero(numero) {
  return obtenerBoletas().find((orden) => orden.boletaNumero === numero);
}

export function obtenerClaveCarrito(usuario = obtenerSesion()) {
  const correo = usuario?.correo?.trim().toLowerCase();
  return correo ? `${STORAGE_KEYS.carrito}_${encodeURIComponent(correo)}` : `${STORAGE_KEYS.carrito}_invitado`;
}

export function obtenerCarrito(usuario = obtenerSesion()) {
  return obtenerColeccion(obtenerClaveCarrito(usuario));
}

export function guardarCarrito(carrito, usuario = obtenerSesion()) {
  guardarColeccion(obtenerClaveCarrito(usuario), carrito);
}

export function pasarCarritoInvitadoAUsuario(usuario) {
  if (!usuario?.correo) return;
  const invitado = obtenerCarrito(null);
  if (!invitado.length) return;
  const actual = obtenerCarrito(usuario);
  const productos = obtenerProductos();
  const resultado = actual.map((item) => ({ ...item }));
  invitado.forEach((nuevo) => {
    const existente = resultado.find((item) => item.codigo === nuevo.codigo);
    const producto = productos.find((item) => item.codigo === nuevo.codigo);
    if (existente) {
      existente.cantidad = Math.min(Number(existente.cantidad) + Number(nuevo.cantidad), Number(producto?.stock || 9999));
    } else {
      resultado.push({ ...nuevo, cantidad: Math.min(Number(nuevo.cantidad), Number(producto?.stock || 9999)) });
    }
  });
  guardarCarrito(resultado.filter((item) => item.cantidad > 0), usuario);
  localStorage.removeItem(obtenerClaveCarrito(null));
  emitirCambio();
}
