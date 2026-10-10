const DOMINIOS=["@duoc.cl","@profesor.duoc.cl","@gmail.com"];
export function validarCorreo(correo){ if(!correo||typeof correo!=="string")return false; const c=correo.trim().toLowerCase(); return c.length<=100 && /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(c) && DOMINIOS.some((d)=>c.endsWith(d)); }
export function validarPassword(p){ return typeof p==="string" && p.length>=4 && p.length<=10; }
export function validarRut(r){ return /^[0-9]{7,9}$/.test(String(r||"").trim()); }
export function textoRequerido(v,max){ const t=String(v||"").trim(); return t.length>0 && (!max||t.length<=max); }
export function validarNombre(v,max){ return textoRequerido(v,max) && /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(v.trim()); }
export function validarTelefono(v){ return /^9[0-9]{8}$/.test(String(v||"").trim()); }
