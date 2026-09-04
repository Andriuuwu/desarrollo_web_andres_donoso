let avistamientosEjemplo = [
    { nombreAve: "Zorzal", tipoAve: "paseriforme", lugar: "Parque Metropolitano", fecha: "2026-08-20", hora: "08:30" },
    { nombreAve: "Queltehue", tipoAve: "playera", lugar: "Humedal Batuco", fecha: "2026-08-25", hora: "17:15" },
    { nombreAve: "Cóndor", tipoAve: "rapaz", lugar: "Cajón del Maipo", fecha: "2026-08-15", hora: "10:00" },
    { nombreAve: "Flamenco Chileno", tipoAve: "andina", lugar: "Salar de Atacama", fecha: "2026-07-30", hora: "07:45" },
    { nombreAve: "Chorlo Nevado", tipoAve: "migratoria", lugar: "Bahía de Mejillones", fecha: "2026-08-10", hora: "16:20" },
    { nombreAve: "Lechuza Blanca", tipoAve: "nocturna", lugar: "Reserva Nacional Río Clarillo", fecha: "2026-08-02", hora: "20:30" }
];

let voluntariosEjemplo = [
    { nombre: "María Soto", region: "Región Metropolitana" },
    { nombre: "Pedro Rojas", region: "Valparaíso" },
    { nombre: "Camila Díaz", region: "Región Metropolitana" },
    { nombre: "Juan Pérez", region: "Biobío" },
    { nombre: "Andrea Vidal", region: "Región Metropolitana" },
    { nombre: "Felipe Muñoz", region: "Valparaíso" },
    { nombre: "Sofía Castro", region: "Los Lagos" }
];

const conteoAtributos = (lista, atributoClave) => {
    let contador = {};
    for (const elemento of lista) {
        let valorAtributo = elemento[atributoClave];
        if (!contador[valorAtributo]) {
            contador[valorAtributo] = 1;
        } else {
            contador[valorAtributo] += 1;
        }
    }
    return contador;
};

const dibujarGrafico = (listaConteo, contenedorId) => {
    let maximo = 0;
    for (const elemento in listaConteo) {
        let valorElemento = listaConteo[elemento];
        if (valorElemento > maximo) {
            maximo = valorElemento;
        }
    }

    let contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = "";

    for (const elemento in listaConteo) {
        let valorElemento = listaConteo[elemento];
        let altura = (valorElemento / maximo) * 100; // Nos entrega un porcentaje

        let grupoBarra = document.createElement("div");
        grupoBarra.className = "grupoBarra";
        
        let barra = document.createElement("div");
        barra.className = "barra";
        barra.style.height = altura + "%";

        let valorBarra = document.createElement("span");
        valorBarra.className = "valorBarra";
        valorBarra.innerText = valorElemento

        let nombreBarra = document.createElement("p");
        nombreBarra.className = "nombreBarra";
        nombreBarra.innerText = elemento

        barra.appendChild(valorBarra);
        grupoBarra.appendChild(barra);
        grupoBarra.appendChild(nombreBarra);
        contenedor.appendChild(grupoBarra);
    }
};

const conteoAvistamientos = conteoAtributos(avistamientosEjemplo, "tipoAve");
dibujarGrafico(conteoAvistamientos, "contGraficoAvistamientos");

const conteoVoluntarios = conteoAtributos(voluntariosEjemplo, "region");
dibujarGrafico(conteoVoluntarios, "contGraficoVoluntarios");