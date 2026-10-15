import ItemCarrito from "../src/components/molecules/ItemCarrito.jsx";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";

describe("Prueba de Props - ItemCarrito", function () {

    afterEach(function () {
        cleanup();
    });

    const productoBase = {
        codigo: "12345",
        nombre: "Producto de prueba",
        artista: "Artista de prueba",
        imagen: "",
        stock: 5,
        cantidad: 1,
        precioOriginal: 10000,
        descuento: 0,
        subtotal: 10000
    };

    it("debe mostrar la etiqueta Eliminar y llamar la función al hacer clic", function () {

        const eliminarMock = jasmine.createSpy("eliminar");

        render(
            <ItemCarrito
                producto={productoBase}
                eliminar={eliminarMock}
                cambiarCantidad={() => {}}
            />
        );

        const botonEliminar = screen.getByRole("button", {
            name: "Eliminar"
        });

        expect(botonEliminar).toBeTruthy();
        expect(eliminarMock).not.toHaveBeenCalled();

        fireEvent.click(botonEliminar);

        expect(eliminarMock).toHaveBeenCalledOnceWith("12345");
    });

    it("debe utilizar correctamente un código de producto diferente", function () {

        const eliminarMock = jasmine.createSpy("eliminar");

        const producto = {
            ...productoBase,
            codigo: "ABC789"
        };

        render(
            <ItemCarrito
                producto={producto}
                eliminar={eliminarMock}
                cambiarCantidad={() => {}}
            />
        );

        fireEvent.click(
            screen.getByRole("button", { name: "Eliminar" })
        );

        expect(eliminarMock).toHaveBeenCalledOnceWith("ABC789");
    });

    it("debe manejar un código de producto extremadamente largo", function () {

        const eliminarMock = jasmine.createSpy("eliminar");

        const codigoExtremo = "A".repeat(5000);

        const producto = {
            ...productoBase,
            codigo: codigoExtremo
        };

        render(
            <ItemCarrito
                producto={producto}
                eliminar={eliminarMock}
                cambiarCantidad={() => {}}
            />
        );

        fireEvent.click(
            screen.getByRole("button", { name: "Eliminar" })
        );

        expect(eliminarMock).toHaveBeenCalledOnceWith(codigoExtremo);
    });

});