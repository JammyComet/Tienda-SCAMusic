/*
Validaciones en tiempo real.

Este archivo NO reemplaza las validaciones existentes del proyecto.
Solo reutiliza las funciones de validaciones.js para mostrar el estado
visual de los campos mientras el usuario escribe o cambia una opción.
La validación definitiva al enviar cada formulario sigue estando en
registro.js, login.js, contacto.js y los formularios del administrador.
*/

function limpiarValidacionTiempoReal(campo) {
    if (!campo) return;
    campo.classList.remove("is-valid", "is-invalid");
}

function mostrarValidacionTiempoReal(campo, esValido) {
    if (!campo) return;

    if (esValido) {
        marcarValido(campo);
    } else {
        marcarInvalido(campo);
    }
}

function agregarMensajeSiFalta(campo, mensaje) {
    if (!campo || !mensaje) return;

    const contenedor = campo.parentElement;
    if (!contenedor || contenedor.querySelector(".invalid-feedback")) return;

    const feedback = document.createElement("div");
    feedback.className = "invalid-feedback";
    feedback.textContent = mensaje;
    contenedor.appendChild(feedback);
}

function escucharCampo(id, evento, validar, opciones) {
    const campo = document.getElementById(id);
    if (!campo) return;

    const configuracion = opciones || {};

    if (configuracion.mensaje) {
        agregarMensajeSiFalta(campo, configuracion.mensaje);
    }

    campo.addEventListener(evento, function () {
        if (configuracion.opcional && campo.value.trim() === "") {
            limpiarValidacionTiempoReal(campo);
            return;
        }

        mostrarValidacionTiempoReal(campo, validar(campo));
    });
}

function iniciarValidacionesRegistroTiempoReal() {
    const formulario = document.getElementById("formularioRegistro");
    if (!formulario) return;

    escucharCampo("runR", "input", campo => validarRut(campo.value));
    escucharCampo("nombreR", "input", campo => validarNombre(campo.value, 50));
    escucharCampo("apellidosR", "input", campo => validarNombre(campo.value, 100));
    escucharCampo("emailR", "input", campo => validarCorreo(campo.value));

    escucharCampo(
        "Fecha_nacimientoR",
        "change",
        campo => campo.value !== "",
        { opcional: true }
    );

    const contrasena = document.getElementById("contrasenaR");
    const confirmar = document.getElementById("confirmar_contrasenaR");

    if (contrasena) {
        contrasena.addEventListener("input", function () {
            mostrarValidacionTiempoReal(contrasena, validarPassword(contrasena.value));

            if (confirmar && confirmar.value !== "") {
                mostrarValidacionTiempoReal(
                    confirmar,
                    validarPassword(confirmar.value) && confirmar.value === contrasena.value
                );
            }
        });
    }

    if (confirmar) {
        confirmar.addEventListener("input", function () {
            mostrarValidacionTiempoReal(
                confirmar,
                validarPassword(confirmar.value) &&
                contrasena && confirmar.value === contrasena.value
            );
        });
    }

    escucharCampo(
        "telefonoR",
        "input",
        campo => validarTelefono(campo.value)
    );

    escucharCampo("regionR", "change", campo => campo.value !== "");
    escucharCampo("comunaR", "change", campo => campo.value !== "");
    escucharCampo("direccionR", "input", campo => textoRequerido(campo.value, 300));

    const region = document.getElementById("regionR");
    const comuna = document.getElementById("comunaR");

    if (region && comuna) {
        region.addEventListener("change", function () {
            // Al cambiar la región, regiones.js vuelve a cargar las comunas.
            setTimeout(function () {
                limpiarValidacionTiempoReal(comuna);
            }, 0);
        });
    }
}

function iniciarValidacionesLoginTiempoReal() {
    const formulario = document.getElementById("formularioLogin");
    if (!formulario) return;

    escucharCampo("usuarioL", "input", campo => validarCorreo(campo.value));
    escucharCampo("contrasenaL", "input", campo => validarPassword(campo.value));
}

function iniciarValidacionesContactoTiempoReal() {
    const formulario = document.getElementById("formularioContacto");
    if (!formulario) return;

    escucharCampo("nombreC", "input", campo => validarNombre(campo.value, 100));
    escucharCampo(
        "emailC",
        "input",
        campo => validarCorreo(campo.value),
        { opcional: true }
    );
    escucharCampo("contenidoC", "input", campo => textoRequerido(campo.value, 500));
}

