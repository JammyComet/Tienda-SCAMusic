// Pruebas de almacenamiento del carrito invitado e idempotencia de compras.
// Ejecutar con: node --experimental-vm-modules test/test-storage.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {TextEncoder} from 'node:util';
const source=fs.readFileSync(new URL('../src/data/storage.js',import.meta.url),'utf8');
const memoria=new Map();
const sessionStorage={getItem:k=>memoria.get(k)??null,setItem:(k,v)=>memoria.set(k,v),removeItem:k=>memoria.delete(k)};
function entorno(fetch){
  const ctx=vm.createContext({crypto:webcrypto,TextEncoder,sessionStorage,fetch,console,Date,Map,FormData,Event:class {},window:{dispatchEvent(){}}});
  const mod=new vm.SourceTextModule(source,{context:ctx,initializeImportMeta(meta){meta.env={VITE_API_URL:''};}});
  return mod.link(()=>{}).then(()=>mod.evaluate()).then(()=>mod.namespace);
}
const ok=(value,status=200)=>({ok:true,status,headers:{get:()=>null},text:async()=>JSON.stringify(value)});
const orden={cliente:{correo:'cliente@ejemplo.com'},entrega:{region:'RM',comuna:'Santiago',direccion:'Calle 123'},productos:[{codigo:'DIS-001',cantidad:2}]};
const solicitudes=[];
let primera=true;
const fetch=async(ruta,opciones={})=>{
  if(ruta==='/api/v1/ordenes'&&opciones.method==='POST'){
    solicitudes.push(opciones.headers['Idempotency-Key']);
    if(primera){primera=false;throw new TypeError('Red interrumpida tras aceptar compra');}
    return ok({codigo:'ORD-0001',boletaNumero:'BOL-0001',estado:'Pagada',productos:[],total:100},201);
  }
  if(ruta==='/api/v1/productos'||ruta==='/api/v1/ordenes/mias'||ruta==='/api/v1/boletas/mias'||ruta==='/api/v1/carritos')return ok([]);
  throw new Error('Ruta imprevista: '+ruta);
};
const a=await entorno(fetch);
await a.guardarCarrito([{codigo:'DIS-001',cantidad:2}],null);
assert.deepEqual(JSON.parse(memoria.get('scamusica-carrito-invitado-v1')),[{codigo:'DIS-001',cantidad:2}]);
const b=await entorno(fetch); // simula pulsar F5
assert.equal(b.obtenerCarrito(null)[0].cantidad,2);
b.guardarSesion({id:7,rol:'Cliente'});
await assert.rejects(b.guardarOrden(orden));
const resultado=await b.guardarOrden(orden);
assert.equal(resultado.boletaNumero,'BOL-0001');
assert.equal(solicitudes.length,2);
assert.equal(solicitudes[0],solicitudes[1], 'Un reintento debe reutilizar la clave idempotente');
assert.equal(memoria.has('scamusica-compra-pendiente-v1'),false);
console.log('OK: carrito invitado persiste F5; reintentos reutilizan una única clave de compra');
