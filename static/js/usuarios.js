function obtenerUsuarios() {
    return obtenerColeccion(COLO_KEYS.usuarios);
}


function buscarUsuario(correo, contrasena) {

    const usuarios = obtenerUsuarios();

    return usuarios.find(
        usuario =>
            usuario.correo === correo &&
            usuario.contrasena === contrasena
    );
}


function existeCorreo(correo) {

    const usuarios = obtenerUsuarios();

    return usuarios.some(
        usuario => usuario.correo === correo
    );
}


function registrarUsuario(usuario) {

    const usuarios = obtenerUsuarios();

    usuarios.push(usuario);

    guardarColeccion(
        COLO_KEYS.usuarios,
        usuarios
    );
}