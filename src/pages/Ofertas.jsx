import {useEffect, useState} from "react";
import { Container } from "react-bootstrap"; // Importa el componente Container de react-bootstrap, que se utiliza para envolver el contenido y aplicar estilos de diseño responsivo.
import TituloSeccion from "../components/atoms/TituloSeccion"; // componente propio del proyecto. Importa el componente TituloSeccion, que se utiliza para mostrar un título de sección en la página con el estilo de las demas paginas.
import ListaProductos from "../components/organisms/ListaProductos"; // componente propio del proyecto. Importa el componente ListaProductos, que se utiliza para mostrar una lista de productos en la página.
import {obtenerProductos } from "../data/storage"; // Importa la función obtenerProductos desde el archivo storage.js, que se utiliza para obtener la lista de productos almacenados en el almacenamiento local.

export default function Ofertas() {
  const [, setVersion] = useState(0);
useEffect(() => {
  const actualizar = () => setVersion((version) => version + 1);

  window.addEventListener("scamusic-data", actualizar);
  return () => window.removeEventListener("scamusic-data", actualizar);
}, []);

const ofertas = obtenerProductos().filter(
    (producto) => producto.estado === "Activo" && Number(producto.descuento) > 0
);

return (
    <Container className="py-5">
      <TituloSeccion className="text-center mb-4">
        Ofertas
      </TituloSeccion>

      <ListaProductos productos={ofertas} />
    </Container>
  );
}