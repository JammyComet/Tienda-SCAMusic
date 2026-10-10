import { useState } from "react";
import { Button, Col, Container, Offcanvas, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ modo }) {
  const [show, setShow] = useState(false);
  return <div className="admin-body min-vh-100"><Container fluid><Row className="min-vh-100"><Col lg={2} className="d-none d-lg-block px-0"><AdminSidebar modo={modo} /></Col><Col xs={12} className="d-lg-none p-3 pb-0"><Button variant="dark" onClick={() => setShow(true)}><i className="bi bi-list" /> Menú</Button></Col><Col lg={10} className="p-4 p-lg-5"><Outlet /></Col></Row></Container><Offcanvas show={show} onHide={() => setShow(false)} className="text-bg-dark"><Offcanvas.Header closeButton closeVariant="white"><Offcanvas.Title>SCAMusica</Offcanvas.Title></Offcanvas.Header><Offcanvas.Body><AdminSidebar modo={modo} onNavigate={() => setShow(false)} /></Offcanvas.Body></Offcanvas></div>;
}
