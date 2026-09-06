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

    const correo = email.value.trim().toLowerCase();
    const usuario = buscarUsuario(correo, contrasena.value);

    if (!usuario) {
        marcarInvalido(email);
        marcarInvalido(contrasena);
        alert("Correo o contraseña incorrectos");
        return false;
    }

    guardarSesion({
        correo: usuario.correo,
        nombre: obtenerNombreUsuario(usuario),
        rol: usuario.rol
    });

    alert("Inicio de sesión exitoso");
    window.location.href = usuario.rol === "Administrador" ? "/admin" : "/";

    return true;
}
