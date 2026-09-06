
const formato_correo = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

/*
validarCorreo:
La función recibe un correo y comprueba que no esté vacío,
que no supere los 100 caracteres y que termine en un dominio permitido.

.some() revisa si al menos un elemento del array cumple una condición.
function(dominio) crea una función y "dominio" es el parámetro que recibe.
.toLowerCase() convierte el correo a minúsculas.
.endsWith() comprueba si el correo termina con ese dominio.
return devuelve el resultado: true si es válido y false si no.
*/
function validarCorreo(correo) {

    if (!correo || typeof correo !== "string") return false;

    correo = correo.trim().toLowerCase();

    if (correo.length === 0 || correo.length > 100) return false;

    // Comprueba la estructura general del correo: texto@dominio.extensión.
    // No permite espacios, más de un @ ni un correo sin nombre de usuario.
    const formatoValido = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    if (!formatoValido.test(correo)) return false;

    return formato_correo.some(function (dominio) {
        return correo.endsWith(dominio);
    });
}

/*
function validarPassword(password) {
    return typeof password === "string" &&
           password.length >= 4 &&
           password.length <= 10;
}
*/
/*
Si eso se cumple contrasena invalida, si no se cumple contrasena valida

function validarPassword(password) {
    return typeof password !== "string" ||
           password.length < 4 ||
           password.length > 10;
}
*/

function validarPassword(password) {

    if (!password) return false;

    if (typeof password !== "string" || password.length < 4 || password.length > 10)
        return false;

    return true;
}

function validarRut(rut) {

    if (!rut || typeof rut !== "string") return false;

    rut = rut.trim();

    // RUN solicitado por el formulario: entre 7 y 9 dígitos,
    // sin puntos, guion ni letra K.
    return /^[0-9]{7,9}$/.test(rut);
}


/*
Marca un campo como válido visualmente.
Quita la clase "is-invalid" y agrega "is-valid" de Bootstrap.
*/
function marcarValido(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
}

/*
Marca un campo como inválido visualmente.
Quita la clase "is-valid" y agrega "is-invalid" de Bootstrap.
*/
function marcarInvalido(input) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
}

/*
Valida que un texto sea obligatorio y que no supere el máximo indicado.
trim() elimina espacios al inicio y al final, y length cuenta los caracteres.
*/
/*
Primera condición: si no hay valor O si el texto queda vacío después de quitar espacios.
Segunda condición: si existe un máximo Y el texto supera ese máximo.
*/
function textoRequerido(valor, maximo) {
    if (!valor || valor.trim().length === 0) return false;
    if (maximo && valor.trim().length > maximo) return false;
    return true;
}


/*
Valida que un nombre sea obligatorio, 
que no supere el máximo indicado y que solo contenga letras y espacios.
*/
function validarNombre(nombre, maximo) {

    if (!textoRequerido(nombre, maximo)) {
        return false;
    }

    return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(nombre.trim());
}

/*
Valida que el teléfono sea obligatorio y tenga formato móvil chileno.
Debe contener exactamente 9 dígitos y comenzar con 9.
*/
function validarTelefono(telefono) {

    if (!telefono || typeof telefono !== "string") return false;

    telefono = telefono.trim();

    // Teléfono móvil chileno: exactamente 9 dígitos y debe comenzar con 9.
    return /^9[0-9]{8}$/.test(telefono);
}


function numeroEnRango(valor, minimo) {
    const numero = Number(valor);

    if (isNaN(numero)) {
        return false;
    }

    return numero >= minimo;
}


function enteroEnRango(valor, minimo) {
    const numero = Number(valor);

    if (isNaN(numero)) {
        return false;
    }

    return (
        Number.isInteger(numero) &&
        numero >= minimo
    );
}
