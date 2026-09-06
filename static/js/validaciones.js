
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

    if (!correo) return false;

    correo = correo.trim();

    if (correo.length === 0 || correo.length > 100) return false;

    return formato_correo.some(function (dominio) {
        return correo.toLowerCase().endsWith(dominio);
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

    if (!rut) return false;

    rut = rut.toUpperCase().trim();

    if (rut.length < 7 || rut.length > 9) return false;

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);

    if (!/^[0-9]+$/.test(cuerpo)) return false;
    if (!/^[0-9K]$/.test(dv)) return false;

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;

        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);

    let dvEsperado;

    if (resto === 11) {
        dvEsperado = "0";
    } else if (resto === 10) {
        dvEsperado = "K";
    } else {
        dvEsperado = String(resto);
    }

    return dv === dvEsperado;
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
Valida que un teléfono sea opcional y que cumpla con el formato chileno.
El formato chileno puede ser: +569XXXXXXXX, 569XXXXXXXX o 9XXXXXXXX.
*/
function validarTelefono(telefono) {

    // Si está vacío, es válido porque el teléfono es opcional
    if (!telefono) return true;

    telefono = telefono.trim();

    // Formato chileno: +569XXXXXXXX o 569XXXXXXXX o 9XXXXXXXX
    return /^(\+?56)?9[0-9]{8}$/.test(telefono);
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
