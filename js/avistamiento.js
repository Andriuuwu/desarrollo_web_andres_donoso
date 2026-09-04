const validarAve = (nombre) => {
    if (!nombre) return false;
    let longitudValida = nombre.trim().length >= 3;
    return longitudValida;
};

const validarTipoAve = (select) => {
    if (!select) return false;
    return true;
};

const validarLugar = (lugar) => {
    if (!lugar) return false;
    let longitudValida = lugar.trim().length >= 4;
    return longitudValida;
};

const validarFecha = (fecha) => {
    if (!fecha) return false;
    let hoy = new Date();
    let fechaIngresada = new Date(fecha);
    let limiteInferior = new Date();
    limiteInferior.setMonth(limiteInferior.getMonth()-2); // 2 meses anteriores al día de hoy
    let fechaValida = fechaIngresada <= hoy && limiteInferior <= fechaIngresada;
    return fechaValida;
};

const validarHora = (hora) => {
    if (!hora) return false;
    return true;
};

const validarArchivo = (archivos) => {
    if (!archivos) return false;

    // Establecemos un mínimo número de archivos 
    let longitudValida = 1 <= archivos.length;
    let tipoValido = true;

    for (const archivo of archivos) {
        let tipoArchivo = archivo.type.split("/")[0];
        tipoValido &&= tipoArchivo == "image" || tipoArchivo == "video";
    }

    return longitudValida && tipoValido;
};

const validarForm = () => {
    let formulario = document.forms["avisForm"];
    let nombreAve = formulario["nombreAve"].value;
    let tipoAve = formulario["tipoAve"].value;
    let lugar = formulario["lugar"].value;
    let fecha = formulario["fecha"].value;
    let hora = formulario["hora"].value;
    let archivoAve = formulario["archivoAve"].files;

    // Variables de validación
    let inputsInvalidos = [];
    let esValido = true;

    const esInvalidoInput = (input) => {
        inputsInvalidos.push(input);
        esValido &&= false;
    };

    if (!validarAve(nombreAve)) {
        esInvalidoInput("Nombre del Ave");
    }
    if (!validarTipoAve(tipoAve)) {
        esInvalidoInput("Tipo de Ave");
    }
    if (!validarLugar(lugar)) {
        esInvalidoInput("Lugar");
    }
    if (!validarFecha(fecha)) {
        esInvalidoInput("Fecha");
    }
    if (!validarHora(hora)) {
        esInvalidoInput("Hora");
    }
    if (!validarArchivo(archivoAve)) {
        esInvalidoInput("Archivo");
    }

    // Elementos del HTML para mostrar la validación
    let cajaValidacion = document.getElementById("cajaVal");
    let msgValidacion = document.getElementById("msgVal");
    let listaValidacion = document.getElementById("listVal");

    if (!esValido) {
        listaValidacion.textContent = "";

        for (const input of inputsInvalidos) {
            let listaElementos = document.createElement("li");
            listaElementos.innerText = input;
            listaValidacion.append(listaElementos);
        }

        msgValidacion.innerText = "Los siguientes campos son inválidos:";
        cajaValidacion.style.backgroundColor = "#ffdddd";
        cajaValidacion.style.borderLeftColor = "#f44336";
        cajaValidacion.hidden = false;

    } else {
        formulario.style.display = "none";
        let textoObligatorio = document.getElementById("textoObligatorio");
        textoObligatorio.hidden = true;

        msgValidacion.innerText = "¡Avistamiento enviado!";
        listaValidacion.textContent = "";

        cajaValidacion.style.backgroundColor = "#ddffdd";
        cajaValidacion.style.borderLeftColor = "#4CAF50";
        cajaValidacion.hidden = false;

        setTimeout(() => {
            formulario.style.display = "block";
            cajaValidacion.hidden = true;
            textoObligatorio.hidden = false;  
        }, 1500);
    }
};

let botonAviso = document.getElementById("avisButton");
botonAviso.addEventListener("click", validarForm);