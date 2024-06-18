import { useEffect } from 'react';
import Swal from "sweetalert2/dist/sweetalert2.all.js";

export const useErrorCountryDetalle = (resCountrie, setResCountrie, setCountrieById) => {
  useEffect(() => {
    if (!resCountrie) return;

    // Verifica si resEvent tiene un status 200
    if (resCountrie.status === 200) {
      console.log("Está todo correcto");
      setCountrieById(resCountrie.data);
      setResCountrie({});
    } 
    // Verifica si resEvent tiene una respuesta con status 404 o 500
    else if (resCountrie.response?.status === 404 || resCountrie.response?.status === 500) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error en la app, vuelva más tarde",
        showConfirmButton: false,
        timer: 1500,
      });
      setResCountrie({});
    }
  }, [resCountrie, setResCountrie, setCountrieById]);
}
  