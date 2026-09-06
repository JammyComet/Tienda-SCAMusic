const regiones = [
    "Región Metropolitana de Santiago",
    "Región de la Araucanía",
    "Región de Ñuble"
];

const comunas = {
    "Región Metropolitana de Santiago": ["Santiago"],
    "Región de la Araucanía": ["Temuco"],
    "Región de Ñuble": ["Chillán"]
};

function cargarRegionesComunas(idRegion, idComuna, regionActual = "", comunaActual = "") {
    const regionSelect = document.getElementById(idRegion);
    const comunaSelect = document.getElementById(idComuna);

    if (!regionSelect || !comunaSelect) return;

    regiones.forEach(region => {
        const opcion = document.createElement("option");
        opcion.value = region;
        opcion.textContent = region;
        regionSelect.appendChild(opcion);
    });

    function cargarComunas(region, comunaSeleccionada = "") {
        comunaSelect.innerHTML = '<option value="">Seleccione la comuna</option>';

        (comunas[region] || []).forEach(comuna => {
            const opcion = document.createElement("option");
            opcion.value = comuna;
            opcion.textContent = comuna;
            comunaSelect.appendChild(opcion);
        });

        comunaSelect.value = comunaSeleccionada;
    }

    regionSelect.addEventListener("change", () => {
        cargarComunas(regionSelect.value);
    });

    if (regionActual) {
        regionSelect.value = regionActual;
        cargarComunas(regionActual, comunaActual);
    }
}
