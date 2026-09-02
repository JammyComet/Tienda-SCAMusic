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


if __name__ == "__main__":
    app.run(debug=True)