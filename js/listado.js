let avistamientosEjemplo = [
    { nombreAve: "Zorzal", tipoAve: "paseriforme", lugar: "Parque Metropolitano", fecha: "2026-08-20", hora: "08:30", imagenAve: "./media/zorzal.jpeg"},
    { nombreAve: "Queltehue", tipoAve: "playera", lugar: "Humedal Batuco", fecha: "2026-08-25", hora: "17:15", imagenAve: "./media/queltehue.jpeg"},
    { nombreAve: "Cóndor", tipoAve: "rapaz", lugar: "Cajón del Maipo", fecha: "2026-08-15", hora: "10:00", imagenAve: "./media/condor.jpeg"},
    { nombreAve: "Flamenco Chileno", tipoAve: "andina", lugar: "Salar de Atacama", fecha: "2026-07-30", hora: "07:45", imagenAve: "./media/flamenco.jpeg"},
    { nombreAve: "Chorlo Nevado", tipoAve: "migratoria", lugar: "Bahía de Mejillones", fecha: "2026-08-10", hora: "16:20", imagenAve: "./media/chorlonevado.jpeg"},
    { nombreAve: "Lechuza Blanca", tipoAve: "nocturna", lugar: "Reserva Nacional Río Clarillo", fecha: "2026-08-02", hora: "20:30", imagenAve: "./media/lechuzablanca.jpeg"}
];

const mostrarAvistamientos = (lista) => {
    let contenedor = document.getElementById("contTarjetas");
    contenedor.innerHTML = "";

    for (const avistamiento of lista) {
        let tarjeta = document.createElement("div");
        let infoTarjeta = document.createElement("div");
        tarjeta.className = "tarjetaAvistamiento";

        let nombre = document.createElement("p");
        nombre.innerText = "Ave: " + avistamiento.nombreAve;
        infoTarjeta.appendChild(nombre);

        let tipo = document.createElement("p");
        tipo.innerText = "Tipo: " + avistamiento.tipoAve;
        infoTarjeta.appendChild(tipo);

        let lugar = document.createElement("p");
        lugar.innerText = "Lugar: " + avistamiento.lugar;
        infoTarjeta.appendChild(lugar);

        let fecha = document.createElement("p");
        fecha.innerText = "Fecha: " + avistamiento.fecha;
        infoTarjeta.appendChild(fecha);

        let hora = document.createElement("p");
        hora.innerText = "Hora: " + avistamiento.hora;
        infoTarjeta.appendChild(hora);

        let media = document.createElement("img");
        media.src = avistamiento.imagenAve;
        media.alt = "Imágen de: " + avistamiento.nombreAve;

        tarjeta.appendChild(infoTarjeta);
        tarjeta.appendChild(media);
        contenedor.appendChild(tarjeta);
    }
};

const ordenarAvistamientos = (lista) => {
    let criterio = document.getElementById("ordenDatos").value;

    if (criterio == "fecha") {
        return lista.sort((a,b) => b.fecha.localeCompare(a.fecha));
    } else if (criterio == "lugar") {
        return lista.sort((a, b) => a.lugar.localeCompare(b.lugar));
    } else {
        return lista
    }
}

const obtenerAvistFiltrados = () => {
    let tipoAve = document.getElementById("filtroAve").value;
    let filtrados = avistamientosEjemplo.filter((avistamiento) => tipoAve == "" || avistamiento.tipoAve == tipoAve);
    return filtrados;
};

let paginaActual = 1;
const porPagina = 3;
const obtenerPagina = (lista) => {
    let inicio = (paginaActual - 1) * porPagina;
    let fin = inicio + porPagina;
    return lista.slice(inicio, fin)
}

const actualizarFiltrados = () => {
    let listaAves = obtenerAvistFiltrados();
    mostrarAvistamientos(obtenerPagina(ordenarAvistamientos(listaAves)));

    let totalPaginas = Math.ceil(listaAves.length / porPagina);
    document.getElementById("textoPagina").innerText = "Página " + paginaActual + " de " + totalPaginas;
};

    document.getElementById("filtroAve").addEventListener("change", () => {
    paginaActual = 1;
    actualizarFiltrados();
    });

    document.getElementById("ordenDatos").addEventListener("change", () => {
    paginaActual = 1;
    actualizarFiltrados();
    });

    document.getElementById("btnSiguiente").addEventListener("click", () => {
    let totalFiltrados = obtenerAvistFiltrados().length;
    let totalPaginas = Math.ceil(totalFiltrados / porPagina);
    if (paginaActual < totalPaginas) {
        paginaActual = paginaActual + 1;
        actualizarFiltrados();
    }
    });

    document.getElementById("btnAnterior").addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual = paginaActual - 1;
        actualizarFiltrados();
    }
    });
    
actualizarFiltrados();