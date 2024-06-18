import Swal from "sweetalert2/dist/sweetalert2.all.js";

export const useErrorEvent = (resData, setResData, setData) => {
  // 200 --> lo que vamos es hacer setear la data en el setData
  if (resData?.status == 200) {
    console.log("esta todo correcto");
    setData(resData.data);
    console.log("⚰️", resData.data);
    setResData(() => ({}));
  }

  if (resData?.response?.status == 404 || resData?.response?.status == 500) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error en la app, vuelva mas tarde",
      showConfirmButton: false,
      timer: 1500,
    });
    setResData(() => ({}));
  }
};
