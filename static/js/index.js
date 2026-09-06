function obtenerProductosCarrusel() {
    return obtenerProductos().filter(producto => producto.estado === "Activo");
}

function agruparProductosCarrusel(productos, cantidad) {
    const grupos = [];

    for (let i = 0; i < productos.length; i += cantidad) {
        grupos.push(productos.slice(i, i + cantidad));
    }

    return grupos;
}

function crearDiscoCarrusel(producto, posicion) {
    return `
        <article class="disco-serpiente disco-serpiente-${posicion}">
            <a
                href="/producto-detalle?codigo=${encodeURIComponent(producto.codigo)}"
                class="disco-serpiente-link"
                aria-label="Ver ${producto.nombre}">

                <div class="caja-cd">
                    <div class="caja-cd-tapa">
                        <img
                            src="/static/imagenes/${producto.imagen}"
                            alt="${producto.nombre}"
                            class="caja-cd-imagen">
                    </div>

                    <div class="caja-cd-lomo">
                        <span>${producto.nombre}</span>
                    </div>
                </div>

                <div class="disco-serpiente-info">
                    <strong>${producto.nombre}</strong>
                    <span>${producto.artista || ""}</span>
                    <span>${formatearPrecio(producto.precio)}</span>
                </div>
            </a>
        </article>
    `;
}

function cargarCarruselInicio() {
    const contenedor = document.getElementById("carouselDiscosInner");
    if (!contenedor) return;

    const productos = obtenerProductosCarrusel();

    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="carousel-item active">
                <div class="text-center py-5">
                    <p class="mb-0">No hay discos disponibles por ahora.</p>
                </div>
            </div>
        `;
        return;
    }

    const grupos = agruparProductosCarrusel(productos, 3);

    contenedor.innerHTML = grupos.map((grupo, indiceGrupo) => `
        <div class="carousel-item ${indiceGrupo === 0 ? "active" : ""}">
            <div class="carrusel-serpiente-slide">
                ${grupo.map((producto, indice) =>
                    crearDiscoCarrusel(producto, indice + 1)
                ).join("")}
            </div>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", cargarCarruselInicio);
