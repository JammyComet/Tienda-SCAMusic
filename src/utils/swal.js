import Swal from "sweetalert2";
export const mostrarExito=(titulo,texto="")=>Swal.fire({icon:"success",title:titulo,text: texto});
export const mostrarError=(titulo,texto="")=>Swal.fire({icon:"error",title:titulo,text: texto});
export const confirmar=(titulo,texto="",confirmButtonText="Confirmar")=>Swal.fire({icon:"question",title:titulo,text: texto,showCancelButton:true,confirmButtonText,cancelButtonText:"Cancelar"});
