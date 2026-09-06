function procesarRegistro() {
    const run = document.getElementById("runR");
    const nombre = document.getElementById("nombreR");
    const apellidos = document.getElementById("apellidosR");
    const correo = document.getElementById("emailR");
    const fechaNacimiento = document.getElementById("Fecha_nacimientoR");
    const contrasena = document.getElementById("contrasenaR");
    const confirmarContrasena = document.getElementById("confirmar_contrasenaR");
    const telefono = document.getElementById("telefonoR");
    const region = document.getElementById("regionR");
    const comuna = document.getElementById("comunaR");
    const direccion = document.getElementById("direccionR");

    let esValido = true;

    if (validarRut(run.value)) marcarValido(run);
    else {
        marcarInvalido(run);
        esValido = false;
    }

    if (validarNombre(nombre.value, 50)) marcarValido(nombre);
    else {
        marcarInvalido(nombre);
        esValido = false;
    }

    if (validarNombre(apellidos.value, 100)) marcarValido(apellidos);
    else {
        marcarInvalido(apellidos);
        esValido = false;
    }

    if (validarCorreo(correo.value)) marcarValido(correo);
    else {
        marcarInvalido(correo);
        esValido = false;
    }

    if (fechaNacimiento.value !== "") marcarValido(fechaNacimiento);
    else fechaNacimiento.classList.remove("is-valid", "is-invalid");

    if (validarPassword(contrasena.value)) marcarValido(contrasena);
    else {
        marcarInvalido(contrasena);
        esValido = false;
    }

    if (
        validarPassword(confirmarContrasena.value) &&
        confirmarContrasena.value === contrasena.value
    ) {
        marcarValido(confirmarContrasena);
    } else {
        marcarInvalido(confirmarContrasena);
        esValido = false;
    }

    if (validarTelefono(telefono.value)) marcarValido(telefono);
    else {
        marcarInvalido(telefono);
        esValido = false;
    }

    if (region.value !== "") marcarValido(region);
    else {
        marcarInvalido(region);
        esValido = false;
    }

    if (comuna.value !== "") marcarValido(comuna);
    else {
        marcarInvalido(comuna);
        esValido = false;
    }

    if (textoRequerido(direccion.value, 300)) marcarValido(direccion);
    else {
        marcarInvalido(direccion);
        esValido = false;
    }

    if (!esValido) {
        Swal.fire(
            "Revisa el formulario",
            "Existen campos obligatorios o inválidos.",
            "error"
        );
        return;
    }

    const correoNormalizado = correo.value.trim().toLowerCase();

    if (existeCorreo(correoNormalizado)) {
        marcarInvalido(correo);
        Swal.fire(
            "Correo registrado",
            "Este correo ya está registrado.",
            "error"
        );
        return;
    }

    const usuario = {
        run: run.value.toUpperCase().trim(),
        nombre: nombre.value.trim(),
        apellidos: apellidos.value.trim(),
        correo: correoNormalizado,
        fechaNacimiento: fechaNacimiento.value,
        contrasena: contrasena.value,
        telefono: telefono.value.trim(),
        region: region.value,
        comuna: comuna.value,
        direccion: direccion.value.trim(),
        rol: "Cliente"
    };

    registrarUsuario(usuario);

    Swal.fire(
        "Registro exitoso",
        "El usuario fue registrado correctamente.",
        "success"
    );

    document.getElementById("formularioRegistro").reset();
    comuna.innerHTML = '<option value="">Seleccione la comuna</option>';

    [
        run,
        nombre,
        apellidos,
        correo,
        fechaNacimiento,
        contrasena,
        confirmarContrasena,
        telefono,
        region,
        comuna,
        direccion
    ].forEach(function (campo) {
        campo.classList.remove("is-valid", "is-invalid");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    cargarRegionesComunas("regionR", "comunaR");

    const formulario = document.getElementById("formularioRegistro");
    if (!formulario) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        procesarRegistro();
    });
});
