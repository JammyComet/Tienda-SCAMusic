function protegerVistaVendedor() {
    const sesion = obtenerSesion();

    if (!sesion) {
        alert("Debes iniciar sesión como vendedor.");
        window.location.href = "/login";
        return;
    }

    if (sesion.rol !== "Vendedor") {
        alert("No tienes permisos para acceder a la vista de vendedor.");
        window.location.href = sesion.rol === "Administrador" ? "/admin" : "/";
        return;
    }

    document.body.classList.remove("d-none");

    const nombre = obtenerNombreUsuario(sesion);
    const elementos = {
        vendedorNombre: nombre,
        vendedorCorreo: sesion.correo,
        vendedorRol: sesion.rol,
        vendedorDatosSesion: `${nombre} · ${sesion.rol}`
    };

    Object.entries(elementos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    });
}

function cerrarSesionVendedor() {
    cerrarSesion();
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", () => {
    protegerVistaVendedor();

    document.getElementById("btnCerrarSesionVendedor")
        ?.addEventListener("click", cerrarSesionVendedor);
});
