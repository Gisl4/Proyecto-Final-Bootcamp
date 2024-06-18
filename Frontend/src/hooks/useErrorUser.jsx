import Swal from "sweetalert2/dist/sweetalert2.all.js";

export const useErrorUser = (resUser, setResUser, setUserById) => {
  // 200 --> lo que vamos es hacer setear la data en el setData
  if (resUser?.status == 200) {
    console.log("esta todo correcto");
    setUserById(resUser.data);
    setResUser(() => ({}));
  }

  if (resUser?.response?.status == 404 || resUser?.response?.status == 500) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error en la app, vuelva mas tarde",
      showConfirmButton: false,
      timer: 1500,
    });
    setResUser(() => ({}));
  }
  /// para el resto de errores lanzamos un modal diciendo tenemos un error

  // res.response.status
};
