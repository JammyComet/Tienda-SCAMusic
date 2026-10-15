import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListaBlogs from "../src/components/organisms/ListaBlogs.jsx";

describe("Prueba de Renderizado - ListaBlogs", function () {

  it("debe mostrar todos los blogs cuando recibe datos validos", function () {

    const blogs = [
      {
        id: 1,
        titulo: "Historia del vinilo",
        descripcion: "Blog de prueba uno",
        imagen: "blog1.jpg"
      },
      {
        id: 2,
        titulo: "Cómo cuidar tus discos",
        descripcion: "Blog de prueba dos",
        imagen: "blog2.jpg"
      }
    ];

    render(
      <MemoryRouter>
        <ListaBlogs blogs={blogs} />
      </MemoryRouter>
    );

    expect(screen.getByText("Historia del vinilo")).toBeTruthy();
    expect(screen.getByText("Cómo cuidar tus discos")).toBeTruthy();

  });

  it("no debe mostrar blogs cuando recibe una lista vacia", function () {

    render(
      <MemoryRouter>
        <ListaBlogs blogs={[]} />
      </MemoryRouter>
    );

    expect(screen.queryByRole("article")).toBeNull();

  });

});
