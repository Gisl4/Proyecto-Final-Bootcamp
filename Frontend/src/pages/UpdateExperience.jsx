import { useForm } from "react-hook-form";
import "./FormProfile.css";
import { Uploadfile } from "../components";
import { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useErrorExperienceDetalle } from "../hooks";
import { Navigate, useParams } from "react-router-dom";
import { byId, update } from "../services/experiences.service";

export const UpdateExperience = () => {
  const [ok, setOk] = useState(false);
  const [experienceById, setExperienceById] = useState(null);
  const { id } = useParams();
  const [resExperience, setResExperience] = useState(null);
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);

  const defaultData = {
    name: experienceById?.name,
    description: experienceById?.description,
  };

  const formSubmit = (formData) => {
    Swal.fire({
      title: "¿Estás seguro de que quieres actualizar los datos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb()",
      cancelButtonColor: "#d33",
      confirmButtonText: "YES",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const inputFile = document.getElementById("file-upload").files;
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("name", formData.name);
        formDataToSubmit.append("description", formData.description);

        if (inputFile.length != 0) {
          formDataToSubmit.append("image", inputFile[0]);
        }

        setSend(true);
        setRes(await update(id, formDataToSubmit));
        setSend(false);
      }
    });
  };

  useEffect(() => {
    const fetchExperience = async () => {
      const response = await byId(id);
      setResExperience(response);
    };
    fetchExperience();
  }, [id]);

  useErrorExperienceDetalle(resExperience, setResExperience, setExperienceById);
  if (send) {
    return <Navigate to="/profile" />;
  }

  return (
    <>
      <div className="containerProfile">
        <div className="form-wrap formProfile">
          <h1>Actualiza tu experiencia ♻</h1>
          <p>Introduce los nuevos datos de tu experiencia</p>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Nombre de la experiencia
              </label>
              <input
                className="input_user"
                type="text"
                id="name"
                name="name"
                autoComplete="false"
                defaultValue={defaultData?.name}
                {...register("name")}
              />
            </div>

            <div className="description_container form-group">
              <label htmlFor="description" className="custom-placeholder">
                Descripción
              </label>
              <input
                className="input_user"
                type="text"
                id="description"
                name="description"
                defaultValue={defaultData?.description}
                {...register("description", { required: true })}
              />
            </div>

            <Uploadfile />

            <div className="btn_container">
              <button
                className="btn"
                type="submit"
                disabled={send}
                style={{ background: send ? "#49c1a388" : "#FEB0CD" }}
              >
                ACTUALIZA LOS DATOS
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
