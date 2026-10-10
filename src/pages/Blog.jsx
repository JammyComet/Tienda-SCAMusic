import { Container } from "react-bootstrap";
import TituloSeccion from "../components/atoms/TituloSeccion";
import ListaBlogs from "../components/organisms/ListaBlogs";
import { BLOGS } from "../data/blogs";

export default function Blog() {
  return <section className="blogs py-5"><Container><TituloSeccion className="text-white text-center fw-bold mb-5">TE PODRÍA INTERESAR</TituloSeccion><ListaBlogs blogs={BLOGS} /></Container></section>;
}
