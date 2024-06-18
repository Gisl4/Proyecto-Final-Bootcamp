import Swal from "sweetalert2/dist/sweetalert2.all.js";
export const useUpdateErrorEvent = (res, setRes, setEvent) => {
  //!---------------------------------------> 200
  let contador;
  if (res?.data) {
    contador = 0;
    res?.data?.testUpdate?.map((item) => {
      for (let clave in item) {
        /** vamos a contar que cosas se han actualizado y cuales no -CUENTA LOS FALSE */
        if (item[clave] == false) {
          contador++;
        }
      }
    });
  }
  /*** si el contador esta a 0 quiere decir que se ha actualizado todo porque no hay ningun false */
  if (contador == 0) {
    let check = "";

    res?.data?.testUpdate?.forEach((item) => {
      for (let clave in item) {
        if (item[clave] == true) {
          check += `-${clave}-`;
        }
      }
    });
    if (res?.status == 200) {
      
     
      setRes(() => ({}));
      return Swal.fire({
        icon: "success",
        title: `Update data user✅`,
        text: ` Update: ${check} `,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  if (contador != 0) {
    if (res?.status == 200) {
      console.log("entro");
      setRes(() => ({}));
      return Swal.fire({
        icon: "success",
        title: `Your profile has been updated`,
        text: `✅  updated`,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
  //! -------------------------------------> 404 general y el 500

  if (res?.response?.status == 500 || res?.response?.status == 404) {
    setRes(() => ({}));
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Interval Server Error! Don't update user ❎ ",
      showConfirmButton: false,
      timer: 2000,
    });
  }
};
