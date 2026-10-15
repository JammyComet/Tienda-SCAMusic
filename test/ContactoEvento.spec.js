import { fireEvent, render, screen } from "@testing-library/react";
import Swal from "sweetalert2";
import Contacto from "../src/pages/Contacto.jsx";

describe("Prueba de Eventos - Contacto", function () {

  beforeEach(function () {
    localStorage.clear();
  });

  it("debe marcar el formulario como invalido al enviar datos invalidos", function () {

    spyOn(Swal, "fire").and.returnValue(Promise.resolve());

    render(<Contacto />);

    const nombre = screen.getAllByRole("textbox")[0];

    expect(nombre.classList.contains("is-invalid")).toBeFalse();

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(nombre.classList.contains("is-invalid")).toBeTrue();
    expect(Swal.fire).toHaveBeenCalledOnceWith(
      "Revisa el formulario",
      "Existen campos obligatorios o inválidos.",
      "error"
    );

  });

  it("debe enviar el formulario cuando los datos son validos", function () {

    spyOn(Swal, "fire").and.returnValue(Promise.resolve());

    render(<Contacto />);

    const campos = screen.getAllByRole("textbox");

    fireEvent.change(campos[0], { target: { value: "Juan Perez" } });
    fireEvent.change(campos[1], { target: { value: "juan@gmail.com" } });
    fireEvent.change(campos[2], { target: { value: "Quiero consultar por un producto." } });

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(Swal.fire).toHaveBeenCalledOnceWith(
      "Mensaje enviado",
      "Gracias por escribirnos, te responderemos pronto.",
      "success"
    );
    expect(campos[0].classList.contains("is-invalid")).toBeFalse();

  });

});
