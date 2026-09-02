function validarContacto() {
    const nombre = document.getElementById("nombreC").value.trim();
    const email = document.getElementById("emailC").value.trim();
    const contenido = document.getElementById("contenidoC").value.trim();

    if (nombre === "" || contenido === "") {
        if (nombre === "") {
            alert("El campo nombre no puede estar vacío");
        } else if (contenido === "") {
            alert("El campo contenido no puede estar vacío");
        }
        return false;
    }

    if (nombre.length > 100) {
        alert("El nombre no puede tener más de 100 caracteres");
        return false;
    }

    if (email !== "" &&
        !email.endsWith("@duoc.cl") &&
        !email.endsWith("@profesor.duoc.cl") &&
        !email.endsWith("@gmail.com")) {
        alert("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com");
        return false;
    }

    if (email.length > 100) {
        alert("El correo no puede tener más de 100 caracteres");
        return false;
    }

    if (contenido.length > 500) {
        alert("El contenido no puede tener más de 500 caracteres");
        return false;
    }

    alert("Mensaje enviado correctamente. ¡Gracias por contactarnos!");
    return true;
}
