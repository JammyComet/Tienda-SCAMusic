function eliminarUsuario(correo) {
    const sesion = obtenerSesion();

    if (sesion?.correo === correo) {
        Swal.fire({
            icon: "error",
            title: "No permitido",
            text: "No puedes eliminar tu propio usuario mientras tienes la sesión iniciada.",
            confirmButtonText: "OK"
        });
        return;
    }

    Swal.fire({
        icon: "warning",
        title: "¿Seguro que deseas eliminar este usuario?",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(function (resultado) {
        if (!resultado.isConfirmed) return;

        const usuarios = obtenerUsuarios().filter(
            usuario => usuario.correo !== correo
        );

        guardarColeccion(COLO_KEYS.usuarios, usuarios);
        mostrarUsuariosAdministrador();

        Swal.fire({
            icon: "success",
            title: "Usuario eliminado",
            text: "El usuario fue eliminado correctamente.",
            confirmButtonText: "OK"
        });
    });
}

function crearAccionesUsuario(usuario) {
    const sesion = obtenerSesion();
    const esSesionActual = sesion?.correo === usuario.correo;

    if (esSesionActual) {
        return `
            <span class="badge bg-secondary me-1">Sesión actual</span>
            <button type="button" class="btn btn-sm btn-dark" disabled>
                Editar
            </button>
            <button type="button" class="btn btn-sm btn-outline-danger" disabled>
                Eliminar
            </button>
        `;
    }

    return `
        <a
            href="/admin/usuarios/form?correo=${encodeURIComponent(usuario.correo)}"
            class="btn btn-sm btn-dark">
            Editar
        </a>

        <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            onclick="eliminarUsuario('${usuario.correo}')">
            Eliminar
        </button>
    `;
}

function crearFilaUsuario(usuario) {
    const fila = document.createElement("tr");
    const nombre = obtenerNombreUsuario(usuario);

    fila.innerHTML = `
        <td>${usuario.run || "-"}</td>
        <td>${nombre}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.rol}</td>
        <td class="text-nowrap">
            ${crearAccionesUsuario(usuario)}
        </td>
    `;

    return fila;
}

function mostrarUsuariosAdministrador() {
    const tabla = document.getElementById("tablaUsuarios");
    if (!tabla) return;

    const usuarios = obtenerUsuarios();
    tabla.innerHTML = "";

    if (usuarios.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-secondary">
                    No existen usuarios registrados.
                </td>
            </tr>
        `;
        return;
    }

    usuarios.forEach(usuario => {
        tabla.appendChild(crearFilaUsuario(usuario));
    });
}

document.addEventListener("DOMContentLoaded", mostrarUsuariosAdministrador);
