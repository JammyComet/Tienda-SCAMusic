function protegerVistaAdministrador() {
    const sesion = obtenerSesion();

    if (!sesion) {
        alert("Debes iniciar sesión como administrador.");
        window.location.href = "/login";
        return;
    }

    if (sesion.rol !== "Administrador") {
        alert("No tienes permisos para acceder al administrador.");
        window.location.href = "/";
        return;
    }

    document.body.classList.remove("d-none");

    const nombre = obtenerNombreUsuario(sesion);
    const elementos = {
        adminNombre: nombre,
        adminCorreo: sesion.correo,
        adminRol: sesion.rol,
        adminDatosSesion: `${nombre} · ${sesion.rol}`
    };

    Object.entries(elementos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    });
}

function cerrarSesionAdministrador() {
    cerrarSesion();
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", () => {
    protegerVistaAdministrador();

    document.getElementById("btnCerrarSesionAdmin")
        ?.addEventListener("click", cerrarSesionAdministrador);
});
