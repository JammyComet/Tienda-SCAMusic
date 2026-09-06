function validarLogin() {
    const email = document.getElementById("usuarioL");
    const contrasena = document.getElementById("contrasenaL");

    let esValido = true;

    if (validarCorreo(email.value)) {
        marcarValido(email);
    } else {
        marcarInvalido(email);
        esValido = false;
    }

    if (validarPassword(contrasena.value)) {
        marcarValido(contrasena);
    } else {
        marcarInvalido(contrasena);
        esValido = false;
    }

    if (!esValido) {
        alert("El correo o la contraseña no tienen un formato válido.");
        return false;
    }

    const correoNormalizado = email.value.trim().toLowerCase();

    const usuarioEncontrado = buscarUsuario(
        correoNormalizado,
        contrasena.value
    );

    if (usuarioEncontrado === undefined) {
        marcarInvalido(email);
        marcarInvalido(contrasena);
        alert("Correo o contraseña incorrectos");
        return false;
    }

    guardarSesion({
        correo: usuarioEncontrado.correo,
        rol: usuarioEncontrado.rol
    });

    alert("Inicio de sesión exitoso");

    if (usuarioEncontrado.rol === "Administrador") {
        window.location.href = "/admin";
    } else {
        window.location.href = "/";
    }

    return true;
}
