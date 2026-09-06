function procesarContacto() {
    const nombre = document.getElementById("nombreC");
    const correo = document.getElementById("emailC");
    const comentario = document.getElementById("contenidoC");
    let esValido = true;

    if (validarNombre(nombre.value, 100)) marcarValido(nombre);
    else {
        marcarInvalido(nombre);
        esValido = false;
    }

    if (correo.value.trim() === "" || validarCorreo(correo.value)) {
        marcarValido(correo);
    } else {
        marcarInvalido(correo);
        esValido = false;
    }

    if (textoRequerido(comentario.value, 500)) marcarValido(comentario);
    else {
        marcarInvalido(comentario);
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

    const mensaje = {
        nombre: nombre.value.trim(),
        correo: correo.value.trim().toLowerCase(),
        comentario: comentario.value.trim(),
        fecha: new Date().toISOString().slice(0, 10)
    };

    const contactos = obtenerColeccion(COLO_KEYS.contactos);
    contactos.push(mensaje);
    guardarColeccion(COLO_KEYS.contactos, contactos);

    Swal.fire(
        "Mensaje enviado",
        "Gracias por escribirnos, te responderemos pronto.",
        "success"
    );

    document.getElementById("formularioContacto").reset();

    [nombre, correo, comentario].forEach(function (campo) {
        campo.classList.remove("is-valid", "is-invalid");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formularioContacto");
    if (!formulario) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        procesarContacto();
    });
});
