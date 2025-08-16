import sys
import os
from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from flask_frozen import Freezer

# Configure application
app = Flask(__name__)
freezer = Freezer(app)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

# Don't update automatically each refresh
app.config['SESSION_REFRESH_EACH_REQUEST'] = False

# Don't store in cache
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

Session(app)

@app.route("/")
def inicio():
    baseUri = ""
    return render_template("home.html", baseUri=baseUri)

@app.route("/escritos/")
def escritos():
    baseUri = "."
    return render_template("escritos.html", baseUri=baseUri)
@app.route("/el-sentido-de-la-vida/")
def elSentidoDeLaVida():
    baseUri = "."
    return render_template("el-sentido-de-la-vida.html", baseUri=baseUri)

@app.route("/sobre-el-tiempo/")
def sobreElTiempo():
    baseUri = "."
    return render_template("sobre-el-tiempo.html", baseUri=baseUri)

@app.route("/el-arbol-de-la-vida/")
def arbolVida():
    baseUri = "."
    return render_template("el-arbol-de-la-vida.html", baseUri=baseUri)

@app.route("/conciencia-en-su-medida/")
def concienciaEnSuMedida():
    baseUri = "."
    return render_template("conciencia-en-su-medida.html", baseUri=baseUri)

@app.route("/mi-hermoso-jardin/")
def miHermosoJardin():
    baseUri = "."
    return render_template("mi-hermoso-jardin.html", baseUri=baseUri)


""" @app.route("/conciencia-en-su-medida-editado/")
def concienciaEnSuMedidaEditado():
    baseUri = "."
    return render_template("conciencia-en-su-medida-editado.html", baseUri=baseUri)
    
@app.route("/excesivamente-humano/")
def excesivamenteHumano():
    baseUri = "."
    return render_template("excesivamente-humano.html", baseUri=baseUri)

@app.route("/constante-cambio/")
def constanteCambio():
    baseUri = "."
    return render_template("constante-cambio.html", baseUri=baseUri)
"""

@app.route("/buscandoLimites/")
def buscandoLimites():
    baseUri = "."
    return render_template("buscandoLimites.html", baseUri=baseUri)

@app.route("/empatia/")
def empatia():
    baseUri = "."
    return render_template("empatia.html", baseUri=baseUri)

@app.route("/no-saber/")
def noSaber():
    baseUri = "."
    return render_template("no-saber.html", baseUri=baseUri)

@app.route("/que-soy/")
def queSoy():
    baseUri = "."
    return render_template("que-soy.html", baseUri=baseUri)


@app.route("/about/")
def about():
    baseUri = "."
    return render_template("about.html", baseUri=baseUri)

@app.route("/viste-la-vida/")
def productos():
    productos_demo = [
        {
            "id_producto": 1,
            "nombre_producto": "Camiseta Azul",
            "imagen": "/static/images/productos/camiseta_azul.jpg",
            "precio": 19.99,
            "stock": 5
        },
        {
            "id_producto": 2,
            "nombre_producto": "Póster Minimalista",
            "imagen": "/static/images/productos/poster_minimal.jpg",
            "precio": 12.50,
            "stock": 0
        },
        {
            "id_producto": 3,
            "nombre_producto": "Sudadera Oversize",
            "imagen": "/static/images/productos/sudadera.jpg",
            "precio": 29.90,
            "stock": 12
        },
        {
            "id_producto": 4,
            "nombre_producto": "Sudadera Oversize",
            "imagen": "/static/images/productos/sudadera.jpg",
            "precio": 23.90,
            "stock": 12
        },
        {
            "id_producto": 5,
            "nombre_producto": "Sudadera Oversize",
            "imagen": "/static/images/productos/sudadera.jpg",
            "precio": 21.90,
            "stock": 12
        },
        {
            "id_producto": 6,
            "nombre_producto": "Sudadera Oversize",
            "imagen": "/static/images/productos/sudadera.jpg",
            "precio": 19.90,
            "stock": 12
        }
    ]
    baseUri = "."
    return render_template("viste-la-vida.html", baseUri=baseUri, productos=productos_demo)


if __name__ == '__main__':
    # Esta condición es importante para asegurarse de que la aplicación se ejecute
    # correctamente tanto cuando se ejecuta como una aplicación Flask en vivo
    # como cuando se genera estáticamente con Frozen-Flask.
    if len(sys.argv) > 1 and sys.argv[1] == 'build':
        freezer.freeze()
    else:
        app.run(debug=True)