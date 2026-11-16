import { createContext, useEffect, useState } from 'react';
import { cerrarSesion, loginRemoto, mantenerSesion, obtenerSesion } from '../data/storage.js';
export const ROLES = {ADMINISTRADOR:'Administrador',VENDEDOR:'Vendedor',CLIENTE:'Cliente'};
export const AuthContext = createContext(null);
export function AuthProvider({children}) {
  const [usuario,setUsuario]=useState(obtenerSesion());
  useEffect(()=>{const sync=()=>setUsuario(obtenerSesion());window.addEventListener('scamusic-data',sync);return()=>window.removeEventListener('scamusic-data',sync);},[]);
  async function login(correo,contrasena){const nuevo=await loginRemoto(correo,contrasena);setUsuario(nuevo);return nuevo;}
  useEffect(()=>{
    const id=window.setInterval(()=>{void mantenerSesion().catch(()=>{});},30000);
    return ()=>window.clearInterval(id);
  },[]);
  async function logout(){await cerrarSesion();setUsuario(null);}
  return <AuthContext.Provider value={{usuario,login,logout,esAdmin:usuario?.rol===ROLES.ADMINISTRADOR,esVendedor:usuario?.rol===ROLES.VENDEDOR}}>{children}</AuthContext.Provider>;
}
