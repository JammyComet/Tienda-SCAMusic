import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ItemCarrito from "../components/molecules/ItemCarrito";
import Precio from "../components/atoms/Precio";
import ModalEntrega from "../components/organisms/ModalEntrega";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { formatearPrecio } from "../utils/format";

export default function Carrito() {
  const { items, total, cambiarCantidad, eliminar, vaciar, finalizarCompra } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [mostrarEntrega, setMostrarEntrega] = useState(false);

  async function pagar() {
    if (!usuario) {
      const resultado = await Swal.fire({ icon: "info", title: "Inicia sesión para pagar", text: "Tu carrito se mantendrá guardado.", showCancelButton: true, confirmButtonText: "Iniciar sesión", cancelButtonText: "Seguir comprando" });
      if (resultado.isConfirmed) navigate("/login", { state: { desde: "/carrito" } });
      return;
    }
    setMostrarEntrega(true);
  }

  async function confirmarPago(entrega) {
    setMostrarEntrega(false);
    const confirmacion = await Swal.fire({
      icon: "question",
      title: "Confirmar compra",
      html: `Total a pagar: <strong>${formatearPrecio(total)}</strong><br><span style="font-size:.9rem">Entrega en ${entrega.direccion}, ${entrega.comuna}</span>`,
      showCancelButton: true,
      confirmButtonText: "Pagar",
      cancelButtonText: "Cancelar",
    });
    if (!confirmacion.isConfirmed) return;

    const resultado = finalizarCompra(entrega);
    if (!resultado.ok) {
      Swal.fire("No se pudo pagar", resultado.mensaje, "warning");
      return;
    }
    navigate(`/pago-exitoso?orden=${encodeURIComponent(resultado.orden.codigo)}`);
  }

  return (
    <Container className="py-5">
      <h1 className="mb-5">C A R R I T O</h1>
      <Row>
        <Col lg={8}>
          {!items.length ? (
            <div className="text-center py-5">
              <h2 className="h4">Tu carrito está vacío</h2>
              <Button as={Link} to="/productos" variant="dark">Ir a productos</Button>
            </div>
          ) : items.map((producto) => (
            <ItemCarrito key={producto.codigo} producto={producto} cambiarCantidad={cambiarCantidad} eliminar={eliminar} />
          ))}
        </Col>
        <Col lg={4} className="sidebar-total">
          <div className="p-4">
            <h2 className="h3">TOTAL:</h2>
            <p className="display-6"><Precio valor={total} className="fw-bold" /></p>
            {!usuario && items.length > 0 && <p className="small text-secondary">Debes iniciar sesión para completar el pago.</p>}
            <div className="d-flex gap-2 mb-2">
              <Button className="btn-pagar flex-fill" disabled={!items.length} onClick={pagar}>{usuario ? "PAGAR" : "INICIAR SESIÓN"}</Button>
              <Button variant="outline-danger" className="flex-fill" disabled={!items.length || !usuario} onClick={() => navigate("/pago-error")}>SIMULAR ERROR</Button>
            </div>
            <Button variant="outline-danger" className="w-100" disabled={!items.length} onClick={vaciar}>Vaciar carrito</Button>
          </div>
        </Col>
      </Row>

      <ModalEntrega
        mostrar={mostrarEntrega}
        usuario={usuario}
        totalTexto={formatearPrecio(total)}
        onCerrar={() => setMostrarEntrega(false)}
        onConfirmar={confirmarPago}
      />
    </Container>
  );
}
