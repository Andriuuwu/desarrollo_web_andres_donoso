from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload

# Creamos las credenciales mencionadas en el enunciado
DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# Representamos los modelos de cada tabla como clases

class Region(Base):
    __tablename__ = 'region'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    # Relationship permite acceder a datos relacionados como atributos, por ejemplo
    # Gracias a este relationship podemos hacer Region.comuna
    comunas = relationship("Comuna", back_populates="region", cascade="all, delete")

class Comuna(Base):
    __tablename__ = 'comuna'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)

    # Back_populates simplemente hace la relación bidireccional
    region = relationship("Region", back_populates="comunas")
    voluntarios = relationship("Voluntario", back_populates="comuna", cascade="all, delete")

class Ave(Base):
    __tablename__ = 'ave'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)

class Voluntario(Base):
    __tablename__ = 'voluntario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)

    # Cascade lo que hace es designar un comportamiento cuando se elimina un registro padre
    # En este caso, si se borra un Voluntario se deben borrar todos sus avistamientos.
    comuna = relationship("Comuna", back_populates="voluntarios")
    avistamientos = relationship("Avistamiento", back_populates="voluntario", cascade="all, delete")

class Avistamiento(Base):
    __tablename__ = 'avistamiento'

    id = Column(Integer, primary_key=True, autoincrement=True)
    voluntario_id = Column(Integer, ForeignKey('voluntario.id'), nullable=False)
    ave_id = Column(Integer, ForeignKey('ave.id'), nullable=False)
    fecha_hora = Column(DateTime, nullable=False)
    lugar = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)

    voluntario = relationship("Voluntario", back_populates="avistamientos")
    ave = relationship("Ave")
    registros = relationship("Registro", back_populates="avistamiento", cascade="all, delete")

class Registro(Base):
    __tablename__ = 'registro'

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    avistamiento_id = Column(Integer, ForeignKey('avistamiento.id'), nullable=False)

    avistamiento = relationship("Avistamiento", back_populates="registros")

# Funcion para la Portada

def obtenerAvistamientos():
    session = SessionLocal()
    avistamientos = (
        session.query(Avistamiento)
        # Options se encadena a session.query para darle instrucciones específicas
        # En este caso se ejecuta joinedLoad que carga una relación (relationship) de manera anticipada mediante un JOIN.
        .options(joinedload(Avistamiento.voluntario), joinedload(Avistamiento.ave))
        .order_by(Avistamiento.id.desc())
        .limit(2)
        .all()
    )
    session.close()
    return avistamientos

# Funciones para Registrar Voluntario

def obtenerUsuarioEmail(email):
    session = SessionLocal()
    voluntario = session.query(Voluntario).filter_by(email=email).first()
    session.close()
    return voluntario

def obtenerUsuarioTelefono(telefono):
    session = SessionLocal()
    voluntario = session.query(Voluntario).filter_by(telefono=telefono).first()
    session.close()
    return voluntario

def obtenerRegiones():
    session = SessionLocal()
    regiones = session.query(Region).order_by(Region.nombre).all()
    session.close()
    return regiones

def obtenerComunas():
    session = SessionLocal()
    comunas = session.query(Comuna).order_by(Comuna.nombre).all()
    session.close()
    return comunas

def obtenerComunaID(id):
    session = SessionLocal()
    comuna = session.query(Comuna).filter_by(id=id).first()
    session.close()
    return comuna

def crearVoluntario(nombre, email, telefono, comuna_id):
    session = SessionLocal()
    nuevo_voluntario = Voluntario(
        nombre=nombre,
        email=email,
        telefono=telefono,
        fecha_registro=datetime.now(),
        comuna_id=comuna_id
    )
    session.add(nuevo_voluntario)
    # Session.commmit simplemente guarda los nuevos datos en una tabla
    session.commit()
    voluntario_id = nuevo_voluntario.id
    session.close()
    return voluntario_id

