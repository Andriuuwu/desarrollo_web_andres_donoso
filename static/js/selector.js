const filtrarComunas = (limpiar = true) => {
    let selectorRegion = document.getElementById("selectRegion");
    let selectorComuna = document.getElementById("selectComuna");
    let regionIdSeleccionada = selectorRegion.value;

    let opcionesComuna = selectorComuna.querySelectorAll("option");

    if (limpiar) selectorComuna.value = "";

    opcionesComuna.forEach(opcion => {
        if (opcion.value === "") {
            opcion.hidden = false;
            return;
        }

        let regionDeComuna = opcion.getAttribute("data-region");

        if (regionDeComuna === regionIdSeleccionada) {
            opcion.hidden = false;
        } else {
            opcion.hidden = true;
        }
    });
};

document.getElementById("selectRegion").addEventListener("change", () => filtrarComunas(true));

filtrarComunas(false);
