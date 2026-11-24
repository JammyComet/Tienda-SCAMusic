import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Swal from "sweetalert2";
import Registro from "../src/pages/Registro.jsx";

describe("Prueba de Renderizado Condicional - Registro", function () {
  beforeEach(function () {
    spyOn(window, "fetch").and.callFake(async function (url, options = {}) {
      if (!String(url).endsWith("/api/v1/usuarios/registro") || options.method !== "POST") {
        throw new Error(`La prueba esperaba POST /api/v1/usuarios/registro, llegó: ${options.method} ${url}`);
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

  it("debe mostrar un mensaje de error cuando los datos son invalidos", function () {
    render(<Registro />);
    expect(Swal.fire).not.toHaveBeenCalled();
    const formulario = screen.getByRole("button", { name: "Registrar usuario" }).closest("form");
    fireEvent.submit(formulario);
    expect(Swal.fire).toHaveBeenCalledOnceWith(
      "Revisa el formulario", "Existen campos obligatorios o inválidos.", "error"
    );
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it("debe registrar al usuario cuando los datos son validos", async function () {
    const { container } = render(<Registro />);
    const inputs = container.querySelectorAll("input");
    const selects = container.querySelectorAll("select");
    fireEvent.change(inputs[0], { target: { value: "12345678" } });
    fireEvent.change(inputs[1], { target: { value: "Juan" } });
    fireEvent.change(inputs[2], { target: { value: "Perez" } });
    fireEvent.change(inputs[3], { target: { value: "juanprueba@gmail.com" } });
    fireEvent.change(inputs[4], { target: { value: "2000-01-01" } });
    fireEvent.change(inputs[5], { target: { value: "912345679" } });
    // El frontend actual exige una contraseña de 8 a 72 caracteres.
    fireEvent.change(inputs[6], { target: { value: "ClavePrueba123" } });
    fireEvent.change(inputs[7], { target: { value: "ClavePrueba123" } });
    fireEvent.change(selects[0], { target: { value: "Región Metropolitana de Santiago" } });
    fireEvent.change(selects[1], { target: { value: "Santiago" } });
    fireEvent.change(inputs[8], { target: { value: "Calle Prueba 123" } });

    const formulario = screen.getByRole("button", { name: "Registrar usuario" }).closest("form");
    await act(async () => { fireEvent.submit(formulario); });

    expect(window.fetch).toHaveBeenCalled();
    const [url, opciones] = window.fetch.calls.mostRecent().args;
    expect(url).toContain("/api/v1/usuarios/registro");
    expect(opciones.method).toBe("POST");
    const datos = JSON.parse(opciones.body);
    expect(datos.correo).toBe("juanprueba@gmail.com");
    expect(datos.contrasena).toBe("ClavePrueba123");
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(
      "Registro exitoso", "El usuario fue registrado correctamente.", "success"
    ));
    expect(Swal.fire).not.toHaveBeenCalledWith(
      "Revisa el formulario", "Existen campos obligatorios o inválidos.", "error"
    );
  });
});
