import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Swal from "sweetalert2";
import Registro from "../src/pages/Registro.jsx";

describe("Prueba de Renderizado Condicional - Registro", function () {

  // La persistencia se realiza en Spring Boot: las pruebas simulan la respuesta HTTP.
  beforeEach(function () {
    spyOn(window, "fetch").and.returnValue(Promise.resolve({
      ok: true, status: 201, headers: { get: () => null },
      text: async () => JSON.stringify({ id: 10 })
    }));
  });

  it("debe mostrar un mensaje de error cuando los datos son invalidos", function () {

    spyOn(Swal, "fire").and.returnValue(Promise.resolve());

    render(<Registro />);

    expect(Swal.fire).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Registrar usuario" }));

    expect(Swal.fire).toHaveBeenCalledOnceWith(
      "Revisa el formulario",
      "Existen campos obligatorios o inválidos.",
      "error"
    );

  });

  it("debe registrar al usuario cuando los datos son validos", async function () {

    spyOn(Swal, "fire").and.returnValue(Promise.resolve());

    const { container } = render(<Registro />);
    const inputs = container.querySelectorAll("input");
    const selects = container.querySelectorAll("select");

    fireEvent.change(inputs[0], { target: { value: "12345678" } });
    fireEvent.change(inputs[1], { target: { value: "Juan" } });
    fireEvent.change(inputs[2], { target: { value: "Perez" } });
    fireEvent.change(inputs[3], { target: { value: "juanprueba@gmail.com" } });
    fireEvent.change(inputs[4], { target: { value: "2000-01-01" } });
    fireEvent.change(inputs[5], { target: { value: "912345679" } });
    fireEvent.change(inputs[6], { target: { value: "1234" } });
    fireEvent.change(inputs[7], { target: { value: "1234" } });
    fireEvent.change(selects[0], { target: { value: "Región Metropolitana de Santiago" } });
    fireEvent.change(selects[1], { target: { value: "Santiago" } });
    fireEvent.change(inputs[8], { target: { value: "Calle Prueba 123" } });

    fireEvent.click(screen.getByRole("button", { name: "Registrar usuario" }));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(
      "Registro exitoso",
      "El usuario fue registrado correctamente.",
      "success"
    ));
    expect(window.fetch).toHaveBeenCalled();

    expect(Swal.fire).not.toHaveBeenCalledWith(
      "Revisa el formulario",
      "Existen campos obligatorios o inválidos.",
      "error"
    );

  });

});
