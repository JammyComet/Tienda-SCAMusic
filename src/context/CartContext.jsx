import { createContext, useEffect, useMemo, useState } from "react";
import { generarCodigoOrden, generarNumeroBoleta, guardarCarrito, guardarColeccion, guardarOrden, obtenerCarrito, obtenerProductos, STORAGE_KEYS, obtenerNombreUsuario } from "../data/storage";
import { useAuth } from "../hooks/useAuth";
import { precioConDescuento } from "../utils/format";
import { REGIONES } from "../data/regiones";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { usuario } = useAuth();
  const [carrito, setCarrito] = useState(() => obtenerCarrito(usuario));
  const recargar = () => setCarrito(obtenerCarrito(usuario));

  useEffect(recargar, [usuario]);
  useEffect(() => {
    window.addEventListener("scamusic-data", recargar);
    return () => window.removeEventListener("scamusic-data", recargar);
  }, [usuario]);

  function persistir(nuevo) {
    guardarCarrito(nuevo, usuario);
    setCarrito(nuevo);
  }

  function agregar(codigo) {
    const producto = obtenerProductos().find((item) => item.codigo === codigo);
    if (!producto || producto.estado !== "Activo") return { ok: false, mensaje: "El producto no está disponible." };
    if (producto.stock <= 0) return { ok: false, mensaje: "Este producto no tiene stock." };
    const nuevo = carrito.map((item) => ({ ...item }));
    const existente = nuevo.find((item) => item.codigo === codigo);
    if (existente) {
      if (existente.cantidad >= producto.stock) return { ok: false, mensaje: "No hay más stock disponible." };
      existente.cantidad += 1;
    } else {
      nuevo.push({ codigo, cantidad: 1 });
    }
    persistir(nuevo);
    return { ok: true };
  }

  function cambiarCantidad(codigo, cantidad) {
    const producto = obtenerProductos().find((item) => item.codigo === codigo);
    const nuevo = carrito.map((item) => ({ ...item }));
    const item = nuevo.find((actual) => actual.codigo === codigo);
    if (!producto || !item) return false;
    const nuevaCantidad = Number(cantidad);
    if (nuevaCantidad <= 0) {
      persistir(nuevo.filter((actual) => actual.codigo !== codigo));
      return true;
    }
    if (!Number.isInteger(nuevaCantidad) || nuevaCantidad > producto.stock) return false;
    item.cantidad = nuevaCantidad;
    persistir(nuevo);
    return true;
  }

  const eliminar = (codigo) => persistir(carrito.filter((item) => item.codigo !== codigo));
  const vaciar = () => persistir([]);

  const items = useMemo(() => carrito.map((item) => {
    const producto = obtenerProductos().find((actual) => actual.codigo === item.codigo);
    if (!producto) return null;
    const precioOriginal = Number(producto.precio);
    const precio = precioConDescuento(producto);
    return { ...producto, precioOriginal, precio, cantidad: item.cantidad, subtotal: precio * item.cantidad };
  }).filter(Boolean), [carrito]);

  const total = items.reduce((suma, producto) => suma + producto.subtotal, 0);
  const totalItems = items.reduce((suma, producto) => suma + producto.cantidad, 0);

  function finalizarCompra(entrega = {}) {
    if (!usuario) return { ok: false, requiereLogin: true };
    const regionEntrega = String(entrega.region || usuario.region || "").trim();
    const comunaEntrega = String(entrega.comuna || usuario.comuna || "").trim();
    const direccionEntrega = String(entrega.direccion || usuario.direccion || "").trim();
    if (!regionEntrega || !comunaEntrega || !direccionEntrega) return { ok: false, mensaje: "Completa la dirección de entrega." };
    if (!REGIONES[regionEntrega]?.includes(comunaEntrega)) return { ok: false, mensaje: "La comuna seleccionada no corresponde a la región indicada." };
    const productos = obtenerProductos();
    for (const item of carrito) {
      const producto = productos.find((actual) => actual.codigo === item.codigo);
      if (!producto || producto.estado !== "Activo" || item.cantidad > producto.stock) {
        return { ok: false, mensaje: `Stock insuficiente o producto no disponible: ${producto?.nombre || item.codigo}.` };
      }
    }
    const detalle = items;
    if (!detalle.length) return { ok: false, mensaje: "El carrito está vacío." };

    detalle.forEach((item) => {
      productos.find((producto) => producto.codigo === item.codigo).stock -= item.cantidad;
    });
    guardarColeccion(STORAGE_KEYS.productos, productos);

    const orden = {
      codigo: generarCodigoOrden(),
      boletaNumero: generarNumeroBoleta(),
      fecha: new Date().toISOString(),
      cliente: {
        run: usuario.run || "",
        nombre: obtenerNombreUsuario(usuario),
        correo: usuario.correo,
        telefono: usuario.telefono || "",
        region: regionEntrega,
        comuna: comunaEntrega,
        direccion: direccionEntrega,
      },
      entrega: {
        region: regionEntrega,
        comuna: comunaEntrega,
        direccion: direccionEntrega,
      },
      productos: detalle.map((producto) => ({
        codigo: producto.codigo,
        nombre: producto.nombre,
        artista: producto.artista || "",
        precioOriginal: Number(producto.precioOriginal),
        descuento: Number(producto.descuento || 0),
        precio: Number(producto.precio),
        cantidad: Number(producto.cantidad),
        subtotal: Number(producto.subtotal),
      })),
      total,
      estado: "Pagada",
    };

    guardarOrden(orden);
    vaciar();
    return { ok: true, orden };
  }

  return <CartContext.Provider value={{ items, total, totalItems, agregar, cambiarCantidad, eliminar, vaciar, finalizarCompra }}>{children}</CartContext.Provider>;
}
