import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Swal from "sweetalert2";
import Contacto from "../src/pages/Contacto.jsx";

describe("Prueba de Eventos - Contacto", function () {
  beforeEach(function () {
    spyOn(window, "fetch").and.callFake(async function (url, options = {}) {
      if (!String(url).endsWith("/api/v1/contactos") || options.method !== "POST") {
        throw new Error(`La prueba esperaba POST /api/v1/contactos, llegó: ${options.method} ${url}`);
      }
      return {
        ok: true,
        status: 201,
        headers: { get: () => null },
        text: async () => JSON.stringify({ id: 10 })
      };
    });
    spyOn(Swal, "fire").and.returnValue(Promise.resolve());
  });

  it("debe marcar el formulario como invalido al enviar datos invalidos", function () {
    render(<Contacto />);
    const nombre = screen.getAllByRole("textbox")[0];
    expect(nombre.classList.contains("is-invalid")).toBeFalse();

    // El evento submit permite comprobar el manejador sin depender del click nativo de Chrome.
    const formulario = screen.getByRole("button", { name: "Enviar" }).closest("form");
    fireEvent.submit(formulario);

    expect(nombre.classList.contains("is-invalid")).toBeTrue();
    expect(Swal.fire).toHaveBeenCalledOnceWith(
      "Revisa el formulario", "Existen campos obligatorios o inválidos.", "error"
    );
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it("debe enviar el formulario cuando los datos son validos", async function () {
    render(<Contacto />);
    const campos = screen.getAllByRole("textbox");
    fireEvent.change(campos[0], { target: { value: "Juan Perez" } });
    fireEvent.change(campos[1], { target: { value: "juan@gmail.com" } });
    fireEvent.change(campos[2], { target: { value: "Quiero consultar por un producto." } });

    const formulario = screen.getByRole("button", { name: "Enviar" }).closest("form");
    await act(async () => { fireEvent.submit(formulario); });

    // Se comprueba la llamada a Spring Boot y, después, la alerta de éxito.
    expect(window.fetch).toHaveBeenCalled();
    const [url, opciones] = window.fetch.calls.mostRecent().args;
    expect(url).toContain("/api/v1/contactos");
    expect(opciones.method).toBe("POST");
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(
      "Mensaje enviado", "Gracias por escribirnos, te responderemos pronto.", "success"
    ));
    expect(campos[0].classList.contains("is-invalid")).toBeFalse();
  });
});
