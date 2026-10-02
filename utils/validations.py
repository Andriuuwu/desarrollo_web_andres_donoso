import re
import calendar
import filetype
from datetime import datetime, timedelta

def validarVoluntario(nombre, email, telefono, region_id, comuna_id):
    if not nombre or len(nombre.strip()) < 3 or len(nombre) > 255:
        return False

    email_regex = r'^[\w\.-]+@([\w-]+\.)+[a-zA-Z]{2,}$'
    # re nos permite trabajar con expresiones regulares
    if not email or len(email) > 80 or not re.fullmatch(email_regex, email):
        return False

    telefono_regex = r'^\+569\d{8}$'
    if not telefono or not re.fullmatch(telefono_regex, telefono):
        return False

    if not region_id or not str(region_id).isdigit():
        return False

    if not comuna_id or not str(comuna_id).isdigit():
        return False

    return True

def validarAvistamiento(voluntario_id, ave_id, lugar, fecha, hora, archivos):
    if not voluntario_id or not str(voluntario_id).isdigit():
        return False

    if not ave_id or not str(ave_id).isdigit():
        return False

    if not lugar or len(lugar.strip()) < 3 or len(lugar) > 200:
        return False

    fecha_regex = r'^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$'
    fecha_fullmatch = re.fullmatch(fecha_regex, fecha) if fecha else None
    if not fecha_fullmatch:
        return False

    hoy = datetime.now()
    # strftime permite convertir un dato de fecha y hora a un formato de string.
    fecha_maxima = hoy.strftime("%Y-%m-%d")
    fecha_minima = (hoy - timedelta(days=60)).strftime("%Y-%m-%d")
    if fecha > fecha_maxima or fecha < fecha_minima:
        return False

    año = int(fecha_fullmatch.group(1))
    mes = int(fecha_fullmatch.group(2))
    dia = int(fecha_fullmatch.group(3))
    if dia > calendar.monthrange(año, mes)[1]:
        return False

    hora_regex = r'^([01]\d|2[0-3]):[0-5]\d$'
    if not hora or not re.fullmatch(hora_regex, hora):
        return False

    if not archivos:
        return False

    for archivo in archivos:
        if archivo is None or archivo.filename == "":
            return False

        tipo = filetype.guess(archivo)
        archivo.seek(0)

        if tipo is None:
            return False

        if not (tipo.mime.startswith("image/") or tipo.mime.startswith("video/")):
            return False

    return True

def validarPagina(pagina):
    if not pagina.isascii():
        return False

    if not pagina.isdecimal():
        return False

    if len(pagina) > 9:
        return False

    return True