from flask import Flask, render_template, request, redirect, url_for, flash, abort, jsonify
from werkzeug.utils import secure_filename
import database.db as db
from utils.validations import *
import hashlib
import filetype
import uuid
import os

# Variables constantes usadas
UPLOAD_FOLDER = "static/uploads"
POR_PAGINA = 3
ORDENES_LISTADO = {"", "fecha", "lugar"}
EXTENSIONES_VIDEO = {"mp4", "m4v", "mkv", "webm", "mov", "avi", "wmv", "mpg", "flv", "3gp"}

app = Flask(__name__)
app.secret_key = "super_secret_key_tarea_2"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Ruta principal siendo la portada
@app.route("/", methods=["GET"])
def portada():
    ultimos_avistamientos = db.obtenerAvistamientos()

    data = []
    for avistamiento in ultimos_avistamientos:
        data.append({
            "voluntario": avistamiento.voluntario.nombre,
            "ave": avistamiento.ave.nombre,
            "fecha": avistamiento.fecha_hora,
            "lugar": avistamiento.lugar
        })

    return render_template("portada.html", ultimos=data)

# Segunda ruta, siendo registro
@app.route("/registro", methods=["GET", "POST"])
def registro():
    if request.method == "POST":
        nombre = request.form.get("nombre")
        email = request.form.get("email")
        telefono = request.form.get("telefono")
        region_id = request.form.get("region")
        comuna_id = request.form.get("comuna")

        errores = []

        if validarVoluntario(nombre, email, telefono, region_id, comuna_id):
            comuna = db.obtenerComunaID(comuna_id)
            if comuna is not None and str(comuna.region_id) != region_id:
                errores.append("La comuna seleccionada no pertenece a la región indicada.")
            else:
                status, resultado = db.registrarVoluntario(nombre, email, telefono, comuna_id)
                if status:
                    return render_template("registro_exito.html", nombre=nombre, voluntario_id=resultado)
                errores.append(resultado)
        else:
            errores.append("Alguno de los campos ingresados no es válido.")

        regiones = db.obtenerRegiones()
        comunas = db.obtenerComunas()
        return render_template("registro.html", errores=errores, regiones=regiones, comunas=comunas, datos=request.form)

    elif request.method == "GET":
        regiones = db.obtenerRegiones()
        comunas = db.obtenerComunas()
        return render_template("registro.html", regiones=regiones, comunas=comunas, datos={})

# Tercera ruta, siendo avistamiento
@app.route("/avistamiento", methods=["GET", "POST"])
def avistamiento():
    if request.method == "POST":
        voluntario_id = request.form.get("voluntario")
        ave_id = request.form.get("ave")
        lugar = request.form.get("lugar")
        fecha = request.form.get("fecha")
        hora = request.form.get("hora")
        archivos = request.files.getlist("archivoAve")

        errores = []

        if validarAvistamiento(voluntario_id, ave_id, lugar, fecha, hora, archivos):
            archivos_guardar = []
            registros = []

            for archivo in archivos:
                # Secure_filename nos permite limpiar el nombre original del archivo subido
                nombre_original = secure_filename(archivo.filename)
                # Hashlib transforma el nombre del archivo a una cadena alfanumerica de 64 caracteres logrando la unicidad del archivo
                nombre_hash = hashlib.sha256(
                    (nombre_original + uuid.uuid4().hex).encode("utf-8")
                ).hexdigest()
                extension = filetype.guess(archivo).extension
                # Archivo.seek simplemente mira el inicio del archivo
                archivo.seek(0)
                nombre_final = f"{nombre_hash}.{extension}"

                archivos_guardar.append((archivo, nombre_final))
                registros.append((f"uploads/{nombre_final}", nombre_original[:300]))

            status, msg = db.registrarAvistamiento(voluntario_id, ave_id, lugar, fecha, hora, registros)
            if status:
                for archivo, nombre_final in archivos_guardar:
                    archivo.save(os.path.join(app.config["UPLOAD_FOLDER"], nombre_final))
                flash("¡Avistamiento registrado con éxito!")
                return redirect(url_for("portada"))
            errores.append(msg)
        else:
            errores.append("Alguno de los campos ingresados no es válido.")

        voluntarios = db.obtenerVoluntarios()
        aves = db.obtenerAves()
        return render_template("avistamiento.html", errores=errores, voluntarios=voluntarios, aves=aves, datos=request.form)

    elif request.method == "GET":
        voluntarios = db.obtenerVoluntarios()
        aves = db.obtenerAves()
        voluntario_preseleccionado = request.args.get("voluntario", "")
        return render_template("avistamiento.html", voluntarios=voluntarios, aves=aves, datos={"voluntario": voluntario_preseleccionado})

def leerFiltros():
    ave_texto = request.args.get("ave", "")
    ave_id = int(ave_texto) if validarPagina(ave_texto) else None

    orden = request.args.get("orden", "")
    if orden not in ORDENES_LISTADO:
        orden = ""

    return ave_id, orden

