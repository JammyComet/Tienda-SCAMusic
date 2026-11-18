const DOMINIOS=["@duoc.cl","@profesor.duoc.cl","@gmail.com"];
export function validarCorreo(correo){ if(!correo||typeof correo!=="string")return false; const c=correo.trim().toLowerCase(); return c.length<=100 && /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(c) && DOMINIOS.some((d)=>c.endsWith(d)); }
export function validarPassword(p){ return typeof p==="string" && p.length>=8 && p.length<=72; }
export function validarRut(r){ return /^[0-9]{7,9}$/.test(String(r||"").trim()); }
export function textoRequerido(v,max){ const t=String(v||"").trim(); return t.length>0 && (!max||t.length<=max); }
export function validarNombre(v,max){ return textoRequerido(v,max) && /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(v.trim()); }
export function validarTelefono(v){ return /^9[0-9]{8}$/.test(String(v||"").trim()); }

// Usar la fecha local (no UTC) evita desfases cerca de medianoche.
export function fechaMaximaNacimiento(hoy = new Date()) {
  const anio = hoy.getFullYear() - 18;
  const mes = hoy.getMonth() + 1;
  const dia = Math.min(hoy.getDate(), new Date(anio, mes, 0).getDate());
  return `${String(anio).padStart(4, "0")}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export function validarFechaNacimiento(fecha, hoy = new Date()) {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha || "");
  if (!coincidencia) return false;
  const anio = Number(coincidencia[1]);
  const mes = Number(coincidencia[2]);
  const dia = Number(coincidencia[3]);
  if (anio < 1 || mes < 1 || mes > 12) return false;
  const bisiesto = anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0);
  const diasPorMes = [31, bisiesto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return dia >= 1 && dia <= diasPorMes[mes - 1] && fecha <= fechaMaximaNacimiento(hoy);
}
