import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./components/atoms/atoms.css";
import "./components/molecules/molecules.css";
import "./components/organisms/organisms.css";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { inicializarDatos } from "./data/storage.js";

try {
  await inicializarDatos();
} catch (error) {
  document.getElementById("root").textContent = `No se pudo conectar con Spring Boot: ${error.message}. Comprueba los servicios del backend y vuelve a cargar la página.`;
  throw error;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider><App /></CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
