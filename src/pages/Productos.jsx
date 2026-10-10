import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import Buscador from "../components/atoms/Buscador";
import TituloSeccion from "../components/atoms/TituloSeccion";
import ListaProductos from "../components/organisms/ListaProductos";
import { obtenerCategorias, obtenerProductos } from "../data/storage";

export default function Productos() {
  const [, setVersion] = useState(0);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    const actualizar = () => setVersion((version) => version + 1);
    window.addEventListener("scamusic-data", actualizar);
    return () => window.removeEventListener("scamusic-data", actualizar);
  }, []);

  const productos = obtenerProductos().filter((producto) => {
    const coincideTexto = producto.nombre.toLowerCase().includes(texto.toLowerCase()) || producto.artista.toLowerCase().includes(texto.toLowerCase());
    const coincideCategoria = !categoria || producto.categoriaId === Number(categoria);
    return producto.estado === "Activo" && coincideTexto && coincideCategoria;
  });

  return (
    <Container className="py-5">
      <TituloSeccion className="text-center mb-4">Discos</TituloSeccion>
      <Row className="mb-4 g-3">
        <Col md={6}><Buscador valor={texto} onChange={setTexto} placeholder="Buscar disco o artista" /></Col>
        <Col md={6}>
          <Form.Select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
            <option value="">Todos los géneros</option>
            {obtenerCategorias().map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
          </Form.Select>
        </Col>
      </Row>
      <ListaProductos productos={productos} />
    </Container>
  );
}
