const contenedorComentarios = document.getElementById("listaComentarios");
const avistamientoId = contenedorComentarios.dataset.avistamientoId;

const mostrarComentarios = (comentarios) => {
  contenedorComentarios.innerHTML = "";

  if (comentarios.length === 0) {
    const vacio = document.createElement("p");
    vacio.textContent = "Aún no hay comentarios.";
    contenedorComentarios.appendChild(vacio);
    return;
  }

  for (const comentario of comentarios) {
    const caja = document.createElement("div");
    caja.className = "comentario";

    const cabecera = document.createElement("p");
    cabecera.className = "cabeceraComentario";

    const nombre = document.createElement("strong");
    nombre.textContent = comentario.nombre;

    const fecha = document.createElement("span");
    fecha.textContent = comentario.fecha;

    cabecera.appendChild(nombre);
    cabecera.appendChild(fecha);

    const texto = document.createElement("p");
    texto.className = "textoComentario";
    texto.textContent = comentario.texto;

    caja.appendChild(cabecera);
    caja.appendChild(texto);
    contenedorComentarios.appendChild(caja);
  }
};

const cargarComentarios = () => {
  fetch(`/comentarios/${avistamientoId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((respuesta) => {
      mostrarComentarios(respuesta.data);
    })
    .catch((error) => {
      console.error("Error:", error);
      contenedorComentarios.textContent = "No se pudieron cargar los comentarios.";
    });
};

cargarComentarios();

const formComentario = document.getElementById("formComentario");
const mensajeComentario = document.getElementById("mensajeComentario");

const validarNombreComentario = (nombre) => {
  if (!nombre) return false;
  return nombre.trim().length >= 3 && nombre.length <= 50;
};

const validarTextoComentario = (texto) => {
  if (!texto) return false;
  return texto.trim().length >= 5 && texto.length <= 300;
};

const mostrarMensaje = (mensaje, clase) => {
  mensajeComentario.textContent = mensaje;
  mensajeComentario.className = clase;
};

const enviarComentario = (nombre, texto) => {
  fetch(`/comentarios/${avistamientoId}`, {
    method: "POST",
    body: JSON.stringify({ nombre: nombre, texto: texto }),
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json().then((respuesta) => {
        return { ok: response.ok, respuesta: respuesta };
      });
    })
    .then((resultado) => {
      if (!resultado.ok) {
        mostrarMensaje(resultado.respuesta.mensaje, "mensajeErrorComentario");
        return;
      }
      formComentario.reset();
      mostrarMensaje("Comentario agregado correctamente.", "mensajeExito");
      cargarComentarios();
    })
    .catch((error) => {
      console.error("Error:", error);
      mostrarMensaje("No se pudo enviar el comentario.", "mensajeErrorComentario");
    });
};

formComentario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = formComentario["nombre"].value;
  const texto = formComentario["texto"].value;

  if (!validarNombreComentario(nombre)) {
    mostrarMensaje("El nombre debe tener entre 3 y 50 caracteres.", "mensajeErrorComentario");
    return;
  }

  if (!validarTextoComentario(texto)) {
    mostrarMensaje("El comentario debe tener entre 5 y 300 caracteres.", "mensajeErrorComentario");
    return;
  }

  enviarComentario(nombre, texto);
});