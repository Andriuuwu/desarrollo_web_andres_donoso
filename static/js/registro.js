const validarNombre = (nombre) => {
    if (!nombre) return false;

    let longitudValida = nombre.trim().length >= 3 && nombre.trim().length <= 255;
    return longitudValida;
};

const validarEmail = (email) => {
    if (!email) return false;

        let eR = /^[\w.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    let formatoValido = eR.test(email);

    return formatoValido;
};

const validarTelefono = (telefono) => {
    if (!telefono) return false;

    let eR = /^\+569\d{8}$/;
    let formatoValido = eR.test(telefono);

    return formatoValido;
};

const validarSelect = (select) => {
    if (!select) return false;
    return true;
};

const validarForm = (evento) => {

    evento.preventDefault();

    let formulario = document.forms["regForm"];
    let nombre = formulario["nombre"].value;
    let email = formulario["email"].value;
    let telefono = formulario["telefono"].value;
    let region = formulario["selectRegion"].value;
    let comuna = formulario["selectComuna"].value;

    let inputsInvalidos = [];
    let esValido = true;

    const esInputInvalido = (mensaje) => {
        inputsInvalidos.push(mensaje);
        esValido = false;
    };

    if (!validarNombre(nombre)) {
        esInputInvalido("Nombre: Debe tener al menos 3 caracteres.");
    }
    if (!validarEmail(email)) {
        esInputInvalido("Email: Ingrese un correo válido (ej. usuario@dominio.com).");
    }
    if (!validarTelefono(telefono)) {
        esInputInvalido("Teléfono: Debe seguir el formato +569XXXXXXXX (8 dígitos después del +569).");
    }
    if (!validarSelect(region)) {
        esInputInvalido("Región: Debe seleccionar una región.");
    }
    if (!validarSelect(comuna)) {
        esInputInvalido("Comuna: Debe seleccionar una comuna.");
    }

    let cajaValidacion = document.getElementById("cajaVal");
    let msgValidacion = document.getElementById("msgVal");
    let listaValidacion = document.getElementById("listVal");

    if (!esValido) {
        listaValidacion.innerHTML = "";

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

let botonRegistro = document.getElementById("submitButton");
botonRegistro.addEventListener("click", function(event) {
    validarForm(event);
});