# Ruta de Listado
@app.route("/listado", methods=["GET"])
def listado():
    ave_id, orden = leerFiltros()
    total = db.obtenerTotalAvistamientos(ave_id)
    total_paginas = max(1, (total + POR_PAGINA - 1) // POR_PAGINA)

    pagina_texto = request.args.get("pagina", "1")
    if validarPagina(pagina_texto):
        pagina = int(pagina_texto)
    else:
        pagina = 1
    pagina = min(max(pagina, 1), total_paginas)

    avistamientos = db.obtenerAvistamientosPagina(pagina, POR_PAGINA, ave_id, orden)

    data = []
    for avistamiento in avistamientos:
        archivo = None
        tipo = None

        for registro in avistamiento.registros:
            # rsplit divide la ruta del archivo en varias partes según el simbolo en "", como lo acompaña en 1, solamente hacemos un split
            # Se usa para sacar la extensión justamente
            extension = registro.ruta_archivo.rsplit(".", 1)[-1].lower()
            if extension not in EXTENSIONES_VIDEO:
                archivo = registro.ruta_archivo
                tipo = "imagen"
                break

        if archivo is None and avistamiento.registros:
            archivo = avistamiento.registros[0].ruta_archivo
            tipo = "video"

        data.append({
            "id": avistamiento.id,
            "ave": avistamiento.ave.nombre,
            "lugar": avistamiento.lugar,
            "fecha": avistamiento.fecha_hora,
            "archivo": archivo,
            "tipo": tipo
        })

    return render_template("listado.html", avistamientos=data, pagina=pagina, total_paginas=total_paginas,
                           aves=db.obtenerAves(), ave_id=ave_id, orden=orden)

# Ruta para ver el detalle de un avistamiento
@app.route("/detalle/<int:avistamiento_id>", methods=["GET"])
def detalle(avistamiento_id):
    avistamiento = db.obtenerAvistamientoID(avistamiento_id)
    if avistamiento is None:
        abort(404)

    pagina_texto = request.args.get("pagina", "1")
    if validarPagina(pagina_texto):
        pagina = int(pagina_texto)
    else:
        pagina = 1
    ave_id, orden = leerFiltros()

    archivos = []
    for registro in avistamiento.registros:
        extension = registro.ruta_archivo.rsplit(".", 1)[-1].lower()
        if extension in EXTENSIONES_VIDEO:
            tipo = "video"
        else:
            tipo = "imagen"
        archivos.append({
            "ruta": registro.ruta_archivo,
            "nombre": registro.nombre_archivo,
            "tipo": tipo
        })

    data = {
        "id": avistamiento.id,
        "voluntario": avistamiento.voluntario.nombre,
        "ave": avistamiento.ave.nombre,
        "lugar": avistamiento.lugar,
        "fecha": avistamiento.fecha_hora,
        "archivos": archivos
    }

    return render_template("detalle.html", avistamiento=data, pagina=pagina, ave_id=ave_id, orden=orden)

# Ruta para ver las estadisticas
@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    return render_template("estadisticas.html")

# Grafico 1
@app.route("/datos-avistamientos-por-dia", methods=["GET"])
def datosAvistamientosPorDia():
    return jsonify(db.obtenerAvistamientosPorDia())

# Grafico 2
@app.route("/datos-avistamientos-por-ave", methods=["GET"])
def datosAvistamientosPorAve():
    return jsonify(db.obtenerAvistamientosPorAve())

# Grafico 3
@app.route("/datos-voluntarios-por-comuna", methods=["GET"])
def datosVoluntariosPorComuna():
    return jsonify(db.obtenerVoluntariosPorComuna())

# Ruta para ver los comentarios
@app.route("/comentarios/<int:avistamiento_id>", methods=["GET"])
def obtenerComentarios(avistamiento_id):
    if db.obtenerAvistamientoID(avistamiento_id) is None:
        return jsonify({"status": "error", "mensaje": "El avistamiento no existe."}), 404

    comentarios = db.obtenerComentariosAvistamiento(avistamiento_id)
    return jsonify({"status": "ok", "data": comentarios})

@app.route("/comentarios/<int:avistamiento_id>", methods=["POST"])
def agregarComentario(avistamiento_id):
    datos = request.get_json(silent=True) or {}
    nombre = datos.get("nombre")
    texto = datos.get("texto")

    if not isinstance(nombre, str) or not isinstance(texto, str):
        return jsonify({"status": "error", "mensaje": "Datos inválidos."}), 400

    if not validarComentario(nombre, texto):
        return jsonify({"status": "error", "mensaje": "El nombre debe tener entre 3 y 50 caracteres y el comentario entre 5 y 300."}), 400

    exito, mensaje = db.registrarComentario(nombre.strip(), texto.strip(), avistamiento_id)
    if not exito:
        return jsonify({"status": "error", "mensaje": mensaje}), 404

    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)