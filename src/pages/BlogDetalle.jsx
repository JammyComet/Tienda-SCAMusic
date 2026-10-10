import { Button, Col, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { obtenerBlogPorId } from "../data/blogs";

export default function BlogDetalle() {
  const { id } = useParams();
  const post = obtenerBlogPorId(id);
  if (!post) return <Container className="py-5"><h1>Entrada no encontrada</h1></Container>;
  return <section className="detalle-blog py-5"><Container><h1 className="text-white text-center fw-bold mb-5">{post.tituloDetalle}</h1><article className="blog-card row align-items-center g-4 p-4 m-0"><Col lg={7}><p className="blog-detail-text mb-0">{post.texto}</p></Col><Col lg={5}><img src={`/imagenes/${post.imagenDetalle}`} alt={post.tituloDetalle} className="img-fluid detail-blog-img w-100" /></Col><Col xs={12}><Button as={Link} to="/blogs" variant="danger" className="fw-bold">VOLVER AL BLOG</Button></Col></article></Container></section>;
}
