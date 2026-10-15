import { createContext, useEffect, useState } from "react";
import { buscarUsuario, cerrarSesion, guardarSesion, obtenerSesion, pasarCarritoInvitadoAUsuario } from "../data/storage.js";
export const ROLES={ADMINISTRADOR:"Administrador",VENDEDOR:"Vendedor",CLIENTE:"Cliente"};
export const AuthContext=createContext(null);
export function AuthProvider({children}){
 const [usuario,setUsuario]=useState(obtenerSesion());
 useEffect(()=>{const sync=()=>setUsuario(obtenerSesion()); window.addEventListener("scamusic-data",sync); return()=>window.removeEventListener("scamusic-data",sync);},[]);
 function login(correo,contrasena){const u=buscarUsuario(correo.trim().toLowerCase(),contrasena); if(!u)return null; guardarSesion(u); pasarCarritoInvitadoAUsuario(u); setUsuario(u); return u;}
 function logout(){cerrarSesion(); setUsuario(null);}
 return <AuthContext.Provider value={{usuario,login,logout,esAdmin:usuario?.rol===ROLES.ADMINISTRADOR,esVendedor:usuario?.rol===ROLES.VENDEDOR}}>{children}</AuthContext.Provider>;
}
