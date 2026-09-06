function obtenerUsuarios() {
    return obtenerColeccion(COLO_KEYS.usuarios);
}

function buscarUsuario(correo, contrasena) {
    return obtenerUsuarios().find(usuario =>
        usuario.correo === correo &&
        usuario.contrasena === contrasena
    );
}

function buscarUsuarioPorCorreo(correo) {
    return obtenerUsuarios().find(usuario => usuario.correo === correo);
}

function existeCorreo(correo, correoIgnorar = null) {
    return obtenerUsuarios().some(usuario =>
        usuario.correo === correo &&
        usuario.correo !== correoIgnorar
    );
}

function existeRun(run, runIgnorar = null) {
    const runNormalizado = String(run || "").trim();
    const runIgnorarNormalizado = String(runIgnorar || "").trim();

    return obtenerUsuarios().some(usuario => {
        const runUsuario = String(usuario.run || "").trim();

        return runUsuario === runNormalizado &&
               runUsuario !== runIgnorarNormalizado;
    });
}

function registrarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    guardarColeccion(COLO_KEYS.usuarios, usuarios);
}

function actualizarUsuario(correoOriginal, usuarioActualizado) {
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(usuario => usuario.correo === correoOriginal);

    if (indice === -1) return false;

    usuarios[indice] = usuarioActualizado;
    guardarColeccion(COLO_KEYS.usuarios, usuarios);
    return true;
}
