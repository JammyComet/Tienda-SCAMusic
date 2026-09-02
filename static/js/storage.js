const COLO_KEYS = {
    usuarios: "colo_usuarios",
    contactos: "colo_contactos",
    sesion: "colo_sesion"
};


function obtenerColeccion(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}


function guardarColeccion(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}


function inicializarDatos() {

    if (!localStorage.getItem(COLO_KEYS.usuarios)) {

        const usuariosIniciales = [
            {
                correo: "admin@duoc.cl",
                contrasena: "1234",
                rol: "Administrador"
            },
            {
                correo: "cliente@gmail.com",
                contrasena: "12345",
                rol: "Cliente"
            },
            {
                correo: "vendedor@duoc.cl",
                contrasena: "123456",
                rol: "Vendedor"
            }
        ];

        guardarColeccion(
            COLO_KEYS.usuarios,
            usuariosIniciales
        );
    }


    if (!localStorage.getItem(COLO_KEYS.contactos)) {
        guardarColeccion(COLO_KEYS.contactos, []);
    }
}


function obtenerSesion() {
    return JSON.parse(
        localStorage.getItem(COLO_KEYS.sesion)
    ) || null;
}


function guardarSesion(usuario) {
    localStorage.setItem(
        COLO_KEYS.sesion,
        JSON.stringify(usuario)
    );
}


function cerrarSesion() {
    localStorage.removeItem(COLO_KEYS.sesion);
}


document.addEventListener(
    "DOMContentLoaded",
    inicializarDatos
);