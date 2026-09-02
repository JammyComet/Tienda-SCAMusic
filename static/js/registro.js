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

    regionSelect.addEventListener("change", function() {
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

// Validación del formulario de registro.
function validarRegistro() {
    const rut = document.getElementById("runR").value.trim();
    const nombre = document.getElementById("nombreR").value.trim();
    const apellido = document.getElementById("apellidosR").value.trim();
    const email = document.getElementById("emailR").value.trim();
    const fechaNacimiento = document.getElementById("Fecha_nacimientoR").value.trim();
    const password = document.getElementById("contrasenaR").value.trim();
    const confirmPassword = document.getElementById("confirmar_contrasenaR").value.trim();
    const telefono = document.getElementById("telefonoR").value.trim();
    const region = document.getElementById("regionR").value.trim();
    const comuna = document.getElementById("comunaR").value.trim();
    const direccion = document.getElementById("direccionR").value.trim();

    if (rut === "" || nombre === "" || apellido === "" || email === "" ||
        password === "" || confirmPassword === "" || region === "" ||
        comuna === "" || direccion === "") {

        if (rut === "") {
            alert("El campo RUN no puede estar vacío");
        } else if (nombre === "") {
            alert("El campo nombre no puede estar vacío");
        } else if (apellido === "") {
            alert("El campo apellidos no puede estar vacío");
        } else if (email === "") {
            alert("El campo correo no puede estar vacío");
        } else if (password === "") {
            alert("El campo contraseña no puede estar vacío");
        } else if (confirmPassword === "") {
            alert("Debe confirmar la contraseña");
        } else if (region === "") {
            alert("Debe seleccionar una región");
        } else if (comuna === "") {
            alert("Debe seleccionar una comuna");
        } else if (direccion === "") {
            alert("El campo dirección no puede estar vacío");
        }
        return false;
    }

    if (rut.length < 7 || rut.length > 9) {
        alert("El RUN debe tener entre 7 y 9 caracteres");
        return false;
    }

    if (rut.includes(".") || rut.includes("-")) {
        alert("El RUN no debe contener puntos ni guion");
        return false;
    }

    if (nombre.length > 50) {
        alert("El nombre no puede tener más de 50 caracteres");
        return false;
    }

    if (apellido.length > 100) {
        alert("Los apellidos no pueden tener más de 100 caracteres");
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

    if (password.length < 4 || password.length > 10) {
        alert("La contraseña debe tener entre 4 y 10 caracteres");
        return false;
    }

    if (confirmPassword.length < 4 || confirmPassword.length > 10) {
        alert("La confirmación de contraseña debe tener entre 4 y 10 caracteres");
        return false;
    }

    if (confirmPassword !== password) {
        alert("Las contraseñas no coinciden");
        return false;
    }

    if (direccion.length > 300) {
        alert("La dirección no puede tener más de 300 caracteres");
        return false;
    }

    alert("Registro realizado correctamente");
    return true;
}
