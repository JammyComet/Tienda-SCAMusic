function obtenerOrdenes() {
    return obtenerColeccion(COLO_KEYS.ordenes);
}

function guardarOrdenes(ordenes) {
    guardarColeccion(COLO_KEYS.ordenes, ordenes);
}

function obtenerOrdenPorCodigo(codigo) {
    return obtenerOrdenes().find(orden => orden.codigo === codigo);
}

function generarCodigoOrden(ordenes = obtenerOrdenes()) {
    const mayorNumero = ordenes.reduce((mayor, orden) => {
        const numero = Number(String(orden.codigo || "").replace("ORD-", ""));
        return Number.isInteger(numero) && numero > mayor ? numero : mayor;
    }, 0);

    return `ORD-${String(mayorNumero + 1).padStart(4, "0")}`;
}

function formatearPrecioOrden(precio) {
    return Number(precio).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    });
}

function formatearFechaOrden(fecha) {
    const valor = new Date(fecha);
    if (Number.isNaN(valor.getTime())) return "Fecha no disponible";

    return valor.toLocaleString("es-CL", {
        dateStyle: "short",
        timeStyle: "short"
    });
}
