import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function TarjetaBlog({ post }) {
  return (
    <article className="blog-card p-4">
      <Row className="align-items-center g-4">
        <Col lg={7}>
          <h2 className="text-white mb-3">{post.titulo}</h2>
          <p className="blog-description mb-4">{post.descripcion}</p>
          <Button as={Link} to={`/blog/${post.id}`} variant="danger" className="fw-bold">VER</Button>
        </Col>
        <Col lg={5}>
          <img src={`/imagenes/${post.imagen}`} alt={post.titulo} className="img-fluid blog-img w-100" />
        </Col>
      </Row>
    </article>
  );
}
