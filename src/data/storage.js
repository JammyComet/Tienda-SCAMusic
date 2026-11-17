// Se conserva este módulo para mantener todas las importaciones originales de React.
// Ya NO es una base de datos en localStorage: lee y escribe por API REST en Spring Boot.
const API = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');
// JWT de acceso solo en memoria; la renovación viaja en una cookie HttpOnly (no accesible a JavaScript).
let accessToken = null;
let venceTokenEn = 0;
let renovacionPendiente = null;
const SOLICITUD_SESION = {'X-Requested-With':'SCAMusica'};
export const STORAGE_KEYS = { usuarios:'usuarios',productos:'productos',categorias:'categorias',ordenes:'ordenes',contactos:'contactos',carrito:'carrito',sesion:'sesion' };
export const ADMIN_PRINCIPAL_CORREO = 'admin@duoc.cl';
const datos = {usuarios:[], productos:[], categorias:[], ordenes:[], boletas:[], reportesResumen:null, inventarioCritico:[], contactos:[]};
const carritos = new Map([['invitado', []]]);
// Cola por carrito: dos clicks seguidos nunca pueden escribir en MySQL fuera de orden.
const escriturasCarrito = new Map();
let sesion = null;
function emitirCambio(){window.dispatchEvent(new Event('scamusic-data'));}
function limpiarLocalmente(){
  accessToken=null;venceTokenEn=0;sesion=null;
  datos.usuarios=[];datos.ordenes=[];datos.boletas=[];datos.reportesResumen=null;
  datos.inventarioCritico=[];carritos.delete('usuario');emitirCambio();
}
function aceptarToken(respuesta){
  if(!respuesta?.token) throw new Error('No pudimos iniciar tu sesión. Inténtalo nuevamente.');
  accessToken=respuesta.token;
  venceTokenEn=Date.now()+Number(respuesta.expiresIn || 300)*1000;
}
async function realizar(ruta,opciones={},token=null){
  const headers={...(opciones.body && !(opciones.body instanceof FormData) ? {'Content-Type':'application/json'} : {}),...(opciones.headers||{})};
  if(token)headers.Authorization=`Bearer ${token}`;
  let respuesta;
  try{respuesta=await fetch(`${API}${ruta}`,{...opciones,credentials:'include',headers});}
  catch{throw new Error('No pudimos conectar con la tienda. Comprueba tu conexión e inténtalo nuevamente.');}
  if(!respuesta.ok){
    let info;try{info=await respuesta.json();}catch{info=null;}
    const detalle = typeof info?.detail === 'string' ? info.detail :
      typeof info?.message === 'string' ? info.message : '';
    let mensaje;
    if (respuesta.status === 401) mensaje = 'Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.';
    else if (respuesta.status === 403) mensaje = 'No tienes permiso para realizar esta acción.';
    else if (respuesta.status === 404) mensaje = 'No encontramos lo que buscas.';
    else if (respuesta.status >= 500) mensaje = 'Tuvimos un problema al procesar tu solicitud. Inténtalo nuevamente.';
    else if (respuesta.status === 400 && /contrase(?:ñ|n)a actual incorrecta/i.test(detalle))
      mensaje = 'La contraseña actual no coincide con la de tu cuenta.';
    else if (respuesta.status === 400 && /nueva contrase(?:ñ|n)a debe tener/i.test(detalle))
      mensaje = 'La nueva contraseña debe tener entre 8 y 72 caracteres.';
    else if (respuesta.status === 409 && /run duplicado/i.test(detalle)) mensaje = 'Ese RUN ya está registrado.';
    else if (respuesta.status === 409 && /correo ya registrado/i.test(detalle)) mensaje = 'Ese correo ya está registrado.';
    else mensaje = detalle && !/exception|java\.|org\.|stacktrace|http \d{3}|internal server error/i.test(detalle)
      ? detalle : 'No se pudo completar la solicitud. Revisa los datos e inténtalo nuevamente.';
    const error = new Error(mensaje);
    error.status = respuesta.status;
    throw error;
  }
  if(respuesta.status===204 || respuesta.headers.get('content-length')==='0')return null;
  const texto=await respuesta.text();return texto?JSON.parse(texto):null;
}
async function renovarJwt(){
  if(renovacionPendiente)return renovacionPendiente;
  renovacionPendiente=(async()=>{
    const respuesta=await realizar('/api/v1/auth/refresh',{method:'POST',headers:SOLICITUD_SESION});
    aceptarToken(respuesta);
    return respuesta;
  })();
  try{return await renovacionPendiente;}finally{renovacionPendiente=null;}
}
export async function mantenerSesion(){
  if(!sesion || !accessToken)return;
  if(Date.now()<venceTokenEn-60000)return;
  try{await renovarJwt();}
  catch(e){if(e.status===401||e.status===403)limpiarLocalmente();else throw e;}
}
export async function api(ruta, opciones={}){
  // Solo renovar si había una sesión; las rutas públicas no necesitan credenciales.
  if(accessToken && Date.now()>=venceTokenEn-45000){
    try{await renovarJwt();}
    catch(e){if(e.status===401||e.status===403)limpiarLocalmente();throw e;}
  }
  try{return await realizar(ruta,opciones,accessToken);}
  catch(e){
    if(e.status===401 && accessToken && !ruta.startsWith('/api/v1/auth/')){
      try{await renovarJwt();return await realizar(ruta,opciones,accessToken);}
      catch(fallo){if(fallo.status===401||fallo.status===403)limpiarLocalmente();throw fallo;}
    }
    throw e;
  }
}
function guardarDatos(clave, valores){datos[clave]=valores;emitirCambio();return valores;}
export function obtenerColeccion(clave){return [...(datos[clave] || [])];}
export async function guardarColeccion(){throw new Error('Se eliminó la escritura local de colecciones. Utiliza los endpoints REST CRUD.');}
export function obtenerNombreUsuario(u){return [u?.nombre,u?.apellidos].filter(Boolean).join(' ').trim() || u?.correo?.split('@')[0] || 'Usuario';}
export const obtenerUsuarios=()=>obtenerColeccion(STORAGE_KEYS.usuarios);
export const obtenerProductos=()=>obtenerColeccion(STORAGE_KEYS.productos);
export const obtenerCategorias=()=>obtenerColeccion(STORAGE_KEYS.categorias);
export const obtenerOrdenes=()=>obtenerColeccion(STORAGE_KEYS.ordenes);
export const obtenerBoletas=()=>obtenerColeccion('boletas');
export const obtenerResumenReportes=()=>datos.reportesResumen;
export const obtenerInventarioCritico=()=>obtenerColeccion('inventarioCritico');
export const obtenerUsuarioPorCorreo=(correo)=>obtenerUsuarios().find(u=>u.correo===String(correo||'').trim().toLowerCase())||null;
export const obtenerBoletasUsuario=(correo)=>obtenerBoletas().filter(o=>o.cliente?.correo?.toLowerCase()===String(correo||'').trim().toLowerCase()).sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
export const usuarioTieneCompras=(correo)=>obtenerOrdenes().some(o=>o.cliente?.correo?.toLowerCase()===String(correo||'').trim().toLowerCase());
export const esAdministradorPrincipal=(correo)=>String(correo||'').trim().toLowerCase()===ADMIN_PRINCIPAL_CORREO;
export const obtenerSesion=()=>sesion;
export function guardarSesion(usuario){sesion=usuario;emitirCambio();}
export async function cerrarSesion(){
  // Revocar el refresh del servidor incluso si el JWT de acceso ya expiró.
  limpiarLocalmente();
  try{await realizar('/api/v1/auth/logout',{method:'POST',headers:SOLICITUD_SESION});}
  catch{/* La sesión del navegador ya se cerró; si la red falla, el refresh vence a las 8h. */}
}
export async function inicializarDatos(){
  const [productos,categorias]=await Promise.all([api('/api/v1/productos'),api('/api/v1/categorias')]);
  guardarDatos('productos',productos);guardarDatos('categorias',categorias);
  // Recarga de la página: recuperar una nueva credencial de acceso usando solo la cookie HttpOnly.
  try {
    await renovarJwt();
    const actual=await api('/api/v1/usuarios/me');guardarSesion(actual);
    // No dejar la tienda en blanco si uno de los servicios privados está caído.
    try{await refrescarPrivados();}
    catch(error){console.warn('Sesión recuperada, datos secundarios pendientes.',error);}
  } catch(e){
    // La tienda pública debe seguir disponible aunque la sesión no se restaure.
    limpiarLocalmente();console.warn('No se pudo restaurar la sesión.',e);
  }
}
export async function refrescarPrivados(){
  if(!sesion)return;
  if(sesion.rol==='Administrador'){
    const [u,o,b,r,i]=await Promise.all([
      api('/api/v1/admin/usuarios'),api('/api/v1/ordenes'),api('/api/v1/boletas'),
      api('/api/v1/reportes/resumen'),api('/api/v1/inventario/criticos')
    ]);
    guardarDatos('usuarios',u);guardarDatos('ordenes',o);guardarDatos('boletas',b);
    datos.reportesResumen=r;guardarDatos('inventarioCritico',i);
  } else if(sesion.rol==='Vendedor'){
    guardarDatos('usuarios',[]);guardarDatos('ordenes',await api('/api/v1/ordenes'));
    guardarDatos('boletas',[]);datos.reportesResumen=null;guardarDatos('inventarioCritico',[]);
  } else {
    const [ordenes,boletas,lista]=await Promise.all([
      api('/api/v1/ordenes/mias'),api('/api/v1/boletas/mias'),api('/api/v1/carritos')
    ]);
    guardarDatos('usuarios',[sesion]);guardarDatos('ordenes',ordenes);guardarDatos('boletas',boletas);
    datos.reportesResumen=null;guardarDatos('inventarioCritico',[]);
    carritos.set('usuario',(lista||[]).map(i=>({codigo:obtenerProductos().find(p=>p.id===i.productoId)?.codigo,cantidad:i.cantidad})).filter(i=>i.codigo));
  }
  emitirCambio();
}
export async function loginRemoto(correo,contrasena){
  const r=await realizar('/api/v1/auth/login',{method:'POST',body:JSON.stringify({username:correo.trim().toLowerCase(),password:contrasena})});
  aceptarToken(r);
  let u;
  try{u=await api('/api/v1/usuarios/me');}
  catch(error){await cerrarSesion();throw error;}
  guardarSesion(u);
  // Autenticación correcta y consultas de datos son operaciones separadas.
  // Si boletas/carrito/reportes no responde, no decir que la contraseña es errónea.
  try{await refrescarPrivados();}
  catch(error){console.warn('Sesión iniciada; algunos datos privados no se pudieron cargar.',error);}
  try{await pasarCarritoInvitadoAUsuario(u);}
  catch(error){console.warn('Sesión iniciada; no se pudo sincronizar el carrito invitado.',error);}
  return u;
}
export function buscarUsuario(){throw new Error('Autenticación local eliminada. Utiliza loginRemoto.');}
export const existeCorreo=(correo,ignorar=null)=>obtenerUsuarios().some(u=>u.correo===correo && u.correo!==ignorar);
export const existeRun=(run,ignorar=null)=>Boolean(run)&&obtenerUsuarios().some(u=>String(u.run||'').trim()===String(run).trim() && String(u.run).trim()!==String(ignorar||'').trim());
export async function guardarUsuario(usuario,correoOriginal=null){
  const esPerfil = Boolean(sesion && correoOriginal === sesion.correo);
  const original=correoOriginal && obtenerUsuarios().find(u=>u.correo===correoOriginal);
  const ruta = esPerfil ? '/api/v1/usuarios/me' : original ? `/api/v1/admin/usuarios/${original.id}` : sesion?.rol==='Administrador' ? '/api/v1/admin/usuarios' : '/api/v1/usuarios/registro';
  const method=esPerfil||original?'PUT':'POST';
  const cuerpo={...usuario};
  // Nunca reenviar contraseña si se están actualizando solamente datos de perfil.
  if(!cuerpo.contrasena){delete cuerpo.contrasena;delete cuerpo.contrasenaActual;}
  const guardado=await api(ruta,{method,body:JSON.stringify(cuerpo)});
  if(esPerfil){
    // La escritura en MySQL ya terminó: una caída de carrito/boletas no debe informar
    // "no se pudo actualizar" cuando el perfil sí se guardó correctamente.
    guardarSesion(guardado);
    guardarDatos('usuarios',[guardado]);
    // Al cambiar contraseña el backend revoca el refresh y React cierra sesión.
    // No hacer peticiones privadas adicionales con una credencial revocada.
    if(cuerpo.contrasena)return guardado;
  }
  if(sesion){
    try{await refrescarPrivados();}
    catch(error){
      // La modificación fue exitosa. El resto de datos se recargará al actualizar.
      console.warn('SCAMusica: cambio guardado, pero no se pudo refrescar información secundaria.',error);
    }
  }
  return guardado;
}
export async function cambiarEstadoUsuario(correo,activo){
  if(esAdministradorPrincipal(correo) && !activo)return {ok:false,mensaje:'El administrador principal no puede desactivarse.'};
  const anterior=obtenerUsuarioPorCorreo(correo);if(!anterior)return {ok:false,mensaje:'Usuario no encontrado.'};
  try{await api(`/api/v1/admin/usuarios/${anterior.id}`,{method:'PUT',body:JSON.stringify({...anterior,activo})});await refrescarPrivados();return {ok:true};}
  catch(e){return {ok:false,mensaje:e.message};}
}
export async function eliminarUsuario(correo){
  if(esAdministradorPrincipal(correo))return {ok:false,mensaje:'El administrador principal no puede eliminarse.'};
  if(usuarioTieneCompras(correo))return {ok:false,mensaje:'El usuario tiene compras. Puedes desactivar su cuenta.'};
  const u=obtenerUsuarioPorCorreo(correo);if(!u)return {ok:false,mensaje:'Usuario no encontrado.'};
  try{await api(`/api/v1/admin/usuarios/${u.id}`,{method:'DELETE'});await refrescarPrivados();return {ok:true};}
  catch(e){return {ok:false,mensaje:e.message};}
}
export async function subirImagenProducto(archivo){
  const datosImagen=new FormData();
  datosImagen.append('archivo',archivo);
  let respuesta;
  try {
    respuesta=await api('/api/v1/productos/imagenes',{method:'POST',body:datosImagen});
  } catch(error) {
    // La vista previa es local; la portada solo está guardada cuando el servidor
    // devuelve su referencia. Distinguir esta operación del guardado del disco.
    if(error?.status>=500) throw new Error('No se pudo subir la portada. Inténtalo nuevamente.');
    throw error;
  }
  if(!respuesta?.imagen) throw new Error('No se pudo subir la portada. Inténtalo nuevamente.');
  return respuesta.imagen;
}
export async function guardarProducto(producto,codigoOriginal=null){
  const ruta=codigoOriginal?`/api/v1/productos/${encodeURIComponent(codigoOriginal)}`:'/api/v1/productos';
  const guardado=await api(ruta,{method:codigoOriginal?'PUT':'POST',body:JSON.stringify(producto)});
  // Un fallo al actualizar la lista no debe ocultar que MySQL guardó el disco:
  // así evitamos que el administrador cree el mismo producto varias veces.
  try { guardarDatos('productos',await api('/api/v1/productos')); }
  catch(error) { console.warn('Producto guardado; no se pudo actualizar la lista.',error); }
  return Boolean(guardado);
}
export async function eliminarProducto(codigo){await api(`/api/v1/productos/${encodeURIComponent(codigo)}`,{method:'DELETE'});guardarDatos('productos',await api('/api/v1/productos'));}
export const obtenerProductoPorCodigo=codigo=>obtenerProductos().find(p=>p.codigo===codigo);
export const obtenerNombreCategoria=id=>obtenerCategorias().find(c=>Number(c.id)===Number(id))?.nombre||'Sin categoría';
export async function guardarCategoria(nombre){
  const limpio=String(nombre||'').trim();if(!limpio)return {ok:false,mensaje:'Ingresa un nombre para la categoría.'};
  if(obtenerCategorias().some(c=>c.nombre.toLowerCase()===limpio.toLowerCase()))return {ok:false,mensaje:'Ya existe una categoría con ese nombre.'};
  try {await api('/api/v1/categorias',{method:'POST',body:JSON.stringify({nombre:limpio})});guardarDatos('categorias',await api('/api/v1/categorias'));return {ok:true};}
  catch(e){return {ok:false,mensaje:e.message};}
}
export async function eliminarCategoria(id){
  if(obtenerProductos().some(p=>Number(p.categoriaId)===Number(id)))return {ok:false,mensaje:'No puedes eliminar una categoría con productos.'};
  try {await api(`/api/v1/categorias/${id}`,{method:'DELETE'});guardarDatos('categorias',await api('/api/v1/categorias'));return {ok:true};}
  catch(e){return {ok:false,mensaje:e.message};}
}
export async function guardarContacto(m){return api('/api/v1/contactos',{method:'POST',body:JSON.stringify(m)});}
export const generarCodigoOrden=()=>null; // El servidor genera números únicos, no el navegador.
export const generarNumeroBoleta=()=>null;
export const obtenerOrdenPorCodigo=codigo=>obtenerOrdenes().find(o=>o.codigo===codigo);
export const obtenerBoletaPorNumero=numero=>obtenerBoletas().find(o=>o.boletaNumero===numero);
export async function guardarOrden(orden){
  // El POST es la operación que realmente registra la compra. Si una consulta
  // posterior falla, NO informar un pago fallido: podría provocar compras duplicadas.
  const guardado=await api('/api/v1/ordenes',{method:'POST',body:JSON.stringify(orden)});
  if(!obtenerOrdenes().some(o=>o.codigo===guardado.codigo)){
    guardarDatos('ordenes',[guardado,...obtenerOrdenes()]);
  }
  try {
    await Promise.all([api('/api/v1/productos').then(p=>guardarDatos('productos',p)),refrescarPrivados()]);
  } catch(error) {
    console.warn('Compra registrada; no se pudo actualizar alguna consulta secundaria.',error);
  }
  return guardado;
}
export function obtenerClaveCarrito(usuario=sesion){return usuario?.id?'usuario':'invitado';}
export function obtenerCarrito(usuario=sesion){return [...(carritos.get(obtenerClaveCarrito(usuario))||[])];}
export async function guardarCarrito(items,usuario=sesion){
  const clave=obtenerClaveCarrito(usuario);
  const copia=items.map(i=>({...i}));
  if(!usuario){carritos.set(clave,copia);emitirCambio();return;}
  const idUsuario=usuario.id;
  const datosEnviar=copia.map(i=>({productoId:obtenerProductoPorCodigo(i.codigo)?.id,cantidad:i.cantidad}));
  if(datosEnviar.some(i=>!i.productoId))throw new Error('Este producto ya no está disponible. Actualiza el catálogo e inténtalo otra vez.');
  // Serializar los PUT: de lo contrario una petición anterior y más lenta
  // puede sobrescribir en MySQL el último cambio del cliente.
  const anterior=escriturasCarrito.get(clave)||Promise.resolve();
  const escritura=anterior.catch(()=>{}).then(async()=>{
    if(!sesion || sesion.id!==idUsuario)throw new Error('La sesión cambió antes de guardar el carrito.');
    await api('/api/v1/carritos',{method:'PUT',body:JSON.stringify(datosEnviar)});
    // Una petición vieja no debe reemplazar el carrito de una cuenta posterior.
    if(sesion?.id===idUsuario){carritos.set(clave,copia);emitirCambio();}
  });
  escriturasCarrito.set(clave,escritura);
  try {await escritura;}
  finally {if(escriturasCarrito.get(clave)===escritura)escriturasCarrito.delete(clave);}
}
export async function pasarCarritoInvitadoAUsuario(usuario){
  const invitado=obtenerCarrito(null);if(!invitado.length)return;
  const actual=obtenerCarrito(usuario).map(i=>({...i}));
  for(const nuevo of invitado){
    const existente=actual.find(i=>i.codigo===nuevo.codigo);
    const max=Number(obtenerProductoPorCodigo(nuevo.codigo)?.stock||0);
    if(existente)existente.cantidad=Math.min(max,existente.cantidad+nuevo.cantidad);
    else if(max>0)actual.push({...nuevo,cantidad:Math.min(max,nuevo.cantidad)});
  }
  await guardarCarrito(actual.filter(i=>i.cantidad>0),usuario);
  carritos.set('invitado',[]);emitirCambio();
}
