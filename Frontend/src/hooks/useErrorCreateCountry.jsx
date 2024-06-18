import Swal from "sweetalert2/dist/sweetalert2.all.js";

export const useErrorCreateCountry = (
  resCreateCountry,
  setResCreateCountry,
  setCreateCountry
) => {
  if (resCreateCountry?.status == 200) {
    console.log("esta todo correcto");
    setCreateCountry(resCreateCountry.CreateCountry);
    setResCreateCountry(() => ({}));
  }

  if (
    resCreateCountry?.response?.status == 404 ||
    resCreateCountry?.response?.status == 500
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error en la app, vuelva mas tarde",
      showConfirmButton: false,
      timer: 1500,
    });
    setResCreateCountry(() => ({}));
  }
};
