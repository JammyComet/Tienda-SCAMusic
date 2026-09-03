const COLO_KEYS = {
    usuarios: "colo_usuarios",
    productos: "colo_productos",
    categorias: "colo_categorias",
    carrito: "colo_carrito",
    contactos: "colo_contactos",
    sesion: "colo_sesion"
};


function obtenerColeccion(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}


function guardarColeccion(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}


function inicializarDatos() {

    if (!localStorage.getItem(COLO_KEYS.usuarios)) {

        const usuariosIniciales = [
            {
                correo: "admin@duoc.cl",
                contrasena: "1234",
                rol: "Administrador"
            },
            {
                correo: "cliente@gmail.com",
                contrasena: "12345",
                rol: "Cliente"
            },
            {
                correo: "vendedor@duoc.cl",
                contrasena: "123456",
                rol: "Vendedor"
            }
        ];

        guardarColeccion(
            COLO_KEYS.usuarios,
            usuariosIniciales
        );
    }


    if (!localStorage.getItem(COLO_KEYS.contactos)) {
        guardarColeccion(COLO_KEYS.contactos, []);
    }

    if (!localStorage.getItem(COLO_KEYS.categorias)) {

        const categoriasIniciales = [
            {
                id: 1,
                nombre: "Rock"
            },
            {
                id: 2,
                nombre: "Pop"
            },
            {
                id: 3,
                nombre: "Metal"
            },
            {
                id: 4,
                nombre: "Hip-Hop"
            },
            {
                id: 5,
                nombre: "Jazz"
            },
            {
                id: 6,
                nombre: "Electrónica"
            }
        ];

        guardarColeccion(
            COLO_KEYS.categorias,
            categoriasIniciales
        );
    }

    if (!localStorage.getItem(COLO_KEYS.productos)) {

        const productosIniciales = [

            {
                codigo: "DIS-001",
                nombre: "The Dark Side of the Moon",
                artista: "Pink Floyd",
                descripcion: "Álbum de estudio de Pink Floyd publicado en 1973.",
                precio: 29990,
                stock: 10,
                stockCritico: 3,
                categoriaId: 1,
                formato: "Vinilo",
                anio: 1973,
                imagen: "discos/dark-side.jpg",
                estado: "Activo"
            },

            {
                codigo: "DIS-002",
                nombre: "Abbey Road",
                artista: "The Beatles",
                descripcion: "Uno de los álbumes más reconocidos de The Beatles.",
                precio: 27990,
                stock: 8,
                stockCritico: 2,
                categoriaId: 1,
                formato: "Vinilo",
                anio: 1969,
                imagen: "discos/abbey-road.jpg",
                estado: "Activo"
            },

            {
                codigo: "DIS-003",
                nombre: "Thriller",
                artista: "Michael Jackson",
                descripcion: "Álbum de Michael Jackson publicado en 1982.",
                precio: 25990,
                stock: 12,
                stockCritico: 3,
                categoriaId: 2,
                formato: "Vinilo",
                anio: 1982,
                imagen: "discos/thriller.jpg",
                estado: "Activo"
            }


        ];

        guardarColeccion(
            COLO_KEYS.productos,
            productosIniciales
        );

        
    }
    
    if (!localStorage.getItem(COLO_KEYS.carrito)) {
        guardarColeccion(
            COLO_KEYS.carrito,
            []
        );
    }

}


function obtenerSesion() {
    return JSON.parse(
        localStorage.getItem(COLO_KEYS.sesion)
    ) || null;
}


function guardarSesion(usuario) {
    localStorage.setItem(
        COLO_KEYS.sesion,
        JSON.stringify(usuario)
    );
}


function cerrarSesion() {
    localStorage.removeItem(COLO_KEYS.sesion);
}


document.addEventListener(
    "DOMContentLoaded",
    inicializarDatos
);