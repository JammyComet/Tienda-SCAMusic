// Ejecutar: node test/RegresionCambioContrasena.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const eventos=[];
globalThis.window={dispatchEvent(e){eventos.push(e.type);}};
globalThis.Event=class{constructor(type){this.type=type;}};
const usuario={id:1,correo:'cliente@gmail.com',rol:'Cliente',run:'11111111',nombre:'Cliente',apellidos:'SCAMusica',fechaNacimiento:'2000-01-01',telefono:'912345678',region:'Región Metropolitana de Santiago',comuna:'Santiago',direccion:'Av. Música 123'};
const solicitudes=[];
let resultadoCambio=200;
let claveActual='scamusica123';
const responder=(body,status=200)=>({ok:status>=200&&status<300,status,headers:{get(){return null;}},async text(){return body==null?'':JSON.stringify(body);},async json(){return body;}});
globalThis.fetch=async(url,opciones={})=>{
  const ruta=new URL(url,'http://localhost:8080').pathname;
  solicitudes.push({ruta,opciones});
  if(ruta==='/api/v1/auth/login')return responder({token:'token-prueba',expiresIn:300});
  if(ruta==='/api/v1/usuarios/me'&&opciones.method==='PUT'){
    const body=JSON.parse(opciones.body);
    assert.equal(body.contrasenaActual,claveActual);
    assert.equal(body.contrasena,'contraseñaNueva123');
    assert.equal(opciones.headers.Authorization,'Bearer token-prueba');
    if(resultadoCambio===400)return responder({detail:'Contraseña actual incorrecta'},400);
    return responder({...usuario,nombre:body.nombre});
  }
  if(ruta==='/api/v1/usuarios/me')return responder(usuario);
  if(ruta==='/api/v1/ordenes/mias')return responder([]);
  if(ruta==='/api/v1/boletas/mias')return responder([]);
  if(ruta==='/api/v1/carritos')return responder([]);
  if(ruta==='/api/v1/productos')return responder([]);
  if(ruta==='/api/v1/categorias')return responder([]);
  if(ruta==='/api/v1/auth/refresh')return responder({detail:'Sin sesión'},401);
  throw new Error(`Ruta no simulada: ${ruta}`);
};
let src=await fs.readFile(path.join(raiz,'src/data/storage.js'),'utf8');
src=src.replaceAll('import.meta.env.VITE_API_URL',"''");
const storage=await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
const cuenta=await storage.loginRemoto('cliente@gmail.com',claveActual);
assert.equal(cuenta.id,1);
// El formulario debe enviar explícitamente contraseña actual y nueva, nunca solo la nueva.
await storage.guardarUsuario({...cuenta,contrasenaActual:claveActual,contrasena:'contraseñaNueva123'},cuenta.correo);
const ultima=solicitudes.filter(x=>x.ruta==='/api/v1/usuarios/me'&&x.opciones.method==='PUT').at(-1);
assert.equal(JSON.parse(ultima.opciones.body).contrasenaActual,claveActual);
// Simular contraseña anterior incorrecta: mensaje entendible en pantalla, no texto de Spring.
resultadoCambio=400;
await assert.rejects(
  ()=>storage.guardarUsuario({...cuenta,contrasenaActual:claveActual,contrasena:'contraseñaNueva123'},cuenta.correo),
  error=>error.status===400 && /contraseña actual no coincide/i.test(error.message)
);
const login=await fs.readFile(path.join(raiz,'src/pages/Login.jsx'),'utf8');
const adminUsuario=await fs.readFile(path.join(raiz,'src/pages/admin/AdminUsuarioForm.jsx'),'utf8');
const adminProducto=await fs.readFile(path.join(raiz,'src/pages/admin/AdminProductoForm.jsx'),'utf8');
for(const texto of [login,adminUsuario,adminProducto]){
  assert.doesNotMatch(texto,/autenticación validada en Spring Boot|almacenados en MySQL/i);
}
console.log('OK: envio de contraseñas, autorización JWT, éxito, error comprensible y mensajes sin jerga técnica.');
