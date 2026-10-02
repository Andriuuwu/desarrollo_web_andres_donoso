const validarVoluntario = (voluntario) => {
    if (!voluntario) return false;
    return true;
};

const validarAve = (ave) => {
    if (!ave) return false;
    return true;
};

const validarLugar = (lugar) => {
    if (!lugar) return false;
    let longitudValida = lugar.trim().length >= 3 && lugar.length <= 200;
    return longitudValida;
};

const validarFecha = (fecha) => {
    if (!fecha) return false;
    let hoy = new Date();
    let fechaIngresada = new Date(fecha);
    let limiteInferior = new Date();
    limiteInferior.setMonth(limiteInferior.getMonth()-2);
    let fechaValida = fechaIngresada <= hoy && limiteInferior <= fechaIngresada;
    return fechaValida;
};

const validarHora = (hora) => {
    if (!hora) return false;
    return true;
};

const validarArchivo = (archivos) => {
    if (!archivos) return false;

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
    let voluntario = formulario["voluntario"].value;
    let ave = formulario["ave"].value;
    let lugar = formulario["lugar"].value;
    let fecha = formulario["fecha"].value;
    let hora = formulario["hora"].value;
    let archivoAve = formulario["archivoAve"].files;

    let inputsInvalidos = [];
    let esValido = true;

    const esInvalidoInput = (input) => {
        inputsInvalidos.push(input);
        esValido &&= false;
    };

    if (!validarVoluntario(voluntario)) {
        esInvalidoInput("Voluntario: Debe seleccionar un voluntario.");
    }
    if (!validarAve(ave)) {
        esInvalidoInput("Ave: Debe seleccionar un ave.");
    }
    if (!validarLugar(lugar)) {
        esInvalidoInput("Lugar: Debe tener entre 3 y 200 caracteres.");
    }
    if (!validarFecha(fecha)) {
        esInvalidoInput("Fecha: Debe estar entre los últimos 2 meses y hoy.");
    }
    if (!validarHora(hora)) {
        esInvalidoInput("Hora: Debe ingresar una hora.");
    }
    if (!validarArchivo(archivoAve)) {
        esInvalidoInput("Archivo: Debe adjuntar al menos una foto o video (solo imágenes o videos).");
    }

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

        msgValidacion.innerText = "Por favor, corrija los siguientes errores:";
        cajaValidacion.style.backgroundColor = "#ffdddd";
        cajaValidacion.style.borderLeftColor = "#f44336";
        cajaValidacion.hidden = false;

    } else {
        formulario.submit();
    }
};

let botonAviso = document.getElementById("avisButton");
botonAviso.addEventListener("click", validarForm);