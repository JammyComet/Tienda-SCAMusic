// Importa herramientas de React para guardar estado y reaccionar a cambios.
import { useEffect, useState } from "react";

// Componentes de React-Bootstrap para el diseño y los recuadros seleccionables.
import { Button, Col, Container, Row } from "react-bootstrap";

// Componentes del proyecto para mostrar el título y las tarjetas.
import TituloSeccion from "../components/atoms/TituloSeccion";
import ListaProductos from "../components/organisms/ListaProductos";

// Funciones que leen las categorías y los productos guardados.
import { obtenerCategorias, obtenerProductos } from "../data/storage";

// Esta función es la página completa de Categorías.
export default function Categorias() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Guardamos una versión para que React vuelva a dibujar la página
  // cuando cambien los productos o las categorías.
  const [, setVersion] = useState(0);

  // Escucha el evento que se emite al guardar cambios en los datos.
  useEffect(() => {
    const actualizar = () => {
      setVersion((version) => version + 1);
    };

    window.addEventListener("scamusic-data", actualizar);

    // Al salir de la página, deja de escuchar el evento.
    return () => {
      window.removeEventListener("scamusic-data", actualizar);
    };
  }, []);

  // Lee todas las categorías y conserva solo los productos activos.
  const categorias = obtenerCategorias();
  const productosActivos = obtenerProductos().filter(
    (producto) => producto.estado === "Activo"
  );

  // Asocia cada categoría con sus productos activos.
  const categoriasConProductos = categorias
    .map((categoria) => ({
      ...categoria,
      productos: productosActivos.filter(
        (producto) => producto.categoriaId === categoria.id
      ),
    }));
  const categoriaActual = categoriasConProductos.find(
    (categoria) => categoria.id === categoriaSeleccionada
  );

  // Define el contenido que aparecerá en pantalla.
  return (
    <Container className="py-5">
      <TituloSeccion className="text-center mb-4">
        Categorías
      </TituloSeccion>

      <Row className="g-3 mb-5">
        {categoriasConProductos.map((categoria) => (
          <Col key={categoria.id} xs={12} sm={6} md={4} lg={3}>
            <Button
              type="button"
              variant="dark"
              className="w-100 h-100 p-4 rounded-3 shadow-sm text-white"
              style={{
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.78)), url('/imagenes/fondo.jpg')",
                backgroundPosition: "center",
                backgroundSize: "cover",
                border: categoriaSeleccionada === categoria.id ? "3px solid white" : "1px solid #555",
              }}
              aria-pressed={categoriaSeleccionada === categoria.id}
              onClick={() => setCategoriaSeleccionada(categoria.id)}
            >
              <span className="d-block fs-5 fw-bold">{categoria.nombre}</span>
              <span className="d-block small">
                {categoria.productos.length} {categoria.productos.length === 1 ? "producto" : "productos"}
              </span>
            </Button>
          </Col>
        ))}
      </Row>

      {categoriaActual ? (
        <section>
          <h2 className="mb-4">{categoriaActual.nombre}</h2>
          {categoriaActual.productos.length > 0 ? (
            <ListaProductos productos={categoriaActual.productos} />
          ) : (
            <p className="text-center">Esta categoría todavía no tiene productos activos.</p>
          )}
        </section>
      ) : (
        <p className="text-center">Selecciona una categoría para ver sus discos.</p>
      )}
    </Container>
  );
}