import { Button } from "react-bootstrap";

export default function BotonAccion({ etiqueta, onClick, size, variant, className }) {
  return (
    <Button size={size} variant={variant} className={className} onClick={onClick}>
      {etiqueta}
    </Button>
  );
}
