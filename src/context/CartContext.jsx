import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { guardarCarrito, guardarOrden, obtenerCarrito, obtenerProductos, obtenerNombreUsuario } from '../data/storage';
import { useAuth } from '../hooks/useAuth';
import { precioConDescuento } from '../utils/format';
import { REGIONES } from '../data/regiones';
import Swal from 'sweetalert2';
export const CartContext=createContext(null);
export function CartProvider({children}){
  const {usuario}=useAuth();
  const [carrito,setCarrito]=useState(()=>obtenerCarrito(usuario));
  const carritoActual=useRef(carrito);
  const peticionesPendientes=useRef(0);
  const versionCambio=useRef(0);
  const compraEnCurso=useRef(false);
  const usuarioActualId=useRef(usuario?.id ?? null);
  function actualizarVista(nuevo){carritoActual.current=nuevo;setCarrito(nuevo);}
  useEffect(()=>{
    usuarioActualId.current=usuario?.id ?? null;
    versionCambio.current++;
    peticionesPendientes.current=0;
    actualizarVista(obtenerCarrito(usuario));
  },[usuario]);
  useEffect(()=>{
    const fn=()=>{
      // No reemplazar una actualización optimista reciente por otra anterior
      // mientras el backend todavía recibe los cambios de este usuario.
      if(peticionesPendientes.current===0)actualizarVista(obtenerCarrito(usuario));
    };
    window.addEventListener('scamusic-data',fn);
    return()=>window.removeEventListener('scamusic-data',fn);
  },[usuario]);
  async function persistir(nuevo){
    const idUsuario=usuario?.id ?? null;
    const version=++versionCambio.current;
    peticionesPendientes.current++;
    actualizarVista(nuevo);
    try{await guardarCarrito(nuevo,usuario);}
    catch(e){
      if(idUsuario===usuarioActualId.current){
        if(version===versionCambio.current)actualizarVista(obtenerCarrito(usuario));
        Swal.fire('Error de conexión',e.message,'error');
      }
      throw e;
    } finally {
      if(idUsuario===usuarioActualId.current){
        peticionesPendientes.current=Math.max(0,peticionesPendientes.current-1);
        if(peticionesPendientes.current===0)actualizarVista(obtenerCarrito(usuario));
      }
    }
  }
  function agregar(codigo){
    const producto=obtenerProductos().find(p=>p.codigo===codigo);
    if(!producto || producto.estado!=='Activo')return {ok:false,mensaje:'El producto no está disponible.'};
    if(producto.stock<=0)return {ok:false,mensaje:'Este producto no tiene stock.'};
    const nuevo=carritoActual.current.map(i=>({...i}));const existente=nuevo.find(i=>i.codigo===codigo);
    if(existente){if(existente.cantidad>=producto.stock)return {ok:false,mensaje:'No hay más stock disponible.'};existente.cantidad++;}
    else nuevo.push({codigo,cantidad:1});
    void persistir(nuevo).catch(()=>{});return {ok:true};
  }
  function cambiarCantidad(codigo,cantidad){
    const p=obtenerProductos().find(x=>x.codigo===codigo),nuevo=carritoActual.current.map(x=>({...x}));
    const item=nuevo.find(x=>x.codigo===codigo);if(!p||!item)return false;
    const n=Number(cantidad);if(n<=0){void persistir(nuevo.filter(x=>x.codigo!==codigo)).catch(()=>{});return true;}
    if(!Number.isInteger(n)||n>p.stock)return false;
    item.cantidad=n;void persistir(nuevo).catch(()=>{});return true;
  }
  const eliminar=codigo=>{void persistir(carritoActual.current.filter(i=>i.codigo!==codigo)).catch(()=>{});};
  const vaciar=()=>persistir([]);
  const items=useMemo(()=>carrito.map(i=>{
    const p=obtenerProductos().find(x=>x.codigo===i.codigo);if(!p)return null;
    const precioOriginal=Number(p.precio),precio=precioConDescuento(p);
    return {...p,precioOriginal,precio,cantidad:i.cantidad,subtotal:precio*i.cantidad};
  }).filter(Boolean),[carrito]);
  const total=items.reduce((s,p)=>s+p.subtotal,0);
  const totalItems=items.reduce((s,p)=>s+p.cantidad,0);
  async function finalizarCompra(entrega={}){
    if(compraEnCurso.current)return {ok:false,mensaje:'Ya estamos procesando tu compra.'};
    if(!usuario)return {ok:false,requiereLogin:true};
    const region=String(entrega.region||usuario.region||'').trim();
    const comuna=String(entrega.comuna||usuario.comuna||'').trim();
    const direccion=String(entrega.direccion||usuario.direccion||'').trim();
    if(!region||!comuna||!direccion)return {ok:false,mensaje:'Completa la dirección de entrega.'};
    if(!REGIONES[region]?.includes(comuna))return {ok:false,mensaje:'La comuna seleccionada no corresponde a la región indicada.'};
    if(!items.length)return {ok:false,mensaje:'El carrito está vacío.'};
    const datos={cliente:{run:usuario.run||'',nombre:obtenerNombreUsuario(usuario),correo:usuario.correo,telefono:usuario.telefono||'',region,comuna,direccion},entrega:{region,comuna,direccion},productos:items.map(i=>({codigo:i.codigo,cantidad:i.cantidad}))};
    compraEnCurso.current=true;
    try{const orden=await guardarOrden(datos);try {await vaciar();} catch { /* No repetir una compra confirmada si falla limpiar el carrito. */ }return {ok:true,orden};}
    catch(e){return {ok:false,mensaje:e.message};}
    finally{compraEnCurso.current=false;}
  }
  return <CartContext.Provider value={{items,total,totalItems,agregar,cambiarCantidad,eliminar,vaciar,finalizarCompra}}>{children}</CartContext.Provider>;
}
