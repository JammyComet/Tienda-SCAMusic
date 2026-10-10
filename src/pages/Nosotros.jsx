import { Card, Col, Container, Row } from "react-bootstrap";

const desarrolladores = [
  { nombre: "Magdiel Reynoso", rol: "Desarrollador Frontend", imagen: "mari.jpeg" },
  { nombre: "Khristian Acevedo", rol: "Desarrollador Backend", imagen: "yo.jpg" },
  { nombre: "Diego Villagra", rol: "Desarrollador", imagen: "Lukas.png" },
];

export default function Nosotros() {
  return (
    <section className="nosotros text-white py-5">
      <Container className="text-center">
        <div className="section1">
          <h1 className="mb-4">
            <span className="span1 d-block">SOBRE</span>
            <span className="span2 d-block">NOSOTROS</span>
          </h1>
          <p className="nosotros-texto mx-auto text-white">
            Somos una tienda online dedicada a los amantes de la música, donde buscamos ofrecer tanto las últimas novedades como los grandes clásicos. Nuestro objetivo es entregar una experiencia de compra sencilla, rápida y accesible, permitiendo que nuestros clientes puedan encontrar discos, vinilos, CD, rarezas, ediciones especiales y todo en un espacio único.
          </p>
          <p className="nosotros-texto mx-auto text-white">
            Nuestra tienda fue desarrollada como parte de un proyecto académico, aplicando conocimientos de HTML, CSS y JavaScript para crear una plataforma web funcional y atractiva.
          </p>
        </div>
        <div className="desarrolladores mt-5">
          <h2 className="mb-3">Nuestros Desarrolladores</h2>
          <p className="text-white">Somos un equipo apasionado por la tecnología y la música.</p>
          <Row className="justify-content-center g-4 mt-2">
            {desarrolladores.map((desarrollador) => (
              <Col md={6} lg={4} key={desarrollador.nombre}>
                <Card className="developer-card text-white h-100 p-3">
                  <img
                    src={`/imagenes/${desarrollador.imagen}`}
                    alt={desarrollador.nombre}
                    className="developer-img rounded-circle mx-auto mb-3"
                  />
                  <Card.Body>
                    <h3 className="h5 text-white">{desarrollador.nombre}</h3>
                    <p className="mb-0 text-white">{desarrollador.rol}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </section>
  );
}
