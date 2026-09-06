function protegerVistaAdministrador() {
    const sesion = obtenerSesion();

    if (
        !sesion ||
        sesion.rol !== "Administrador"
    ) {
        alert(
            "Debes iniciar sesión como administrador"
        );

        window.location.href = "/login";
        return;
    }

    const correo =
        document.getElementById(
            "adminCorreo"
        );

    if (correo) {
        correo.textContent = sesion.correo;
    }
}


document.addEventListener(
    "DOMContentLoaded",
    protegerVistaAdministrador
);
