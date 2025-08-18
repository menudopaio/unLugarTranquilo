import sys
import os
from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from flask_frozen import Freezer
import sqlite3

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


def get_productos():
    conn = sqlite3.connect("shop.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    # Traemos productos con variantes
    cur.execute("""
        SELECT p.id AS product_id, p.design_name, p.base_price,
               p.image_url_front, p.image_url_back,
               v.id AS variant_id, v.product_size, v.stock
        FROM products p
        JOIN product_variants v ON p.id = v.product_id
        ORDER BY p.id
    """)
    rows = cur.fetchall()
    conn.close()

    # Estructuramos datos
    productos = {}
    for r in rows:
        pid = r["product_id"]
        if pid not in productos:
            productos[pid] = {
                "nombre_producto": r["design_name"],
                "precio": r["base_price"],
                "imagen_front": r["image_url_front"],
                "imagen_back": r["image_url_back"],
                "variantes": []
            }
        productos[pid]["variantes"].append({
            "id": r["variant_id"],
            "size": r["product_size"],
            "stock": r["stock"]
        })
    return list(productos.values())

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

# @app.route("/viste-la-vida/")
# def productos():
#     baseUri = "."
#     return render_template("viste-la-vida.html", baseUri=baseUri)
@app.route("/viste-la-vida/")
def productos():
    baseUri = "."
    productos = get_productos()
    return render_template("viste-la-vida.html", baseUri=baseUri, productos=productos)



if __name__ == '__main__':
    # Esta condición es importante para asegurarse de que la aplicación se ejecute
    # correctamente tanto cuando se ejecuta como una aplicación Flask en vivo
    # como cuando se genera estáticamente con Frozen-Flask.
    if len(sys.argv) > 1 and sys.argv[1] == 'build':
        freezer.freeze()
    else:
        app.run(debug=True)