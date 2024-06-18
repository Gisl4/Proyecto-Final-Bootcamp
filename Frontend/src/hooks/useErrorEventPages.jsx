import Swal from "sweetalert2/dist/sweetalert2.all.js";

export const useErrorEventPages = (res, setRes, setEvents) => {
  // 200 --> lo que vamos es hacer setear la data en el setData
  if (res?.status == 200) {
    console.log("esta todo correcto");
    setEvents(res.data.allEvent);
    setRes(() => ({}));
  }

  if (res?.response?.status == 404 || res?.response?.status == 500) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error en la app, vuelva mas tarde",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => ({}));
  }
};
