import { Carousel, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { obtenerProductos } from "../data/storage";
import { formatearPrecio, precioConDescuento, rutaImagen } from "../utils/format";

function grupos(arr, n) {
  const resultado = [];
  for (let i = 0; i < arr.length; i += n) resultado.push(arr.slice(i, i + n));
  return resultado;
}

export default function Home() {
  const productos = obtenerProductos().filter((producto) => producto.estado === "Activo");
  const slides = grupos(productos, 3);

  return (
    <>
      <section className="info-tienda bg-dark text-white py-4">
        <Container fluid className="px-4 px-lg-5">
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <h1 className="titulo mb-3">
                <span className="co d-block">PORQUE AMAS LA</span>
                <span className="musica-grande d-block">MÚSICA</span>
              </h1>
              <p className="descripcion fs-5 mb-0 text-white">Lo nuevo y lo viejo, todo en una página.</p>
            </Col>
            <Col lg={6} className="text-center text-lg-end">
              <img src="/imagenes/escuchando.jpg" alt="Persona escuchando música" className="img-fluid hero-img" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="productos carrusel-serpiente-seccion container-fluid py-5 px-3">
        <h2 className="text-center mb-4">DISCOS DISPONIBLES</h2>
        {slides.length ? (
          <Carousel className="carrusel-serpiente" interval={null}>
            {slides.map((grupo, i) => (
              <Carousel.Item key={i}>
                <div className="carrusel-serpiente-slide">
                  {grupo.map((producto, j) => {
                    const enOferta = Number(producto.descuento) > 0;
                    return (
                      <article className={`disco-serpiente disco-serpiente-${j + 1}`} key={producto.codigo}>
                        <Link to={`/productos/${producto.codigo}`} className="disco-serpiente-link">
                          <div className="caja-cd">
                            <div className="caja-cd-tapa">
                              <img src={rutaImagen(producto.imagen)} alt={producto.nombre} className="caja-cd-imagen" />
                            </div>
                            <div className="caja-cd-lomo"><span>{producto.nombre}</span></div>
                          </div>
                          <div className="disco-serpiente-info">
                            <strong>{producto.nombre}</strong>
                            <span>{producto.artista}</span>
                            {enOferta && <del className="text-secondary">{formatearPrecio(producto.precio)}</del>}
                            <span>{formatearPrecio(precioConDescuento(producto))}</span>
                            {enOferta && <span className="badge bg-danger align-self-center">{producto.descuento}% OFF</span>}
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <p className="text-center">No hay discos disponibles.</p>
        )}
      </section>
    </>
  );
}
