function actualizarNavegacionSesion() {
    const sesion = obtenerSesion();
    if (!sesion) return;

    document.getElementById("enlaceLogin")?.classList.add("d-none");
    document.getElementById("enlaceRegistro")?.classList.add("d-none");
    document.getElementById("datosSesion")?.classList.remove("d-none");
    document.getElementById("btnCerrarSesion")?.classList.remove("d-none");

    const nombre = document.getElementById("nombreSesion");
    const rol = document.getElementById("rolSesion");

    if (nombre) nombre.textContent = obtenerNombreUsuario(sesion);
    if (rol) rol.textContent = sesion.rol;

    if (sesion.rol === "Administrador") {
        document.getElementById("enlaceAdmin")?.classList.remove("d-none");
    }
}

function cerrarSesionDesdeNavegacion() {
    cerrarSesion();
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarNavegacionSesion();

    document.getElementById("btnCerrarSesion")
        ?.addEventListener("click", cerrarSesionDesdeNavegacion);
});