function iniciarValidacionesProductoTiempoReal() {
    const formulario = document.getElementById("formProducto");
    if (!formulario) return;

    escucharCampo(
        "codigoProducto",
        "input",
        campo => campo.value.trim().length >= 3
    );

    escucharCampo("nombreProducto", "input", campo => textoRequerido(campo.value, 100));
    escucharCampo("artistaProducto", "input", campo => textoRequerido(campo.value, 100));

    escucharCampo(
        "descripcionProducto",
        "input",
        campo => campo.value.trim().length <= 500,
        { opcional: true }
    );

    escucharCampo(
        "precioProducto",
        "input",
        campo => campo.value !== "" && numeroEnRango(campo.value, 0)
    );

    escucharCampo(
        "stockProducto",
        "input",
        campo => campo.value !== "" && enteroEnRango(campo.value, 0)
    );

    escucharCampo(
        "stockCriticoProducto",
        "input",
        campo => enteroEnRango(campo.value, 0),
        { opcional: true }
    );

    escucharCampo("categoriaProducto", "change", campo => campo.value !== "");
    escucharCampo("formatoProducto", "change", campo => campo.value !== "");

    escucharCampo(
        "anioProducto",
        "input",
        campo => Number.isInteger(Number(campo.value)) && Number(campo.value) > 0,
        {
            opcional: true,
            mensaje: "El año debe ser un número entero mayor que 0."
        }
    );
}

function iniciarValidacionesUsuarioAdminTiempoReal() {
    const formulario = document.getElementById("formUsuario");
    if (!formulario) return;

    escucharCampo(
        "runU",
        "input",
        campo => validarRut(campo.value),
        { mensaje: "Ingresa un RUN de 7 a 9 dígitos, sin puntos ni guion." }
    );

    escucharCampo(
        "nombreU",
        "input",
        campo => validarNombre(campo.value, 50),
        { mensaje: "El nombre es obligatorio y debe tener máximo 50 caracteres." }
    );

    escucharCampo(
        "apellidosU",
        "input",
        campo => validarNombre(campo.value, 100),
        { mensaje: "Los apellidos son obligatorios y deben tener máximo 100 caracteres." }
    );

    escucharCampo(
        "correoU",
        "input",
        campo => validarCorreo(campo.value),
        { mensaje: "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com)." }
    );

    escucharCampo(
        "fechaNacimientoU",
        "change",
        campo => campo.value !== "",
        { opcional: true }
    );

    escucharCampo(
        "telefonoU",
        "input",
        campo => validarTelefono(campo.value),
        {
            mensaje: "Ingresa 9 dígitos y comienza con 9."
        }
    );

    const contrasena = document.getElementById("contrasenaU");
    const confirmar = document.getElementById("confirmarContrasenaU");

    if (contrasena) {
        agregarMensajeSiFalta(
            contrasena,
            "La contraseña debe tener entre 4 y 10 caracteres."
        );

        contrasena.addEventListener("input", function () {
            mostrarValidacionTiempoReal(contrasena, validarPassword(contrasena.value));

            if (confirmar && confirmar.value !== "") {
                mostrarValidacionTiempoReal(
                    confirmar,
                    validarPassword(confirmar.value) && confirmar.value === contrasena.value
                );
            }
        });
    }

    if (confirmar) {
        agregarMensajeSiFalta(confirmar, "Las contraseñas deben coincidir.");

        confirmar.addEventListener("input", function () {
            mostrarValidacionTiempoReal(
                confirmar,
                validarPassword(confirmar.value) &&
                contrasena && confirmar.value === contrasena.value
            );
        });
    }

    escucharCampo(
        "rolU",
        "change",
        campo => campo.value !== "",
        { mensaje: "Selecciona un tipo de usuario." }
    );

    escucharCampo(
        "regionU",
        "change",
        campo => campo.value !== "",
        { mensaje: "Selecciona una región." }
    );

    escucharCampo(
        "comunaU",
        "change",
        campo => campo.value !== "",
        { mensaje: "Selecciona una comuna." }
    );

    escucharCampo(
        "direccionU",
        "input",
        campo => textoRequerido(campo.value, 300),
        { mensaje: "La dirección es obligatoria y debe tener máximo 300 caracteres." }
    );

    const region = document.getElementById("regionU");
    const comuna = document.getElementById("comunaU");

    if (region && comuna) {
        region.addEventListener("change", function () {
            setTimeout(function () {
                limpiarValidacionTiempoReal(comuna);
            }, 0);
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    iniciarValidacionesRegistroTiempoReal();
    iniciarValidacionesLoginTiempoReal();
    iniciarValidacionesContactoTiempoReal();
    iniciarValidacionesProductoTiempoReal();
    iniciarValidacionesUsuarioAdminTiempoReal();
});
