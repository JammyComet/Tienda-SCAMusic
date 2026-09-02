function validarLogin() {
    const email = document.getElementById("usuarioL").value.trim();
    const contrasena = document.getElementById("contrasenaL").value.trim();

    if (email === "" || contrasena === "") {
        if (email === "") {
            alert("El campo correo no puede estar vacío");
        } else if (contrasena === "") {
            alert("El campo contraseña no puede estar vacío");
        }
        return false;
    }

    if (!email.endsWith("@duoc.cl") &&
        !email.endsWith("@profesor.duoc.cl") &&
        !email.endsWith("@gmail.com")) {
        alert("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com");
        return false;
    }

    if (email.length > 100) {
        alert("El correo no puede tener más de 100 caracteres");
        return false;
    }

    if (contrasena.length < 4 || contrasena.length > 10) {
        alert("La contraseña debe tener entre 4 y 10 caracteres");
        return false;
    }

    const usuarioEncontrado =
    buscarUsuario(email, contrasena);

    if (usuarioEncontrado === undefined) {
        alert("Correo o contraseña incorrectos");
        return false;
    }

    guardarSesion({
        correo: usuarioEncontrado.correo,
        rol: usuarioEncontrado.rol
    });

    alert("Inicio de sesión exitoso");
    return true;
}
