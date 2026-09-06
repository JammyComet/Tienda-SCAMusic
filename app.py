from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/blogs")
def blogs():
    return render_template("blogs.html")


@app.route("/contacto")
def contacto():
    return render_template("contacto.html")


@app.route("/nosotros")
def nosotros():
    return render_template("nosotros.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/registro")
def registro():
    return render_template("registro.html")


@app.route("/blog/1")
def detalle_blog1():
    return render_template("detalle-blog1.html")


@app.route("/blog/2")
def detalle_blog2():
    return render_template("detalle-blog2.html")

@app.route("/productos")
def productos():
    return render_template("productos.html")

@app.route("/producto-detalle")
def producto_detalle():
    return render_template("producto-detalle.html")


@app.route("/admin")
def admin():
    return render_template("admin.html")

@app.route("/admin/productos")
def admin_productos():
    return render_template("admin-productos.html")

@app.route("/admin/productos/form")
def admin_producto_form():
    return render_template("admin-producto-form.html")

@app.route("/admin/usuarios")
def admin_usuarios():
    return render_template("admin-usuarios.html")

@app.route("/admin/usuarios/form")
def admin_usuario_form():
    return render_template(
        "admin-usuario-form.html"
    )


if __name__ == "__main__":
    app.run(debug=True)