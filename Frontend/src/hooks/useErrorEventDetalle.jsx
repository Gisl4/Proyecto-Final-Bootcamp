// import Swal from "sweetalert2/dist/sweetalert2.all.js";

// export const useErrorEventDetalle = (resEvent, setResEvent, setEventById) => {
//   // 200 --> lo que vamos es hacer setear la data en el setData
//   if (resEvent?.status == 200) {
//     console.log("esta todo correcto");
//     setEventById(resEvent.data);
//     setResEvent(() => ({}));
//   }
//   }

//   if (resEvent?.response?.status == 404 || resEvent?.response?.status == 500) {
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: "Error en la app, vuelva mas tarde",
//       showConfirmButton: false,
//       timer: 1500,
//     });
//     setResEvent(() => ({}));
//   }

import { useEffect } from 'react';
import Swal from "sweetalert2/dist/sweetalert2.all.js";

export const useErrorEventDetalle = (resEvent, setResEvent, setEventById) => {
  useEffect(() => {
    if (!resEvent) return;

    // Verifica si resEvent tiene un status 200
    if (resEvent.status === 200) {
      console.log("Está todo correcto");
      setEventById(resEvent.data);
      setResEvent({});
    } 
    // Verifica si resEvent tiene una respuesta con status 404 o 500
    else if (resEvent.response?.status === 404 || resEvent.response?.status === 500) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error en la app, vuelva más tarde",
        showConfirmButton: false,
        timer: 1500,
      });
      setResEvent({});
    }
  }, [resEvent, setResEvent, setEventById]);
}
  