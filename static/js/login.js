function procesarLogin() {
    const correo = document.getElementById("usuarioL");
    const contrasena = document.getElementById("contrasenaL");
    let esValido = true;

    if (validarCorreo(correo.value)) {
        marcarValido(correo);
    } else {
        marcarInvalido(correo);
        esValido = false;
    }

    if (validarPassword(contrasena.value)) {
        marcarValido(contrasena);
    } else {
        marcarInvalido(contrasena);
        esValido = false;
    }

    if (!esValido) {
        Swal.fire(
            "Revisa los datos",
            "El correo o la contraseña no tienen un formato válido.",
            "error"
        );
        return;
    }

    const correoNormalizado = correo.value.trim().toLowerCase();
    const usuario = buscarUsuario(correoNormalizado, contrasena.value);

    if (!usuario) {
        marcarInvalido(correo);
        marcarInvalido(contrasena);

        Swal.fire(
            "Datos incorrectos",
            "El correo o la contraseña no coinciden.",
            "error"
        );
        return;
    }

    guardarSesion(usuario);

    Swal.fire(
        "Inicio de sesión",
        "Los datos son válidos.",
        "success"
    ).then(function () {
        if (usuario.rol === "Administrador") {
            window.location.href = "/admin";
        } else if (usuario.rol === "Vendedor") {
            window.location.href = "/vendedor";
        } else {
            window.location.href = "/";
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formularioLogin");

    if (!formulario) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        procesarLogin();
    });
});
