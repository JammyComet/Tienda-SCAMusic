import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { REGIONES } from "../../data/regiones";

export default function ModalEntrega({ mostrar, usuario, totalTexto, onCerrar, onConfirmar }) {
  const [formulario, setFormulario] = useState({ region: "", comuna: "", direccion: "" });
  const [validado, setValidado] = useState(false);

  useEffect(() => {
    if (!mostrar) return;
    setFormulario({
      region: usuario?.region || "",
      comuna: usuario?.comuna || "",
      direccion: usuario?.direccion || "",
    });
    setValidado(false);
  }, [mostrar, usuario]);

  function set(campo, valor) {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
      ...(campo === "region" ? { comuna: "" } : {}),
    }));
  }

  function confirmar(evento) {
    evento.preventDefault();
    const regionValida = Boolean(formulario.region && REGIONES[formulario.region]);
    const comunaValida = regionValida && REGIONES[formulario.region].includes(formulario.comuna);
    const direccionValida = formulario.direccion.trim().length > 0;
    setValidado(true);
    if (!regionValida || !comunaValida || !direccionValida) return;
    onConfirmar({
      region: formulario.region,
      comuna: formulario.comuna,
      direccion: formulario.direccion.trim(),
    });
  }

  return (
    <Modal show={mostrar} onHide={onCerrar} centered backdrop="static">
      <Form noValidate onSubmit={confirmar}>
        <Modal.Header closeButton>
          <Modal.Title>Dirección de entrega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Label>Región</Form.Label>
              <Form.Select
                value={formulario.region}
                onChange={(evento) => set("region", evento.target.value)}
                isInvalid={validado && !formulario.region}
              >
                <option value="">Seleccione una región</option>
                {Object.keys(REGIONES).map((region) => <option key={region}>{region}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">Selecciona una región.</Form.Control.Feedback>
            </Col>
            <Col xs={12}>
              <Form.Label>Comuna</Form.Label>
              <Form.Select
                value={formulario.comuna}
                onChange={(evento) => set("comuna", evento.target.value)}
                disabled={!formulario.region}
                isInvalid={validado && (!formulario.comuna || !(REGIONES[formulario.region] || []).includes(formulario.comuna))}
              >
                <option value="">Seleccione una comuna</option>
                {(REGIONES[formulario.region] || []).map((comuna) => <option key={comuna}>{comuna}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">Selecciona una comuna válida.</Form.Control.Feedback>
            </Col>
            <Col xs={12}>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                value={formulario.direccion}
                onChange={(evento) => set("direccion", evento.target.value)}
                placeholder="Calle, número, departamento o referencia"
                isInvalid={validado && !formulario.direccion.trim()}
              />
              <Form.Control.Feedback type="invalid">Ingresa una dirección de entrega.</Form.Control.Feedback>
            </Col>
          </Row>
          <div className="bg-light rounded p-3 mt-4 d-flex justify-content-between align-items-center">
            <span>Total a pagar</span>
            <strong>{totalTexto}</strong>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onCerrar}>Cancelar</Button>
          <Button variant="dark" type="submit">Confirmar y pagar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
