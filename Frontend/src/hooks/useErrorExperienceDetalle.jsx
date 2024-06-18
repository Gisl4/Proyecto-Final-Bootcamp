import { useEffect } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";

export const useErrorExperienceDetalle = (
  resExperience,
  setResExperience,
  setExperienceById
) => {
  useEffect(() => {
    if (!resExperience) return;

    // Verifica si resEvent tiene un status 200
    if (resExperience.status === 200) {
      console.log("Está todo correcto");
      setExperienceById(resExperience.data);
      setResExperience({});
    }
    // Verifica si resEvent tiene una respuesta con status 404 o 500
    else if (
      resExperience.response?.status === 404 ||
      resExperience.response?.status === 500
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error en la app, vuelva más tarde",
        showConfirmButton: false,
        timer: 1500,
      });
      setResExperience({});
    }
  }, [resExperience, setResExperience, setExperienceById]);
};
