// Pruebas sin dependencias externas. Ejecutar: node test/RegresionStorage.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
// Evita que un error esperado imprima todo el módulo de prueba en base64.
const avisos=[];console.warn=(mensaje)=>avisos.push(mensaje);
const here=path.dirname(fileURLToPath(import.meta.url));
const base=path.resolve(here,'../src');
class Evento {constructor(tipo){this.type=tipo;}}
const eventos=[];
globalThis.Event=Evento;
globalThis.window={dispatchEvent(e){eventos.push(e.type);}};
const peticiones=[];
let carritoServidor=[];
const fecha='2026-11-15';
const pedido={codigo:'ORD-TEST',boletaNumero:'BOL-TEST',fecha,estado:'Pagada',cliente:{correo:'cliente@gmail.com'},productos:[],total:19990};
const usuario={id:7,correo:'cliente@gmail.com',rol:'Cliente',nombre:'Cliente',apellidos:'Prueba',region:'Región Metropolitana de Santiago',comuna:'Santiago',direccion:'Calle 1'};
let permitirProductos=true;
function respuesta(datos,status=200){return {ok:status>=200&&status<300,status,headers:{get(){return null;}},async text(){return datos==null?'':JSON.stringify(datos)},async json(){return datos;}};}
function pausa(ms){return new Promise(r=>setTimeout(r,ms));}
globalThis.fetch=async(url,opts={})=>{
  const ruta=new URL(url,'http://localhost:8080').pathname;
  peticiones.push({ruta,method:opts.method||'GET'});
  if(ruta==='/api/v1/productos')return permitirProductos?respuesta([{id:1,codigo:'DIS-001',nombre:'Disco',artista:'Artista',stock:10,precio:19990,estado:'Activo'}]):respuesta({message:'Catálogo temporalmente caído'},503);
  if(ruta==='/api/v1/categorias')return respuesta([{id:1,nombre:'Rock'}]);
  if(ruta==='/api/v1/auth/refresh')return respuesta({message:'Sin sesión'},401);
  if(ruta==='/api/v1/auth/login')return respuesta({token:'demo-token',expiresIn:300});
  if(ruta==='/api/v1/usuarios/me')return respuesta(opts.method==='PUT'?{...usuario,nombre:'Actualizado'}:usuario);
  if(ruta==='/api/v1/ordenes/mias')return respuesta([]);
  if(ruta==='/api/v1/boletas/mias')return respuesta({message:'Boletas temporalmente caído'},503);
  if(ruta==='/api/v1/carritos'&&opts.method==='PUT'){
    const items=JSON.parse(opts.body);
    await pausa(items[0]?.cantidad===1?70:5); // Retraso deliberadamente desigual.
    carritoServidor=items;
    return respuesta(items);
  }
  if(ruta==='/api/v1/carritos')return respuesta([]);
  if(ruta==='/api/v1/ordenes' && opts.method==='POST')return respuesta(pedido,201);
  throw Error('Ruta no simulada: '+ruta);
};
let codigo=await fs.readFile(path.join(base,'data/storage.js'),'utf8');
codigo=codigo.replaceAll('import.meta.env.VITE_API_URL', "''");
const storage=await import('data:text/javascript;base64,'+Buffer.from(codigo).toString('base64'));
// La tienda sigue abriendo si no hay cookie de renovación.
await storage.inicializarDatos();
assert.equal(storage.obtenerProductos().length,1);
assert.equal(storage.obtenerSesion(),null);
// El login válido no debe fallar por una boleta desconectada.
const logueado=await storage.loginRemoto('cliente@gmail.com','scamusica123');
assert.equal(logueado.id,7);
assert.equal(storage.obtenerSesion().correo,'cliente@gmail.com');
// Los PUT del carrito deben finalizar en el mismo orden en que los pidió React.
await Promise.all([
  storage.guardarCarrito([{codigo:'DIS-001',cantidad:1}]),
  storage.guardarCarrito([{codigo:'DIS-001',cantidad:3}]),
]);
assert.equal(carritoServidor[0].cantidad,3,'Un PUT antiguo no puede sobrescribir el último');
assert.equal(storage.obtenerCarrito()[0].cantidad,3);
// Una compra ya confirmada no puede convertirse en un "error de pago" por otro GET.
permitirProductos=false;
const comprado=await storage.guardarOrden({cliente:{correo:'cliente@gmail.com'},productos:[{codigo:'DIS-001',cantidad:1}]});
assert.equal(comprado.codigo,'ORD-TEST');
assert.ok(storage.obtenerOrdenPorCodigo('ORD-TEST'));
// La escritura del perfil no debe falsearse por fallos al consultar boletas.
const perfil=await storage.guardarUsuario({...usuario,nombre:'Actualizado'},usuario.correo);
assert.equal(perfil.nombre,'Actualizado');
// Las fechas YYYY-MM-DD no deben atrasarse un día al presentarse en Chile.
const formato=await fs.readFile(path.join(base,'utils/format.js'),'utf8');
const util=await import('data:text/javascript;base64,'+Buffer.from(formato).toString('base64'));
assert.ok(/15.*11.*2026/.test(util.formatearFecha('2026-11-15')),util.formatearFecha('2026-11-15'));
assert.ok(avisos.some(a=>a.includes('datos privados')));
console.log('OK: tienda pública, login degradado, orden de carrito, compra confirmada, perfil y fecha.');
