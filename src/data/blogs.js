export const BLOGS = [
  {
    id: 1,
    titulo: "ÁLBUMES MÚSICALES",
    descripcion: "Más que música, es un mundo.",
    imagen: "conceptuales.jpg",
    tituloDetalle: "EL CONCEPTO COMO UN MUNDO",
    imagenDetalle: "banda.jpg",
    texto: "Los álbumes conceptuales son interesantes porque no se limitan a reunir canciones, sino que construyen una historia, idea o concepto que conecta todo el disco. Cada canción puede representar una parte de la trama, una emoción o una etapa del personaje que protagoniza la historia, haciendo que escuchar el álbum completo se sienta como recorrer una obra de principio a fin.",
  },
  {
    id: 2,
    titulo: "CÓMO EVOLUCIONAN LOS ARTISTAS Y BANDAS",
    descripcion: "Siempre ocurren casos de diferencias creativas, evoluciones en géneros, cambios, etc.",
    imagen: "artistas.jpg",
    tituloDetalle: "CAMBIOS A LA EVOLUCIÓN SONORA",
    imagenDetalle: "taylor.png",
    texto: "La evolución sonora es el síntoma más claro de que un proyecto musical está genuinamente vivo. Los artistas y bandas cambian de género o exploran nuevas texturas porque el estancamiento es enemigo de la creatividad. A medida que un músico madura, absorbe nuevas influencias y domina nuevas tecnologías, su sonido puede mutar para reflejar esa realidad.",
  },
];

export function obtenerBlogPorId(id) {
  return BLOGS.find((blog) => blog.id === Number(id));
}
