import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../src/pages/Login.jsx";
import { AuthContext } from "../src/context/AuthContext.jsx";

describe("Prueba de State - Login", function () {

  afterEach(function () {
    cleanup();
  });

  function prepararLogin() {
    const autenticacionSimulada = {
      login: jasmine.createSpy("login")
    };

    render(
      <AuthContext.Provider value={autenticacionSimulada}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    return screen.getByPlaceholderText("usuario@gmail.com");
  }

  it("debe actualizar el estado con un correo válido", function () {

    const correo = prepararLogin();

    expect(correo.value).toBe("");

    fireEvent.change(correo, {
      target: { value: "prueba@gmail.com" }
    });

    expect(correo.value).toBe("prueba@gmail.com");
  });

  it("debe actualizar el estado con un correo de formato inválido", function () {

    const correo = prepararLogin();

    fireEvent.change(correo, {
      target: { value: "correo-sin-arroba" }
    });

    expect(correo.value).toBe("correo-sin-arroba");
  });

  it("debe permitir borrar el texto ingresado", function () {

    const correo = prepararLogin();

    fireEvent.change(correo, {
      target: { value: "prueba@gmail.com" }
    });

    fireEvent.change(correo, {
      target: { value: "" }
    });

    expect(correo.value).toBe("");
  });

  it("debe manejar una entrada de 5000 caracteres", function () {

    const correo = prepararLogin();

    const textoExtremo = "A".repeat(5000);

    fireEvent.change(correo, {
      target: { value: textoExtremo }
    });

    expect(correo.value).toBe(textoExtremo);
  });

});