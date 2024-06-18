import Swal from "sweetalert2/dist/sweetalert2.all.js";

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CONFLICT = 409;
const HTTP_STATUS_VALIDATION_ERROR = 422; // Cambia esto al código de estado correcto si es diferente
const HTTP_STATUS_SERVER_ERROR = 500;

export const useErrorRegister = (res, setRes, setOk) => {
  if (res) {
    if (res.status === HTTP_STATUS_OK) {
      //* guardo la data en el localStorage
      const dataToString = JSON.stringify(res);
      localStorage.setItem("data", dataToString);

      //* setear el register ok
      setOk(true);

      //* lanzo swal
      Swal.fire({
        title: "Registro hecho!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

      //*  seteo la respuesta al estado inicial
      setRes({});
    } else if (res.response) {
      if (res.response.status === HTTP_STATUS_CONFLICT) {
        Swal.fire({
          title: "El email no es válido",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      } else if (
        res.response.status === HTTP_STATUS_VALIDATION_ERROR &&
        res.response.data?.includes("validation failed: password")
      ) {
        Swal.fire({
          title:
            "Min 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 caracter especial",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
      } else if (res.response.status === HTTP_STATUS_SERVER_ERROR) {
        Swal.fire({
          title: "internal server error 500, inténtalo de nuevo",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        // Manejo de cualquier otro error no anticipado
        Swal.fire({
          title: `Error ${res.response.status}: ${res.response.statusText || 'Ocurrió un error'}`,
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
      }

      setRes({});
    }
  }
};