def registrarVoluntario(nombre, email, telefono, comuna_id):
    if obtenerUsuarioEmail(email) is not None:
        return False, "El correo ya está registrado."

    if obtenerComunaID(comuna_id) is None:
        return False, "La comuna seleccionada no existe."

    if obtenerUsuarioTelefono(telefono) is not None:
        return False, "El teléfono ya está registrado."

    voluntario_id = crearVoluntario(nombre, email, telefono, comuna_id)
    return True, voluntario_id

# Funciones de Registrar Avistamiento

def obtenerVoluntarios():
    session = SessionLocal()
    voluntarios = session.query(Voluntario).order_by(Voluntario.nombre).all()
    session.close()
    return voluntarios

def obtenerAves():
    session = SessionLocal()
    aves = session.query(Ave).order_by(Ave.nombre).all()
    session.close()
    return aves

def obtenerVoluntarioID(id):
    session = SessionLocal()
    voluntario = session.query(Voluntario).filter_by(id=id).first()
    session.close()
    return voluntario

def obtenerAveID(id):
    session = SessionLocal()
    ave = session.query(Ave).filter_by(id=id).first()
    session.close()
    return ave

def crearAvistamiento(voluntario_id, ave_id, lugar, fecha, hora, registros):
    session = SessionLocal()
    nuevo_avistamiento = Avistamiento(
        voluntario_id=voluntario_id, 
        ave_id=ave_id, 
        fecha_hora=datetime.strptime(f"{fecha} {hora}", "%Y-%m-%d %H:%M"), 
        lugar=lugar, descripcion=None
        )
    
    for ruta_archivo, nombre_archivo in registros:
        nuevo_avistamiento.registros.append(Registro(ruta_archivo=ruta_archivo, nombre_archivo=nombre_archivo))
    session.add(nuevo_avistamiento)
    session.commit()
    session.close()

def registrarAvistamiento(voluntario_id, ave_id, lugar, fecha, hora, registros):
    if obtenerVoluntarioID(voluntario_id) is None:
        return False, "El voluntario seleccionado no existe."

    if obtenerAveID(ave_id) is None:
        return False, "El ave seleccionada no existe."

    crearAvistamiento(voluntario_id, ave_id, lugar, fecha, hora, registros)
    return True, None

# Funciones de Listado Avistamientos

def obtenerTotalAvistamientos(ave_id=None):
    session = SessionLocal()
    # Func.count simplemente cuenta todos los registros
    consulta = session.query(func.count(Avistamiento.id))
    if ave_id is not None:
        consulta = consulta.filter(Avistamiento.ave_id == ave_id)
    total = consulta.scalar()
    session.close()
    return total

def obtenerAvistamientosPagina(pagina, por_pagina, ave_id=None, orden=""):
    session = SessionLocal()
    consulta = (
        session.query(Avistamiento)
        .options(joinedload(Avistamiento.ave), joinedload(Avistamiento.registros))
    )
    if ave_id is not None:
        consulta = consulta.filter(Avistamiento.ave_id == ave_id)

    if orden == "fecha":
        consulta = consulta.order_by(Avistamiento.fecha_hora.desc(), Avistamiento.id.desc())
    elif orden == "lugar":
        consulta = consulta.order_by(Avistamiento.lugar.asc(), Avistamiento.id.desc())
    else:
        consulta = consulta.order_by(Avistamiento.id.desc())

    # Limit y Offset dicen cual es la cantidad máxima de resultados por pagina
    # Y cuantos resultados se deben saltar paginas anteriores para mostrar los actuales.
    avistamientos = consulta.limit(por_pagina).offset((pagina - 1) * por_pagina).all()
    session.close()
    return avistamientos

def obtenerAvistamientoID(id):
    session = SessionLocal()
    avistamiento = (
        session.query(Avistamiento)
        .options(
            joinedload(Avistamiento.voluntario),
            joinedload(Avistamiento.ave),
            joinedload(Avistamiento.registros))
        .filter_by(id=id)
        .first()
    )
    session.close()
    return avistamiento