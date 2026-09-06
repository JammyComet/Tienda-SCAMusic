function eliminarUsuario(correo) {
    const sesion = obtenerSesion();

    if (sesion?.correo === correo) {
        alert("No puedes eliminar el usuario con la sesión activa.");
        return;
    }

    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    const usuarios = obtenerUsuarios().filter(
        usuario => usuario.correo !== correo
    );

    guardarColeccion(COLO_KEYS.usuarios, usuarios);
    mostrarUsuariosAdministrador();
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
