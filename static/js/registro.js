const regiones = [
    "Región Metropolitana de Santiago",
    "Región de la Araucanía",
    "Región de Ñuble"
];

const comunas = {
    "Región Metropolitana de Santiago": ["Santiago"],
    "Región de la Araucanía": ["Temuco"],
    "Región de Ñuble": ["Chillán"]
};

const regionSelect = document.getElementById("regionR");
const comunaSelect = document.getElementById("comunaR");

if (regionSelect && comunaSelect) {
    for (let i = 0; i < regiones.length; i++) {
        const opcion = document.createElement("option");
        opcion.value = regiones[i];
        opcion.textContent = regiones[i];
        regionSelect.appendChild(opcion);
    }

    regionSelect.addEventListener("change", function () {
        comunaSelect.innerHTML = '<option value="">Seleccione la comuna</option>';

        const regionSeleccionada = regionSelect.value;
        const comunasRegion = comunas[regionSeleccionada] || [];

        for (let i = 0; i < comunasRegion.length; i++) {
            const opcion = document.createElement("option");
            opcion.value = comunasRegion[i];
            opcion.textContent = comunasRegion[i];
            comunaSelect.appendChild(opcion);
        }
    });
}

function validarRegistro() {
    const run = document.getElementById("runR");
    const nombre = document.getElementById("nombreR");
    const apellidos = document.getElementById("apellidosR");
    const email = document.getElementById("emailR");
    const fechaNacimiento = document.getElementById("Fecha_nacimientoR");
    const contrasena = document.getElementById("contrasenaR");
    const confirmarContrasena = document.getElementById("confirmar_contrasenaR");
    const telefono = document.getElementById("telefonoR");
    const region = document.getElementById("regionR");
    const comuna = document.getElementById("comunaR");
    const direccion = document.getElementById("direccionR");

    let esValido = true;

    if (validarRut(run.value)) {
        marcarValido(run);
    } else {
        marcarInvalido(run);
        esValido = false;
    }

    if (validarNombre(nombre.value, 50)) {
        marcarValido(nombre);
    } else {
        marcarInvalido(nombre);
        esValido = false;
    }

    if (validarNombre(apellidos.value, 100)) {
        marcarValido(apellidos);
    } else {
        marcarInvalido(apellidos);
        esValido = false;
    }

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

    if (
        validarPassword(confirmarContrasena.value) &&
        confirmarContrasena.value === contrasena.value
    ) {
        marcarValido(confirmarContrasena);
    } else {
        marcarInvalido(confirmarContrasena);
        esValido = false;
    }

    if (validarTelefono(telefono.value)) {
        marcarValido(telefono);
    } else {
        marcarInvalido(telefono);
        esValido = false;
    }

    if (region.value !== "") {
        marcarValido(region);
    } else {
        marcarInvalido(region);
        esValido = false;
    }

    if (comuna.value !== "") {
        marcarValido(comuna);
    } else {
        marcarInvalido(comuna);
        esValido = false;
    }

    if (textoRequerido(direccion.value, 300)) {
        marcarValido(direccion);
    } else {
        marcarInvalido(direccion);
        esValido = false;
    }

    if (!esValido) {
        alert("Revisa el formulario. Existen campos obligatorios o inválidos.");
        return false;
    }

    const correoNormalizado = email.value.trim().toLowerCase();

    if (existeCorreo(correoNormalizado)) {
        marcarInvalido(email);
        alert("Ya existe un usuario registrado con este correo");
        return false;
    }

    const nuevoUsuario = {
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

    registrarUsuario(nuevoUsuario);

    alert("Registro realizado correctamente");

    const formulario = run.closest("form");
    if (formulario) {
        formulario.reset();
    }

    comuna.innerHTML = '<option value="">Seleccione la comuna</option>';

    [
        run,
        nombre,
        apellidos,
        email,
        contrasena,
        confirmarContrasena,
        telefono,
        region,
        comuna,
        direccion
    ].forEach(function (campo) {
        campo.classList.remove("is-valid", "is-invalid");
    });

    return true;
}
