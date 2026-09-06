function cargarUsuarioFormulario(usuario) {
    document.getElementById("tituloFormularioUsuario").textContent = "Editar usuario";
    document.getElementById("runU").value = usuario.run || "";
    document.getElementById("nombreU").value = usuario.nombre || "";
    document.getElementById("apellidosU").value = usuario.apellidos || "";
    document.getElementById("correoU").value = usuario.correo || "";
    document.getElementById("fechaNacimientoU").value = usuario.fechaNacimiento || "";
    document.getElementById("telefonoU").value = usuario.telefono || "";
    document.getElementById("contrasenaU").value = usuario.contrasena || "";
    document.getElementById("confirmarContrasenaU").value = usuario.contrasena || "";
    document.getElementById("rolU").value = usuario.rol || "";
    document.getElementById("direccionU").value = usuario.direccion || "";
}

function aplicarValidacion(campo, esValido) {
    if (esValido) {
        marcarValido(campo);
    } else {
        marcarInvalido(campo);
    }

    return esValido;
}

function procesarFormularioUsuario(correoOriginal, runOriginal) {
    const run = document.getElementById("runU");
    const nombre = document.getElementById("nombreU");
    const apellidos = document.getElementById("apellidosU");
    const correo = document.getElementById("correoU");
    const fechaNacimiento = document.getElementById("fechaNacimientoU");
    const telefono = document.getElementById("telefonoU");
    const contrasena = document.getElementById("contrasenaU");
    const confirmarContrasena = document.getElementById("confirmarContrasenaU");
    const rol = document.getElementById("rolU");
    const region = document.getElementById("regionU");
    const comuna = document.getElementById("comunaU");
    const direccion = document.getElementById("direccionU");

    const validaciones = [
        aplicarValidacion(run, validarRut(run.value)),
        aplicarValidacion(nombre, validarNombre(nombre.value, 50)),
        aplicarValidacion(apellidos, validarNombre(apellidos.value, 100)),
        aplicarValidacion(correo, validarCorreo(correo.value)),
        aplicarValidacion(contrasena, validarPassword(contrasena.value)),
        aplicarValidacion(
            confirmarContrasena,
            validarPassword(confirmarContrasena.value) &&
            confirmarContrasena.value === contrasena.value
        ),
        aplicarValidacion(telefono, validarTelefono(telefono.value)),
        aplicarValidacion(rol, rol.value !== ""),
        aplicarValidacion(region, region.value !== ""),
        aplicarValidacion(comuna, comuna.value !== ""),
        aplicarValidacion(direccion, textoRequerido(direccion.value, 300))
    ];

    if (validaciones.includes(false)) {
        Swal.fire({
            icon: "error",
            title: "Revisa los datos del usuario",
            text: "Existen campos obligatorios o inválidos.",
            confirmButtonText: "OK"
        });
        return;
    }

    const runNormalizado = run.value.trim();
    const correoNormalizado = correo.value.trim().toLowerCase();

    if (existeRun(runNormalizado, runOriginal)) {
        marcarInvalido(run);

        Swal.fire({
            icon: "error",
            title: "RUN registrado",
            text: "Ya existe un usuario con ese RUN.",
            confirmButtonText: "OK"
        });

        return;
    }

    if (existeCorreo(correoNormalizado, correoOriginal)) {
        marcarInvalido(correo);

        Swal.fire({
            icon: "error",
            title: "Correo registrado",
            text: "Ya existe un usuario con ese correo.",
            confirmButtonText: "OK"
        });

        return;
    }

    const usuario = {
        run: runNormalizado,
        nombre: nombre.value.trim(),
        apellidos: apellidos.value.trim(),
        correo: correoNormalizado,
        fechaNacimiento: fechaNacimiento.value,
        contrasena: contrasena.value,
        telefono: telefono.value.trim(),
        region: region.value,
        comuna: comuna.value,
        direccion: direccion.value.trim(),
        rol: rol.value
    };

    let destino = "/admin/usuarios";

    if (correoOriginal) {
        actualizarUsuario(correoOriginal, usuario);

        const sesion = obtenerSesion();
        if (sesion?.correo === correoOriginal) {
            guardarSesion({
                correo: usuario.correo,
                nombre: obtenerNombreUsuario(usuario),
                rol: usuario.rol
            });

            if (usuario.rol !== "Administrador") {
                destino = "/";
            }
        }

        Swal.fire({
            icon: "success",
            title: "Usuario editado",
            text: "Usuario editado correctamente.",
            confirmButtonText: "OK"
        }).then(function () {
            window.location.href = destino;
        });
    } else {
        registrarUsuario(usuario);

        Swal.fire({
            icon: "success",
            title: "Usuario creado",
            text: "Usuario creado correctamente.",
            confirmButtonText: "OK"
        }).then(function () {
            window.location.href = destino;
        });
    }
}

function inicializarFormularioUsuario() {
    const formulario = document.getElementById("formUsuario");
    if (!formulario) return;

    const correoOriginal = new URLSearchParams(window.location.search).get("correo");
    let usuario = null;

    if (correoOriginal) {
        const sesion = obtenerSesion();

        if (sesion?.correo === correoOriginal) {
            Swal.fire({
                icon: "warning",
                title: "Acción no permitida",
                text: "No puedes editar tu propio usuario desde el panel de administración.",
                confirmButtonText: "OK"
            }).then(function () {
                window.location.href = "/admin/usuarios";
            });

            return;
        }

        usuario = buscarUsuarioPorCorreo(correoOriginal);

        if (!usuario) {
            Swal.fire({
                icon: "error",
                title: "Usuario no encontrado",
                text: "No se encontró el usuario solicitado.",
                confirmButtonText: "OK"
            }).then(function () {
                window.location.href = "/admin/usuarios";
            });

            return;
        }

        cargarUsuarioFormulario(usuario);
    }

    cargarRegionesComunas(
        "regionU",
        "comunaU",
        usuario?.region || "",
        usuario?.comuna || ""
    );

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();
        procesarFormularioUsuario(correoOriginal, usuario?.run || null);
    });
}

document.addEventListener("DOMContentLoaded", inicializarFormularioUsuario);
