import { Button, Carousel, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ListaProductos from "../components/organisms/ListaProductos";
import { obtenerCategorias, obtenerProductos } from "../data/storage";

const banners = [
  {
    imagen: "/imagenes/inicio.png",
    titulo: "Encuentra tu próximo disco favorito",
    texto: "Vinilos, CDs y clásicos para seguir haciendo crecer tu colección.",
    ruta: "/productos",
    boton: "Ver productos",
  },
  {
    imagen: "/imagenes/escuchando.jpg",
    titulo: "Ofertas para escuchar más",
    texto: "Revisa los discos con descuento disponibles en la tienda.",
    ruta: "/ofertas",
    boton: "Ver ofertas",
  },
  {
    imagen: "/imagenes/artistas.jpg",
    titulo: "Explora por categorías",
    texto: "Rock, Pop, Metal, Jazz, Hip-Hop y mucho más en un solo lugar.",
    ruta: "/categorias",
    boton: "Ver categorías",
  },
];

export default function Home() {
  const productos = obtenerProductos().filter((producto) => producto.estado === "Activo");
  const categorias = obtenerCategorias();
  const ofertas = productos.filter((producto) => Number(producto.descuento || 0) > 0).slice(0, 3);
  const destacados = productos.slice(0, 6);

  return (
    <div className="home-marketplace">
      <section className="home-hero-section py-4">
        <Container fluid className="px-3 px-lg-5">
          <Carousel className="home-main-carousel shadow-sm" interval={5000}>
            {banners.map((banner) => (
              <Carousel.Item key={banner.titulo}>
                <div className="home-banner">
                  <img src={banner.imagen} alt={banner.titulo} className="home-banner-image" />
                  <div className="home-banner-overlay" />
                  <div className="home-banner-content">
                    <p className="home-banner-kicker mb-2">SCAMusica</p>
                    <h1 className="display-5 fw-bold mb-3">{banner.titulo}</h1>
                    <p className="lead mb-4">{banner.texto}</p>
                    <Button as={Link} to={banner.ruta} variant="light" className="fw-semibold px-4">
                      {banner.boton}
                    </Button>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      <section className="home-categories py-4">
        <Container fluid className="px-3 px-lg-5">
          <div className="d-flex justify-content-between align-items-end gap-3 mb-3">
            <div>
              <p className="text-secondary mb-1">Encuentra más rápido lo que buscas</p>
              <h2 className="fw-bold mb-0">Busca por categorías</h2>
            </div>
            <Button as={Link} to="/categorias" variant="outline-dark" size="sm">Ver todas</Button>
          </div>
          <Row className="g-3">
            {categorias.slice(0, 6).map((categoria) => (
              <Col xs={6} md={4} lg={2} key={categoria.id}>
                <Link to={`/categorias/${categoria.id}`} className="home-category-card text-decoration-none">
                  <div className="home-category-icon"><i className="bi bi-vinyl-fill" /></div>
                  <span>{categoria.nombre}</span>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {ofertas.length > 0 && (
        <section className="home-product-section py-5">
          <Container fluid className="px-3 px-lg-5">
            <div className="d-flex justify-content-between align-items-end gap-3 mb-4">
              <div>
                <p className="text-secondary mb-1">Aprovecha precios especiales</p>
                <h2 className="fw-bold mb-0">Ofertas destacadas</h2>
              </div>
              <Button as={Link} to="/ofertas" variant="outline-dark">Ver ofertas</Button>
            </div>
            <ListaProductos productos={ofertas} />
          </Container>
        </section>
      )}

      <section className="home-product-section home-product-section-alt py-5">
        <Container fluid className="px-3 px-lg-5">
          <div className="d-flex justify-content-between align-items-end gap-3 mb-4">
            <div>
              <p className="text-secondary mb-1">Lo mejor de nuestro catálogo</p>
              <h2 className="fw-bold mb-0">Productos destacados</h2>
            </div>
            <Button as={Link} to="/productos" variant="dark">Ver catálogo completo</Button>
          </div>
          <ListaProductos productos={destacados} />
        </Container>
      </section>


    </div>
  );
}
