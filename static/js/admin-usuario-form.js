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

function procesarFormularioUsuario(correoOriginal) {
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
        alert("Revisa los datos del usuario.");
        return;
    }

    const correoNormalizado = correo.value.trim().toLowerCase();

    if (existeCorreo(correoNormalizado, correoOriginal)) {
        marcarInvalido(correo);
        alert("Ya existe un usuario con ese correo.");
        return;
    }

    const usuario = {
        run: run.value.trim().toUpperCase(),
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

        alert("Usuario editado correctamente.");
    } else {
        registrarUsuario(usuario);
        alert("Usuario creado correctamente.");
    }

    window.location.href = destino;
}

function inicializarFormularioUsuario() {
    const formulario = document.getElementById("formUsuario");
    if (!formulario) return;

    const correoOriginal = new URLSearchParams(window.location.search).get("correo");
    let usuario = null;

    if (correoOriginal) {
        usuario = buscarUsuarioPorCorreo(correoOriginal);

        if (!usuario) {
            alert("Usuario no encontrado.");
            window.location.href = "/admin/usuarios";
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
        procesarFormularioUsuario(correoOriginal);
    });
}

document.addEventListener("DOMContentLoaded", inicializarFormularioUsuario);
