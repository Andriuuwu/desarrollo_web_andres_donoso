const validarNombre = (nombre) => {
    if (!nombre) return false;
    let longitudValida = nombre.trim().length >= 7;
    return longitudValida;
};

const validarEmail = (email) => {
    if (!email) return false;
    let longitudValida = email.length >= 10;

    // Validamos el formato a través de expresiones regulares
    let eR = /^[\w.]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,3}$/;
    let formatoValido = eR.test(email);

    return longitudValida && formatoValido;
};

const validarTelefono = (telefono) => {
    if (!telefono) return false;
    let longitudValida = telefono.length >= 12;

    // "\d" significa cualquier digito del 0 a 9.
    let eR = /^\+569\d{8}$/;
    let formatoValido = eR.test(telefono);

    return longitudValida && formatoValido;
};

const validarSelect = (select) => {
    if (!select) return false;
    return true;
};

const validarForm = () => {
    let formulario = document.forms["regForm"];
    let nombre = formulario["nombre"].value;
    let email = formulario["email"].value;
    let telefono = formulario["telefono"].value;
    let region = formulario["selectRegion"].value;
    let comuna = formulario["selectComuna"].value;

    // Variables de validación
    let inputsInvalidos = [];
    let esValido = true;

    const esInputInvalido = (input) => {
        inputsInvalidos.push(input);
        esValido &&= false;
    };

    if (!validarNombre(nombre)) {
        esInputInvalido("Nombre");
    }
    if (!validarEmail(email)) {
        esInputInvalido("Email");
    }
    if (!validarTelefono(telefono)) {
        esInputInvalido("Teléfono");
    }
    if (!validarSelect(region)) {
        esInputInvalido("Región");
    }
    if (!validarSelect(comuna)) {
        esInputInvalido("Comuna");
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
        let saludo = document.getElementById("saludo");
        let alerta = document.getElementById("alerta");

        formulario.style.display = "none";

        msgValidacion.innerText = "¡Formulario válido!";
        listaValidacion.textContent = "Redirigiendo...";

        cajaValidacion.style.backgroundColor = "#ddffdd";
        cajaValidacion.style.borderLeftColor = "#4CAF50";
        cajaValidacion.hidden = false;
        saludo.hidden = true;
        alerta.hidden = true;

        setTimeout(() => {
            window.location.href = "avistamiento.html";
        }, 1500); // 1000 milisegundos = 1 segundo
    }
};

let botonRegistro = document.getElementById("submitButton");
botonRegistro.addEventListener("click", validarForm);